# 多实例

Haploid实现了多实例微前端，包括**并行与嵌套**，引用同一份**haploid.js**可以做到（同源），在大多数情况下，重复引用多份**haploid.js**也可以做到（异源）。

<div class="message is-info">
    <div class="message-body">
        在开源的微前端框架中，只要具备路由能力的，基本都不具备多实例能力。具体可参考<a href="/blog/why-haploid">为什么开发Haploid</a>。
    </div>
</div>

## 同源

Haploid中的**Container**概念就是为了能实现多实例而设计，只需要初始化不同的Container实例即生成了多个微前端实例，它们之间互不干扰。

```ts
import { RouterContainer, ManualContainer } from "haploid";

const sidebarContainer = new ManualContainer({
  name: "sidebar",
  root: "#sidebar",
});

const contentContainer = new RouterContainer({
  name: "content",
  root: "#content",
});
```

不过你仍然要注意的是：

<ol>
    <li>不同的RouterContainer实例因为都会与浏览器路由联动，所以你必须小心处理它们之间的冲突，一般不建议兄弟关系的Container都是RouterContainer，父子关系的Container也要注意它们之间的从属关系。</li>
    <li>不同Container实例的**root**挂载点不应冲突，也不应有从属关系，**name**命名也应该区分。</li>
</ol>

## 异源

Haploid在一定程度上允许同一个浏览器页面上加载和运行多个**haploid.js**副本，也就是说，子应用可以再次独立地加载**haploid.js**来成为下一级子应用的父应用。这对于应用的自治性具有重要意义，它不必再从父应用中获取Haploid的API。

<div class="my-3">
    {% image "assets/haploid-multiple.jpg", 400 %}
</div>

<div class="message is-warning">
    <div class="message-body">
        不同版本的**haploid.js**不一定能成功共存，取决于其内部的兼容性判断，若判断失败，也将抛出异常。
    </div>
</div>
