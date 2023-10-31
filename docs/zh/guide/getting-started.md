# 快速上手

::: tip
我们这里假设你已经掌握了 _git_、_npm_、_typescript_ 以及浏览 API 如 _document_、_history_、_localStorage_ 等基本知识。
:::

## 安装

你可以使用 npm/yarn/pnpm 来安装 Haploid.js：

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

也可以直接引用 CDN 链接：

```html
<script src="//unpkg.com/haploid@latest/dist/haploid.umd.min.js"></script>
```

或者使用 ESM 格式：

```html
<script type="module">
  import { RouterContainer } from "https://unpkg.com/haploid@latest/dist/haploid.esm.min.js";
</script>
```

## 创建主应用

Haploid.js 与其它方案的一大不同是它支持`多实例`，因此在注册子应用之前你应该先创建一个实例，我们用 _容器（Container）_ 来代表一个实例，同时一个实例也锁定了唯一一个 DOM 挂载点：

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

Haploid.js 支持两种*容器*：**手动（manual）**和**路由（router）**。它们的区别是前者需要手动控制来激活哪一个子应用，而后者则与浏览器的地址栏联动，因此仅仅是触发机制上的不同，你完全可以自行实现一个具有额外触发机制的新容器类型。

对于任意一种容器，你都可以像 _single-spa_ 那样注册一个或多个子应用：

```ts{12}
// 手动
mc.registerApps<{ username: string }>([{
    name: 'foo',
    entry: 'https://foo.com/entry',
    customProps: { username: 'jake' },
}]);

// 路由
rc.registerApps<{ username: string }>([{
    name: 'foo',
    entry: 'https://foo.com/entry',
    activeWhen: '/foo',
    customProps: { username: 'jake' },
}]);
```

> 子应用有多种声明方式，不局限于一个 URL，参见：[注册子应用](/zh/essentials/register-app.html)。

路由容器需要一个额外的 **activeWhen** 选项，这和 _single-spa_ 是完全兼容的。

接下来，对于路由容器，你需要启动它：

```ts
rc.run();
```

对于手动容器，你可以使用 _activateApp_ 函数来激活任意一个子应用：

```ts
mc.activateApp("foo");
```

你可以在容器实例上监听许多事件：

```ts
rc.on("appactivating", ({ appname }) => {});
rc.on("appactivated", ({ appname }) => {});
rc.on("appactivateerror", ({ appname, error }) => {});
rc.on("noappactivated", ({ error }) => {});
```

## 声明子应用

Haploid.js 完全兼容了 _single-spa_ 对子应用的定义，因此 _single-spa-vue_、_single-spa-react_ 可以继续用来封装子应用，不再冗述。

在现代的前端开发和运行环境下，我们更建议以 ESM 的格式来打包子应用，例如在 vite 下：

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

默认地，vite 不会保留对入口文件中的导出，你需要配置 _rollup_：

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

ESM 格式的子应用在加载容错性、模块复用性上相比 UMD 更优。
