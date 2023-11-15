# Preload

Some applications clearly have a relatively large probability of use, in order to speed up the page jump, you can set to preload.

```ts
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  preload: true, // enable
  preloadDelay: 1000, // delay
});
```

After the `preload` option is enabled, the system will rely on _requestIdleCallback_ to find the time to load the JS/CSS resources of the child application in advance, and get the life cycle function, where the `preloadDelay` option is the delay time, the default is 0.

If sub-application A is in the process of preloading, and A user action triggers activation of A, then the ongoing loading process is reused.

Even if the preload fails, it does not affect subsequent attempts to activate the application.

## Intelligent Preload

The Container also provides a `preload` construction parameter, which has several different value types.

This parameter is valid only for applications that do not specify `preload` during registration. true: forces sub-applications to preload, and false: forces sub-applications not to preload.

Once set to `"auto"`, the container starts an LRU-Cache-like module based on the **localStorage**, calculates the access popularity of the sub-application, and performs a preload the next time the sub-application is registered again.

```ts
new ManualContainer({
  name: "foo",
  root: "#app",
  preload: "auto",
});
```

You can also fine-control LRU-Cache by setting `preload` as an object:

```ts
new ManualContainer({
  name: "foo",
  root: "#app",
  preload: {
    max: 30, // The number of entries for multiple records. The default is 30
    expire: 7 * 86400 * 1000, // The default value is 7 days
    factor: 0.1, // Weight convergence coefficient, default is 0.1
    top: 5, // Top 5 applications with maximum expected popularity
    onExceed: (key: string) => {
      console.log(key, "记录溢出");
    },
  },
});
```

**factor** is the coefficient of an inverse function, and the heat is calculated by **f(x) = expire / (x + expire \* factor)**, where x is the time difference between the child application `afterstart` event today. Under the default value of 0.1, the weight convergence curve is:

![](/assets/factor-01.png)

If the default value is 0.01, the weight convergence curve is:

![](/assets/factor-001.png)

In other words, the smaller the value, the faster the convergence, which means that the sub-application startup behavior occurred at a time point farther away from now, the change rate of its heat contribution is about small. For example, under the condition of 0.1, the heat contribution brought by visiting application b twice yesterday is greater than the heat contribution of visiting A once today, but it is 0.01 Conditions, most likely the opposite.

::: tip
Custom convergence functions are not currently supported.
:::
