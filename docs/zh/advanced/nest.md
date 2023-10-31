# 实例嵌套

实例嵌套，等价于容器（Container）嵌套。

显然，**容器嵌套能够实现的一个必要条件是容器（实例）能够实现销毁**。

你可以在子应用中创建新的容器，同时注意仍然需要手动适配与主应用之间的路由兼容性，以及手动触发销毁。

```ts
// 主应用
const container = new Container({
  name: "app",
  root: "#app",
});
container.registerApp({
  name: "foo",
  activeWhen: "/foo",
});

// 子应用
const subContainer = new Container({
  name: "foo",
  root: "#foo",
});
subContainer.registerApp({
  name: "foo-about",
  activeWhen: "/foo/about", // 必须在/foo之下
});

// 手动触发销毁
onBeforeUnmount(() => {
  subContainer.destroy();
});
```

主子应用都是 Router 类型的情况下，我们可以将其类比为 vue-router/react-router 的主子路由，只不过这里主子应用并没有感知对方。这是由于微前端架构的特性决定的。

在实际的业务场景中，主-子应用以及子-子应用往往是独立的工程，即独立仓库、独立构建以及独立发布，甚至有独立的域名以及独立的维护团队。我们不希望它们有太多的耦合。

因此，上面代码的一种实践是，主子工程分别独立导入 Haploid.js，这可能造成页面上有多个 Haploid.js 副本。

当然你也可以利用技术手段来达到 Haploid.js 的唯一性，但是 **Haploid.js 在设计上就尽可能地兼容了多副本的同时运行**，也就是说，主子应用可以有自己不同版本的 Haploid.js 导入。这也是 Haploid.js 在实现多实例、实例嵌套上的一种努力。

:::warning
当然，长期来看，不同版本的 Haploid.js 之间有不兼容的可能，Haploid.js 本身已经做了内部判断。我们建议主子应用尽可能保持相同或相近版本，这样它们就可以完全解耦地独立运行。
:::
