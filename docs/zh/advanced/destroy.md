# 实例销毁

实例销毁等价于容器（Container）销毁。

实例销毁的诉求来自于微前端与现有路由（vue-router/react-router）模块的共存场景，例如在一个现有的 vue-router 项目的某个 &lt;router-view&gt; 页面中实例化微前端，那么当顶层路由切换后，这个页面中的微前端必然需要被清理，否则可能出现一些副作用：

- 一些资源独占操作在二次初始化时可能有冲突和重复，比如事件绑定
- 没有被结束的异步逻辑可能依然对页面产生影响，比如全局弹窗

一旦容器需要销毁，那么其注册的应用就会尽可能停止活动，清理资源和变量。建议在组件的适当生命周期中执行 `destroy()` 销毁：

```ts
import { onBeforeUnmount } from "vue";

onBeforeUnmount(() => {
  container.destroy();
});
```

**容器的销毁也是一个异步过程**，可以通过监听事件的办法来跟踪：

```ts
container.on("destroying", () => {});
container.on("destroyed", () => {});
```

一旦容器开始销毁，那么它将不再允许注册新的子应用、新的事件响应函数、执行关键函数逻辑以及响应路由变更。

::: warning
之所以 `destroy()` 是异步的，除了子应用的 _unmount_ 定义为可异步之外，还包括需要等待子应用可能产生副作用的异步逻辑的结束。比如某个应用正在 boostrap 环节，那么销毁其容器就不需要等待它结束，因为 bootstrap 环节默认不会产生副作用；但是如果应用正在 mount 中，那么就必须等待其完成（Haploid.js 默认尽可能早地中断它），然后再执行 unmount。
:::
