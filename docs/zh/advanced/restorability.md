# 可恢复性

Haploid.js 做了大量了的努力来增强页面上微前端服务的稳定性和容错性，期望尽可能少地让用户以刷新页面的方式来重试。

## 限制应用加载并发数

触发加载（load）子应用至少有两个因素：

- 通过用户交互触发，比如 URL 导航到指定应用之下；
- [预加载](/zh/guide/essentials/preload.html)

现如今浏览器已经都支持ESM，越来越多的应用都会以更细的粒度进行 CSS 和 JS 打包，导致子应用在 `load` 阶段需要并发大量请求。

如果有过多的应用同时 load，那么可能出现性能问题，甚至增加出错概率。

Haploid.js 提供了一个叫 `maxLoadConcurrency` 的容器构造参数，用以控制子应用 load 的最大并发数。

事实上，该参数不仅仅会影响此容器下的子应用，而是整个浏览器页面，如果你的页面有多个容器实例，那么都将共享第一个容器的 `maxLoadConcurrency`。因此语义化更强的配置方式是：

```html{3}
<head>
    <script>
        var __HAPLOID_MAX_LOAD_CONCURRENCY__ = 4;
    </script>
</head>
```

默认并发数为 4，即如果有 5 个应用同时 load，那么最后一个将等待，以减轻对网络的压力。

你可以根据情况适当调整该值。

## 请求 entry 重试

如果 entry 请求失败，可以重试，这需要为 `entry` 选项提供对象化的参数：

```ts{5}
container.registerApp({
  name: "foo",
  entry: {
    url: "https://foo.com/entry",
    reties: 3,
  },
  activeWhen: "/foo",
});
```

## 请求资源重试

如果资源（CSS 或者 UMD 的 JS）请求失败，也可以选择重试。

Haploid.js 提供了两个参数，分别为：`maxLoadRetryTimes`（默认为 2） 和 `loadRetryTimeout`（默认为 6000）。

```ts{5-6}
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  maxLoadRetryTimes: 2,
  loadRetryTimeout: 6000,
});
```

它们的意义是，**如果失败之间的间隔小于 _loadRetryTimeout_ 毫秒，连续发生 _maxLoadRetryTimes_ 次，那么就判断这次请求以失败告终**。

这样设计的目的是，**不以单次失败结果定终身**。始终保有未来重试的回旋余地。在这种情况下，用户只需要切换到其它应用，再切回来，即可重试，而不必刷新页面。

## 死循环侦测

详见[路由死循环侦测](/zh/essentials/router-dead-loop-detect.html)。

## UMD 缓存

总所周知，UMD 会向全局写入变量，主应用正是从这个变量中获取的子应用生命周期函数，如 bootstrap、mount、unmount、update。

我们使用 [systemjs](https://github.com/systemjs/systemjs/blob/main/src/extras/global.js) 的逻辑来侦测这个 key，未来也可能提供给用户来手动指定。

如果二次注册同一个子应用（这在实例销毁之下是大概率事件），那么它就会引用相同的 UMD 资源，Haploid.js 选择不再重复执行 JS 代码，而是使用将之前缓存是下来的 key。

为此，Haploid.js 建立了一个页面级别的 Map，如下：

```
{
    'https://foostatic.com/static/main.js': 'foo-entry-key'
}
```

同一个页面上的说有实例，甚至不同的 Haploid.js 副本，都会尽可能地利用此 Map，从而节省开销，并避免多次运行同一份 UMD 代码可能带来的副作用。
