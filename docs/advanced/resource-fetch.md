# Resource Fetching

Typically, the main application loads a sub-application in two serial stages, each of which sets the parameters of the request.

## Load entry

Use the `entry.requestInit` option to set the parameters:

```ts
container.registerApp({
  name: "foo",
  entry: {
    url: "https://foo.com/entry",
    requestInit: {
      credentials: "include",
    } as RequestInit,
  },
  activeWhen: "/foo",
});
```

## Load Static Resource

Use the `fetchResourceOptions` option to set the parameters:

```ts
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  fetchResourceOptions: {
    credentials: "include",
  } as RequestInit,
});
```

It can also be set according to different resources:

```ts
container.registerApp({
  name: "foo",
  entry: "/entry/foo.html",
  fetchResourceOptions: (src: string): RequestInit => ({
    credentials: "include",
  }),
});
```
