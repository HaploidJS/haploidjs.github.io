# CDN 调度

`CDN 调度`是指系统 **动态** 切换其托管在 CDN 上静态资源的域名的能力，以应对突发故障和实现负载均衡。

实现 CDN 调度的最简单手段是 HTTP 服务器（如）修改 HTML 中引用静态资源的域名，事实上就是一次文本替换。

然而，为了应对增量下载的静态资源，JS 必须感知新的域名，那么可以在 HTML 内联一个变量：

```html
<script>
  var __cdn_prefix = "//original-cdn-domain-to-replace.com";
</script>
```

对于 webpack 来说，可以利用其 [publicPath on the fly](https://webpack.js.org/guides/public-path/#on-the-fly) 来置换要动态下载的 UMD 模块。而对于 vite 构建出的 ESM 来说，由于所有模块都是相对路径的，因此只需要切换入口模块的地址即可。

Haploid.js 为微前端下的 CDN 调度提供了支持，只需要为子应用声明 `urlRewrite()` 选项：

```ts{6}
container.registerApp({
    name: 'foo',
    entry: 'https://foo.com/entry',
    activeWhen: '/foo',
    urlRewrite: (url) => url.replace('//original-cdn-domain-to-replace.com', '//replacement.com')
});
```

子应用也需要感知到 \_\_cdn_prefix，如果没有开启沙箱，可以直接读取：

```js
// set-public-path.js
__webpack_public_path__ = window.__cdn_prefix + "/static/";
```

如果开启了沙箱，可以让 \_\_cdn_prefix 逃逸，或使用其声明一个环境变量：

```ts{6,8}
container.registerApp({
    name: 'foo',
    entry: 'https://foo.com/entry',
    activeWhen: '/foo',
    urlRewrite: (url) => url.replace('//original-cdn-domain-to-replace.com', '//replacement.com'),
    escapeVariables: ['__cdn_prefix']
    envVariables: {
        __CDN_DOMAIN__: window.__cdn_prefix,
    },
});
```

```js
// set-public-path.js

__webpack_public_path__ = window.__cdn_prefix + "/static/";
// 或者
__webpack_public_path__ = __CDN_DOMAIN__ + "/static/";
```

::: tip
以上主要应对 UMD，如果是 ESM，可以参考 vite 的 [进阶基础路径选项](https://vitejs.dev/guide/build.html#advanced-base-options)。
:::

::: warning
仍然存在一些场景的静态资源加载是 Haploid.js 覆盖不到的，比如：

1. 未开启沙箱下的动态 CSS 载入；
2. 后端下发的数据中的资源路径
   :::
