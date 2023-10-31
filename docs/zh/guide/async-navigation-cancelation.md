# 异步路由撤销

异步路由撤销（_async navigation cancelation_）是 _single-spa_ 的 v6 版本 <a href="https://github.com/single-spa/single-spa/pull/826" target="_blank">提出的</a>。不过受制于它的实现有漏洞，见 [#single-spa#953](https://github.com/single-spa/single-spa/issues/953)，很可能导致用户看到的视图被意外篡改，不符合操作期望：

![](/assets/async-navigation-cancelation.jpg)

_single-spa_ 出现这个问题的关键原因是撤销回到上一个路由时没有考虑系统的最新状态，盲目回跳。

Haploid.js 实现了这个特性，具体为 RouterContainer 实例声明一个 `cancelActivateApp` 异步函数：

```ts
import { RouterContainer, CancelationRouterNavigation } from "haploid";

new RouterContainer({
  name: "root",
  root: "#app",
  cancelActivateApp: (
    app: string | undefined,
    evt: CancelationRouterNavigation,
  ): Promise<boolean> => {
    const fromUrl = evt.oldUrl;
    return checkPermission(app, fromUrl).then((result) =>
      result.pass ? true : false,
    );
  },
});
```

> 如果 **cancelActivateApp** 抛出异常，则视为不撤销。

## 实现原理

不同于 _single-spa_，Haploid.js 选择了一种特殊的确认（confirm/cancel）队列模型来实现这个特性：

- 记录每一次路由跳转，只能位于已确认（confirmed）、确认中（confirming）和已撤销（canceled）三个状态
- 把它们按照先后次序都推入一个队列
- 【规则1】：最右侧的已确认单元，它的左侧必须被移出队列
- 【规则2】：最右侧的连续已撤销单元，它们必须被移出队列

> 不在队列中的页面，无论最终是确认还是撤销，都不会再对页面导航有所控制。

举一个例子：用户首次进入的页面为A，无条件设定为 confirmed，然后用户连续跳转到页面 B 和 C，那么当前队列的状态是（自下而上）：

```
[C confirming]
[B confirming]
[A confirmed]
```

此时，B 和 C 的 _cancelActivateApp_ 尚未返回。现在假设 C 先确认，根据【规则1】，A 和 B 必须被移除，即最终 B 无论是确认还是取消，都没有任何效果了：

```{1}
[C confirmed]
[B confirming] ❌
[A confirmed] ❌
```

如果假设 B 先确认，根据【规则1】，A 必须被移除：

```{2}
[C confirming]
[B confirmed]
[A confirmed] ❌
```

现在需要看 C 的结果，如果 C 确认，那么 B 被移除，页面保持不变；如果 C 撤销，那么根据【规则2】，C 从队列中移除，当前页面应该返回到 B。

现在我们返回到初始状态，来看 C 和 B 先被撤销的结果。

如果 C 先撤销，那么根据【规则2】，C 从队列中移除，当前页面应该返回到 B。

```{1}
[C canceled] ❌
[B confirming]
[A confirmed]
```

看 B 的结果，如果 B 确认，那么 A 被移除，页面保持不变，如果 B 也被撤销，那么 B 被移除，当前页面返回 A。

那么如果 B 先撤销，不匹配任何规则，页面和队列都保持不变，看 C。C 被确认，那么 A 和 B 都移除，页面不变；如果 C 也被撤销，那么根据【规则2】，移除 B 和 C，页面应返回 A：

```{1,2}
[C canceled] ❌
[B canceled] ❌
[A confirmed]
```

这个队列的变化脉络大概是这样：

```
队列状态         操作                   队列状态            操作                队列状态

[C confirming]
[B confirming]
[A confirmed ]  =>confirm C(rule1)=>  [C confirmed]

                =>confirm B(rule1)=>  [C confirming]
                                      [B confirmed ]  =>confirm C(rule1)=>  [C confirming]
                                                      =>cancel C(rule2) =>  [B confirmed]

                =>cancel C(rule2) =>  [B confirming]
                                      [A confirmed]   =>confirm B(rule1)=>  [B confirmed]
                                                      =>cancel B(rule2) =>  [A confirmed]
                =>cancel B(no rule)=> [C confirming]
                                      [B canceled]
                                      [B confirmed]   =>confirm C(rule1)=>  [C confirmed]
                                                      =>cancel C(rule2) =>  [A confirmed]
```

::: tip
由于 Haploid.js 支持同一页面上有多个实例，即多个 `RouterContainer`，它们都会参与到路由是否撤销的决议当中。具体策略是 **一票否决制**，即任意一个实例决定撤销该路由跳转，那么路由就会被撤销。
:::

::: danger
在多实例环境下，它们在 `cancelActivateApp` 的执行上是并行的，具体路由撤销实效性取决于消耗时间最长的那一个。
:::

异步路由撤销在一些要求不高的鉴权场景中可以用到，类似于 _vue-router_ 中的路由守护。
