# Getting Started

::: tip
We assume that you have enough knowledge of _git_, _npm_, _typescript_ and broswer API like _document_, _history_, _localStorage_ and more.
:::

## Install

You can install haploid.js by npm/yarn/pnpm:

<CodeGroup>
  <CodeGroupItem title="NPM" active>

```bash
npm i haploid --save
```

  </CodeGroupItem>

  <CodeGroupItem title="YARN">

```bash
yarn add haploid
```

  </CodeGroupItem>

  <CodeGroupItem title="PNPM">

```bash
pnpm add haploid
```

  </CodeGroupItem>
</CodeGroup>

You can also link a &lt;script&gt; to _unpkg.com_:

```html
<script src="//unpkg.com/haploid@latest/dist/haploid.umd.min.js"></script>
```

or use ESM format:

```html
<script type="module">
  import { RouterContainer } from "https://unpkg.com/haploid@latest/dist/haploid.esm.min.js";
</script>
```

## Usage

First, you should create a _Container_, which refers to an instance:

```ts
import { ManualContainer, RouterContainer } from "haploid";

const mc = new ManualContainer({
  name: "sidebar",
  root: ".sidebar",
});

const rc = new RouterContainer({
  name: "sidebar",
  root: ".content",
});
```

Haploid.js supports two kinds of _Container_: **manual** and **router**.

For any kind, you can register one or more applications, like _single-spa_ does:

```ts{12}
// Manual
mc.registerApps<{ username: string }>([{
    name: 'foo',
    entry: 'https://foo.com/entry',
    customProps: { username: 'jake' },
}]);

// Router
rc.registerApps<{ username: string }>([{
    name: 'foo',
    entry: 'https://foo.com/entry',
    activeWhen: '/foo',
    customProps: { username: 'jake' },
}]);
```

The router container needs one more **activeWhen** option, to match the location of current page.

Next, you should run the router container:

```ts
rc.run();
```

For manual container, you can activate any application by calling _activateApp_ function:

```ts
mc.activateApp("foo");
```

There are many events you can listen to:

```ts
rc.on("appactivating", ({ appname }) => {});
rc.on("appactivated", ({ appname }) => {});
rc.on("appactivateerror", ({ appname, error }) => {});
rc.on("noappactivated", ({ error }) => {});
```
