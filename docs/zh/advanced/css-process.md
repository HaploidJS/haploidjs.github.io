# CSS 处理

Haploid.js 像大多数其它微前端框架一样，会将子应用的 CSS 加载过来，创建 &lt;style&gt; 使其生效。

在这个过程中，会根据 `urlRewrite()` 来修正其中对字体、图片等外链的引用。同时也会移除 _@charset_ 语句。

::: warning
不建议使用 @import，它导入的 CSS 不会被 Haploid.js 处理。
:::

Haploid.js 提供了两种处理方法，一种是利用浏览器对 CSS 代码的解析能力，如：

```ts
const style = document.querySelector("style");
const sheet: CSSStyleSheet = style.sheet;
const rules: CSSRuleList = sheet.rules;
```

这种办法的优点是能取得最好的解析能力，可以精确判定规则的类型，并能直接得到选择器。缺点是不能进一步解析规则内容，而且会尝试合并规则，遇到有歧义的写法会产生意外的副作用，比如：

```css
#content {
  background: var(--color);
  background-repeat: no-repeat;
}
```

会被解析成：

```css
#content {
  background-image:;
  background-position-x:;
  background-position-y:;
  background-size:;
  background-attachment:;
  background-origin:;
  background-clip:;
  background-color:;
  background-repeat: no-repeat;
}
```

显然，这是一种破坏性的转换，原因在于 _background_ 作为一种简写，直接以变量赋值，无法预测与 _background-repeat:_ 的融合结果。

我们不建议上面的写法，但是如果一定需要兼容，那么 Haploid.js 也提供了纯正则匹配字符串的处理方式，需要手动以 `dropURLFixInCSSByStyleSheet` 开启：

```ts{5}
container.registerApp({
    name: 'foo',
    entry: 'https://foo.com/entry',
    activeWhen: '/foo',
    dropURLFixInCSSByStyleSheet: true,
});
```

具体的正则表达式是 `/\burl\(\s*(['"])?(.*?)\1\s*\)/`，如果超出其匹配范围，就可能产生错误。

::: danger
[image-set](https://developer.mozilla.org/en-US/docs/Web/CSS/image/image-set) 有两种写法，加 _url()_ 的和不加的，目前 Haploid.js 还无法处理后则。

```css
#content {
  background: image-set("image1.jpg" 1x, url("image2.jpg") 2x);
}
```

:::
