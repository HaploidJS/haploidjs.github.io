# 资源请求

通常来说，主应用要以两个串行阶段来完成对一个子应用的加载，这两个阶段分别可以设置请求的参数。

## 加载 entry

通过 `entry.requestInit` 选项来设置参数

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

## 加载静态资源

通过 `fetchResourceOptions` 选项来设置参数

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

也可以根据资源的不同来分别设置：

```ts
container.registerApp({
  name: "foo",
  entry: "/entry/foo.html",
  fetchResourceOptions: (src: string): RequestInit => ({
    credentials: "include",
  }),
});
```
