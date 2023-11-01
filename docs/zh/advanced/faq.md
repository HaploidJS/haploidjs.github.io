# FAQ

[[toc]]

## Haploid.js 支持 CSS 隔离吗？

暂不支持，因为子应用需要遵循很严格的约定才能被正确处理，下面这些写法都会产生问题：

```css
height: 2rem;
:root {
}
:is(html) {
}
:where(html) {
}
```

目前浏览器不具备详细解析 CSS selector 的能力，因此只有两种选择：（1）自行实现非常简单的 selector 解析（2）引入第三方，如 [css-tree](https://github.com/csstree/csstree)。

## ESM 能实现沙箱吗？

理论上可能，但缺乏实际价值，需要自行实现对 ESM 的解析和运行。

::: warning
无论是 ESM 还是 UMD，是否开启沙箱都应该保持慎重，特别是在无法控制子应用内容的情况下（比如不同团队维护）。
:::

## 如何查看 Haploid.js 的执行日志？

Haploid.js 依赖 [debug](https://github.com/debug-js/debug) 来记录日志，因此可以：

```js
localStorage.debug = "haploid(*):*";
```
