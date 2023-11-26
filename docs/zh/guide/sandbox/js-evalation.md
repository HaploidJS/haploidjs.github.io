# JS 执行

## 变量读写

开启沙箱后，对 window 属性的读写都会局限在沙箱之内，不会外溢，包括以下操作：

```ts
window.foo = 1;
window["foo"] = 1;
Reflect.defineProperty(window, "foo", {
  value: 1,
});
delete window.foo;
Reflect.deleteProperty(window, "foo");
```

注意读写操作能否成功也受到原始变量属性的影响，比如 window 上原本有一个不可写（_non-writable_）的属性 foo，那么在沙箱中赋值也是失败的：

```ts
window.foo = "new value"; // ❌
```

除了 window 之外，**Haploid.js 还会保护对 document 属性的读写**，虽然一般很少有人会这么做。

::: warning
对 window、document 之外的其它全局变量的读写，则不受沙箱保护，例如 **navigator.c=1**。
:::

## 变量逃逸

你可能有这样的需求，某些变量就是要越过沙箱的限制，去读写真正 window 和 document 上的版本。在 Haploid.js 中，可以通过 `escapeVariables` 选项来实现。

```ts
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  sandbox: {
    escapeVariables: ["__GLOBAL_BASE"],
  },
});
```

不过需要特别注意的一个风险是，一旦全局变量被重新定义，很有可能导致之前能读取的变量变得不可读取。

```ts
window.foo; // ok
// other program defines foo to unreadable
window.foo; // throw error
```

## 全局变量

通常对于读写 _window.foo_ 来说，我们可以省略上下文前缀，直接以 _foo_ 来代替。日常我们就是这样来使用 document、history、navigaor 的。

在沙盒环境中，除了 self、top、parent、globalThis、document、location、addEventListener、removeEventListener、dispatchEvent、eval、isFinite、isNaN、parseFloat、parseInt、hasOwnProperty、decodeURI、decodeURIComponent、encodeURI、encodeURIComponent 等和在 **envVariables** 选项中声明的变量外，其它都不应如此使用，**因为会逃逸到全局中去，而且对于未声明过的变量，在严格模式（开启了`useStrict`选项）下还会抛出异常。**

建议访问自定义变量均使用 window/globalThis 上下文。

## 环境变量

Haploid.js 提供了 `envVariables` 选项来声明一些虚拟变量。该选项无论开启沙箱都有效，但也有明显的区别。

```ts{5-7}
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  envVariables: {
    __BASE__: "https://foo.com/",
  },
});
```

在沙箱环境中，这些变量可始终被读取。在非沙箱环境，只有在入口处的同步代码中可访问。

如果与 window 上的变量冲突，那么以 **envVariables** 中的取值为准。

## 上下文传递

在沙箱中，JS 都是在独立的 function 上下文下执行的，因此如下列代码中，全局变量 _a_ 是无法被后面访问到的：

```html
<script>
  var a = 2022;
</script>
<script>
  console.log(a);
</script>
```

如果要共享变量，可以在 window 上写入。
