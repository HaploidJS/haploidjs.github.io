# DOM Visit

Whether you enabled sandbox or not, Haploid.js renders the sub-application into the following simulated DOM structure:

```html
<haploid-html class="haploid-html">
  <haploid-head class="haploid-head">
    <haploid-title></haploid-title>
  </haploid-head>
  <haploid-body class="haploid-body"></haploid-body>
</haploid-html>
```

But some _BOM_ APIs behave differently.

The `document.documentElement` refers to the &lg;haploid-html&gt; element above. If enabled the `sandbox.enableHtmlPretending` option, the `document.documentElement` will behave as native &lt;html&gt; as possible, including:

```js
document.documentElement.constructor === HTMLHtmlElement;
document.documentElement.tagName === "HTML";
document.documentElement.nodeName === "HTML";
document.documentElement.version === "";
document.documentElement.parentNode === document;
document.documentElement.parentElement === null;
document.documentElement instanceof HTMLHtmlElement === true;
```

> The _document_ above is the proxy object.

::: danger
These pretendings can be fatal in some cases, such as when the _parentElement_ is null, which can cause some logic to be traced to the real document to be broken
:::

`sandbox.enableBodyPretending`、 `sandbox.enableHeadPretending` and `sandbox.enableTitlePretending` have a similar effect.

See <a href="/essentials/sandbox/env-proxy.html#document">Environmental Proxy</a> for more details.

---

You can also use `presetHeadHTML` and `presetBodyHTML` to preset DOM elements such as:

```ts
container.registerApp({
  presetHeadHTML: `<meta name="keywords" content="">`,
  presetBodyHTML: `<article><main></main></article>`,
});
```

The following DOM structure will be generated:

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

If the `preserveHTML` option is enabled, and entry is in HTML format, then the DOM in it will be securely filtered and copied.
