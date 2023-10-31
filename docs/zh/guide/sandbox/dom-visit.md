# DOM访问

无论是否开始沙箱，Haploid.js 都会将子应用渲染到如下模拟 DOM 结构中：

```html
<haploid-html class="haploid-html">
  <haploid-head class="haploid-head">
    <haploid-title></haploid-title>
  </haploid-head>
  <haploid-body class="haploid-body"></haploid-body>
</haploid-html>
```

但一些 BOM API 的行为会有所不同。

比如 `document.documentElement` 会指向上面的 &lg;haploid-html&gt; 元素。如果开启 `sandbox.enableHtmlPretending` 选项，`document.documentElement` 就会尽可能表现得像原生 &lt;html&gt; 一样，包括：

```js
document.documentElement.constructor === HTMLHtmlElement;
document.documentElement.tagName === "HTML";
document.documentElement.nodeName === "HTML";
document.documentElement.version === "";
document.documentElement.parentNode === document;
document.documentElement.parentElement === null;
document.documentElement instanceof HTMLHtmlElement === true;
```

> 上面的 _document_ 是代理对象。

::: danger
这种伪装在有的场景下可能是致命的，比如由于其 _parentElement_ 是 null，可能导致一些需要上溯到真正 document 的逻辑被破坏。
:::

`sandbox.enableBodyPretending`、 `sandbox.enableHeadPretending` 和 `sandbox.enableTitlePretending` 具有类似的效果。

更多细节可参考<a href="/zh/essentials/sandbox/env-proxy.html#document">环境代理</a>。

---

你同样也可以使用 `presetHeadHTML` 和 `presetBodyHTML` 来预设一些 DOM 元素。比如：

```ts
container.registerApp({
  presetHeadHTML: `<meta name="keywords" content="">`,
  presetBodyHTML: `<article><main></main></article>`,
});
```

将会产出这样的 DOM 结构：

```html
<haploid-html class="haploid-html">
  <haploid-head class="haploid-head">
    <haploid-title></haploid-title>
    <meta name="keywords" content="" />
  </haploid-head>
  <haploid-body class="haploid-body">
    <article>
      <main></main>
    </article>
  </haploid-body>
</haploid-html>
```

如果开启了 `preserveHTML` 选项，而且 entry 是 HTML 格式，那么其中的 DOM 会经过安全过滤后拷贝过来。
