# 路由死循环侦测

路由死循环通常是由于设置了不正确的路由跳转导致的。页面请求的死循环跳转通常会被浏览器拦截，而 history 的死循环会导致 JS 的堆栈溢出错误。

Haploid.js 会在一定程度上尝试侦测到死循环，具体做法是计算在过去 1 秒内的 `history.pushState/replaceState` 操作，如果发生跳转超过50次，或者跳转到同一个 path 次数超过 20 次，则被认定为有路由异常。

侦测结果可以通过事件来捕获：

```ts
import { getUniversalRouter } from "haploid";

getUniversalRouter().on("deadloopdetect", () => {
  console.log("路由异常");
});
```

你也可以关闭路由死循环侦测：

```ts
window__HAPLOID_DISABLE_DEADLOOP_DETECT__ = false;
```

::: warning
从 **getUniversalRouter** 也能看出，路由模块是全局唯一的，这也是 Haploid.js 能实现多实例的关键前提之一。因此一旦该选项被设置，那么所有实例的路由死循环侦测功能均被关闭。
:::
