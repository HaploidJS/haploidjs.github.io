# 保活

如果你使用过Vue，相信对其中的 <a href="https://vuejs.org/guide/built-ins/keep-alive.html" target="_blank">KeepAlive</a> 组件一定不会陌生。它实现了一种路由切走，但是 DOM 不销毁的机制。

Haploid.js 提供了类似的功能，只隐藏子应用的 DOM 而不销毁。具体做法是为子应用声明 `keepAlive` 选项，其取值为：

```ts
type KeepAlive =
  | boolean
  | {
      useHiddenAttribute?: boolean;
      useHiddenClass?: string;
      detachDOM?: boolean;
    };

container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  keepAlive: {
    useHiddenAttribute: true,
  },
});
```

根据取值的不同，Haploid.js 不销毁 DOM 的实现也有所不同。

- 如果 `useHiddenAttribute=true`，则子应用的根元素上会通过加上 `"hidden"` 属性来隐藏；
- 如果声明了 `useHiddenClass`，则子应用的根元素上会通过加上该取值的 CSS 类名；
- 如果 `detachDOM=true`，则子应用的根元素会被从其父元素上移除；
- 如果 `keepAlive=true`，等等价于 `keepAlive={}`，即上述三个参数都是 undefined；
- 默认地，子应用的根元素会使用 `style.display="none"` 来隐藏

对于保活的子应用，可以为其声明额外两个生命周期函数：**suspend** 和 **resume**。

::: warning
需要特别注意，虽然子应用被隐藏了，但是其依然可以对全局事件做出反应，比如 `"popstate"`，你应该小心处理，避免对其它应用造成干扰。

严格的做法是在 _suspend_ 中取消对全局事件的监听，不过这很难做到，可能需要配合沙盒来实现。
:::
