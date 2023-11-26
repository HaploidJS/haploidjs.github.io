# CDN Scheduling

`CDN Scheduling` refers to the ability of a system to **dynamically** switch its domain names hosting static resources on a CDN to respond to sudden failures and to achieve load balancing.

The simplest way to implement CDN scheduling is for an HTTP server (such as nginx) to modify the domain name in HTML that refers to a static resource, in effect a text substitution.

However, in order to cope with incremental downloads of static resources, JS must be aware of the new domain name, then a variable can be inline in HTML:

```html
<script>
  var __cdn_prefix = "//original-cdn-domain-to-replace.com";
</script>
```

For webpack, [publicPath on the fly](https://webpack.js.org/guides/public-path/#on-the-fly) can be used to replace the UMD modules to be dynamically downloaded. For ESM built by vite, since all modules are relative paths, you only need to modify the address of the entry module.

Haploid.js provides supporting for CDN scheduling under the micro-frontend, just need to declare the `urlRewrite()` option for the sub-application:

```ts{6}
container.registerApp({
    name: 'foo',
    entry: 'https://foo.com/entry',
    activeWhen: '/foo',
    urlRewrite: (url) => url.replace('//original-cdn-domain-to-replace.com', '//replacement.com')
});
```

The sub-application must also be aware of the \_\_cdn_prefix. If the sandbox is not enabled, you can directly read the CDN prefix:

```js
// set-public-path.js
__webpack_public_path__ = window.__cdn_prefix + "/static/";
```

If the sandbox is enabled, you can let the \_\_cdn_prefix escaped, or use it to declare an environment variable:

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
// or
__webpack_public_path__ = __CDN_DOMAIN__ + "/static/";
```

::: tip
The above applies mainly to UMD. For ESM, refer to vite's [Advanced Base Options](https://vitejs.dev/guide/build.html#advanced-base-options).
:::

::: warning
There are still some scenarios where static resource loading is not covered by Haploid.js, for example:

1. Dynamic CSS loading under sandbox is not enabled;
2. Resource path in the data delivered by the back-end
   :::
