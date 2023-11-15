# Restorability

[[toc]]

Haploid.js has made a lot of effort to enhance the stability and fault tolerance of the micro-frontend service on the page, hoping to have the user retry by refreshing the page as little as possible.

## Limit the number of concurrent application loads

There are at least two factors that trigger a load of sub-application:

- Triggered by user interaction, such as URL navigation to the specified application;
- [Preload](/guide/preload.html)

Now that browsers support ESM, more and more applications are packaged with CSS and JS at a finer granularity, resulting in a large number of concurrent requests for sub-applications in the `load` phase.

If too many applications load at the same time, performance problems can occur and even increase the probability of errors.

Haploid.js provides a container construction parameter called `maxLoadConcurrency` to control the maximum concurrency of the load sub-application.

In fact, this parameter affects not only the sub-applications under this container, but the entire browser page. If your page has multiple container instances, then you should all share the `maxLoadConcurrency` concurrency of the first container:

```html{3}
<head>
    <script>
        var __HAPLOID_MAX_LOAD_CONCURRENCY__ = 4;
    </script>
</head>
```

The default concurrency is 4, meaning that if five applications load at the same time, the last one will wait to reduce the strain on the network.

You can adjust the value as appropriate.

## Request entry retry

If the entry request fails, you can retry, which requires objectified parameters for the `entry` option:

```ts{5}
container.registerApp({
  name: "foo",
  entry: {
    url: "https://foo.com/entry",
    reties: 3,
  },
  activeWhen: "/foo",
});
```

## Request resource retry

If the resource (CSS or JS in UMD) request fails, you can also choose to retry.

Haploid.js provides two parameters: `maxLoadRetryTimes` (default 2) and `loadRetryTimeout` (default 6000).

```ts{5-6}
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  maxLoadRetryTimes: 2,
  loadRetryTimeout: 6000,
});
```

Their meaning is that **if the interval between failures is less than _loadRetryTimeout_ milliseconds and _maxLoadRetryTimes_ occurs consecutively, then the request is judged to have failed**.

The purpose of this design is that **there is always room for future retries without a single failure**. In this case, the user simply switches to another application, cuts back, and retries without having to refresh the page.

## Router Dead Loop Detection

See [Router Dead Loop Detection](/guide/router-dead-loop-detect.html) for more details.

## UMD Cache

It is well known that UMD writes variables globally from which the main application obtains sub-application lifecycle functions, such as bootstrap/mount/unmount/update.

We use the logic of [systemjs](https://github.com/systemjs/systemjs/blob/main/src/extras/global.js) to detect this key, and in the future it may be available for users to specify manually.

If the same sub-application is registered twice (which is a high probability event under instance destruction), then it will refer to the same UMD resource, and Haploid.js chooses not to repeat the execution of JS code, but to use the key that was previously cached down.

To do this, Haploid.js builds a page-level Map, as follows:

```
{
    'https://foostatic.com/static/main.js': 'foo-entry-key'
}
```

All instances on the same page, even different copies of Haploid.js, make the most of this Map, saving money and avoiding the side effects of running the same copy of UMD code multiple times.
