# Getting Started

::: tip
We assume that you already have a basic knowledge of _git_, _npm_, _typescript_ and browser APIs such as _document_, _history_ and _localStorage_.
:::

## Installation

You can use npm, yarn and pnpm to install Haploid.js:

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

You can also use a CDN link directly:

```html
<script src="//unpkg.com/haploid@latest/dist/haploid.umd.min.js"></script>
```

or ESM format:

```html
<script type="module">
  import { RouterContainer } from "https://unpkg.com/haploid@latest/dist/haploid.esm.min.js";
</script>
```

## Creating Main Application

A big difference between Haploid.js and other frameworks is that it supports `multi-instances`, so you should first create an instance before registering a sub-application. We use a Container to represent an instance, and an instance also locks a unique DOM mount point:

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

Haploid.js supports two types of containers: **manual** and **router**. The difference between them is that the former requires manual control of which sub-applications are activated, while the latter is linked to the browser's URL, so it is only a different trigger mechanism that you can implement a new container type with additional triggers.

For either type of container, you can register one or more sub-applications like _single-spa_:

```ts{12}
// manual
mc.registerApps<{ username: string }>([{
    name: 'foo',
    entry: 'https://foo.com/entry',
    customProps: { username: 'jake' },
}]);

// router
rc.registerApps<{ username: string }>([{
    name: 'foo',
    entry: 'https://foo.com/entry',
    activeWhen: '/foo',
    customProps: { username: 'jake' },
}]);
```

> Sub-applications can be declared in a variety of ways, not limited to a URL, see: [Register SubApps](/guide/register-app.html)

Router containers require an additional `activeWhen` option, which is fully compatible with _single-spa_.

Next, for a router container, you need to start it:

```ts
rc.run();
```

For a manual container, you can use the `activateApp` function to activate any sub-application:

```ts
mc.activateApp("foo");
```

You can listen for many events on a container instance:

```ts
rc.on("appactivating", ({ appname }) => {});
rc.on("appactivated", ({ appname }) => {});
rc.on("appactivateerror", ({ appname, error }) => {});
rc.on("noappactivated", ({ error }) => {});
```

## Declare Sub-Apps

Haploid.js is fully compatible with _single-spa_'s definition of sub-applications, so _single-spa-vue_/_single-spa-react_ can still be used to encapsulate sub-applications without redundancy.

In the modern frontend development and operation environment, we recommend to bundle applications in ESM format, such as under vite:

```js
// main.js
import Vue from "vue";
import singleSpaVue from "single-spa-vue";

import App from "./App.vue";
import router from "./router";

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render(h) {
      return h(App);
    },
    router,
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
```

By default, vite does not retain the export to the entry file, you need to configure _rollup_:

```js
// vite.config.js
{
  build: {
    rollupOptions: {
      preserveEntrySignatures: "exports-only";
    }
  }
}
```

ESM sub-applications are better than UMD in terms of load tolerance and module reuse.
