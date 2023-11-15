# FAQ

[[toc]]

## Is CSS isolation supported?

It is not supported yet, because sub-applications need to follow very strict conventions to be properly handled, and the following notations can cause problems:

```css
height: 2rem;
:root {
}
:is(html) {
}
:where(html) {
}
```

Browsers do not currently have the ability to parse css selectors in detail, so there are only two options: (1) implement very simple selector parsing themselves, and (2) introduce a third party, such as [css-tree](https://github.com/csstree/csstree).

## Can ESM support sandbox?

It is possible in theory, but lacks practical value, and needs to realize the analysis and operation of ESM by itself.

::: warning
For both ESM and UMD, you should be cautious about opening a sandbox, especially if you have no control over the content of your sub-applications (such as maintenance by different teams).
:::

## How to view the execution logs?

Haploid.js relies on [debug](https://github.com/debug-js/debug) to log, so you can:

```js
localStorage.debug = "haploid(*):*";
```
