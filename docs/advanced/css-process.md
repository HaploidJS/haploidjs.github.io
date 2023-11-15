# CSS Process

Haploid.js, like most other micro-frontend frameworks, loads the sub-application's CSS and creates a &lt;style&gt; to make it work.

In this process, it will revise references to font images and other external links according to `urlRewrite()` and also remove _@charset_ statements.

::: warning
It is not recommended to use @import because the CSS it imports will not be processed by Haploid.js.
:::

Haploid.js provides two processing methods, one is to use the browser's ability to parse CSS code, such as:

```ts
const style = document.querySelector("style");
const sheet: CSSStyleSheet = style.sheet;
const rules: CSSRuleList = sheet.rules;
```

The advantage of this approach is that it can obtain the best parsing power, can accurately determine the type of rule, and can directly get the selector. The disadvantage is that it can not further parse the content of the rule, and it will try to merge the rules, and encounter ambiguous writing will have unexpected side effects, such as:

```css
#content {
  background: var(--color);
  background-repeat: no-repeat;
}
```

Will be interpreted as:

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

Obviously, this is a destructive conversion because _background_, as a shorthand, is directly assigned to a variable and cannot predict the result of merging with _background-repeat_.

We do not recommend the above writing, but if must need to be compatible, then the Haploid.js also provides pure matching string handling, you need to enable `dropURLFixInCSSByStyleShee` manually:

```ts{5}
container.registerApp({
    name: 'foo',
    entry: 'https://foo.com/entry',
    activeWhen: '/foo',
    dropURLFixInCSSByStyleSheet: true,
});
```

The specific regular expression is `/\burl\(\s*(['"])?(.*?)\1\s*\)/`, and if it is outside its matching range, an error may occur.

::: danger
[image-set](https://developer.mozilla.org/en-US/docs/Web/CSS/image/image-set) can be written in two ways, with _url()_ and without it, now Haploid.js can't handle the second one yet.

```css
#content {
  background: image-set("image1.jpg" 1x, url("image2.jpg") 2x);
}
```

:::
