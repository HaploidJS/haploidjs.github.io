# 超时设置

子应用在下列阶段允许设置超时时间。

## 请求 entry

可以通过 `entry.timeout` 来设置超时：

```ts
container.registerApp({
  name: "foo",
  entry: {
    url: "https://foo.com/entry",
    timeout: 5000,
  },
  activeWhen: "/foo",
});
```

## 生命周期

- load，包括请求必要的静态资源，执行JS代码、处理CSS等工作总耗时；
- bootstrap 生命周期，也包括 _app.lifecycle.beforebootstrap/afterbootstrap_ 消耗的时间；
- mount 生命周期，也包括 _app.lifecycle.beforemount/aftermount_ 消耗的时间；
- unmount 生命周期，也包括 _app.lifecycle.beforeunmount/afterunmount_ 消耗的时间；
- update 生命周期，也包括 _app.lifecycle.beforeupdate/afterupdate_ 消耗的时间；

```ts
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  timeouts: {
    load: 5000,
    bootstrap: 4000,
    mount: 3000,
    unmount: 3000,
    update: 3000,
  },
  activeWhen: "/foo",
});
```
