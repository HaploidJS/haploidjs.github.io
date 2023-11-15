# Timeouts

Sub-applications allow setting timeout times in the following stage.

## Entry Fetching

You can set a timeout by using `entry.timeout`:

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

## Lifecycles

- `load`, this includes the total time required to request the necessary static resources, execute JS code to process CSS, and so on
- `bootstrap` lifecycle, including _app.lifecycle.beforebootstrap/afterbootstrap_ consumption of time;
- `mount` lifecycle, including _app.lifecycle.beforemount/aftermount_ consumption of time;
- `unmount` lifecycle, including _app.lifecycle.beforeunmount/afterunmount_ consumption of time;
- `update` lifecycle, including _app.lifecycle.beforeupdate/afterupdate_ consumption of time

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
