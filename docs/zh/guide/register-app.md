# 注册子应用

通常可以用容器实例的 `registerApp` 方法来注册一个子应用，也可以用 `registerApps` 来批量注册。

它们返回的是 _AppAPI_ 对象，该对象提供了一系列的属性用于细粒度访问该子应用的状态、控制子应用的行为以及监听子应用的事件。

```ts
interface AppAPI<AdditionalOptions, CustomProps> {
  get hooks(): AppHooks;
  get state(): AppState;
  get appElement(): HTMLElement | null;
  get name(): string;
  get latestDirective(): AppDirective;
  get timeouts(): AppTimeouts;
  readonly load: () => Promise<LifecycleFns<CustomProps>>;
  readonly on: <T extends keyof AppEvent>(
    event: T,
    listener: (event: AppEvent[T]) => unknown,
    context?: unknown,
  ) => this;
  readonly once: <T extends keyof AppEvent>(
    event: T,
    listener: (event: AppEvent[T]) => unknown,
    context?: unknown,
  ) => this;
  readonly off: <T extends keyof AppEvent>(
    event: T,
    listener: (event: AppEvent[T]) => unknown,
    context?: unknown,
  ) => this;
  lifecycle: LifecycleAPI<CustomProps>;
  options: AppOptions<CustomProps> & AdditionalOptions;
  isUnloaded: boolean;
  update(customProps: CustomProps): Promise<void>;
}
```

在 Haploid.js 中，支持以多种方式来声明一个子应用的入口（entry）。

## 入口类型

### HTML entry

从 _qiankun_ 开始，几乎所有微前端框架都支持 HTML 格式的 entry，即从 HTML 页面中解析 JS 和 CSS。只是 HTML 代码千变万化，不同元素包含的不同属性都可能影响 JS/CSS 的可用性、执行方法和执行顺序。

Haploid.js 对 HTML 元素的下列属性都有支持，尽可能地兼容了HTML：

- &lt;style&gt;
  - type 属性，不存在或者取值是 “text/css” 都是合法的，其它不合法
  - media 属性，需要保留
- &lt;link&gt;
  - disabled 属性，存在则不合法；
  - type 属性，不存在或者取值是 “text/css” 都是合法的，其它不合法；
  - rel 属性，不存在或者取值是 “stylesheet” 都是合法的，其它不合法；
  - href 属性，不存在或为空则不合法；
  - media 属性，需要保留；
  - crossorigin 属性，需要保留
- &lt;script&gt;
  - src 属性，可能是相对路径，需要转换成绝对路径；
  - text 属性，内联代码，只有当 src 属性不存在时才有意义；
  - async 属性；
  - defer 属性，只对外链有效；
  - type 属性，不存在或者等于 module 或者等于 “text/javascript” 是合法的，其它不合法；
  - entry 属性；
  - crossorigin 属性；
  - nomodule 属性

::: tip
如果 entry 以 _.htm/.html/.xhtml/.shtml_ 结尾，或者请求 entry 返回的 Content-Type 包含 _text/html_ 或 _application/xhtml+xml_，则该 entry 被认定为 HTML 格式。
:::

### JSON entry

JSON 支持两个版本的格式：

```ts
interface JSONEntryV1 {
  version: 1;
  module?: "esm" | "umd";
  initial?: {
    css?: string[];
    js?: string[];
  };
  async?: {
    css?: string[];
    js?: string[];
  };
}

interface JSONEntryV2 {
  version: 2;
  module?: "esm" | "umd";
  css?: string[];
  js?: string[];
}
```

支持 JSON 的原因是因为相比于 HTML，JSON 的语义化更强，更易解析，如果子应用没有复杂的逻辑，更建议用这种格式。不过这需要主动生成 JSON 文件。

> 目前暂时不支持定制 JSON 格式。

::: tip
如果 entry 以 _.json_ 结尾，或者请求 entry 返回的 Content-Type 包含 _application/json_，则该 entry 被认定为 JSON 格式。
:::

### JS entry

Haploid.js 还支持 JS 格式的 entry，不过这样就缺少了对 CSS 的描述。

JS 分为 ESM 和 UMD 两种格式。由于这两种 JS 的执行方式不同，因此需要判断格式信息。

- 如何 entry 以 _.js_ 结尾，则认为其为 UMD 格式；
- 如何 entry 以 _.mjs_ 结尾，则认为其为 ESM 格式；
- 以 _Function(code)_ 的方式执行，如果抛出以下异常，则认为为 ESM 格式，否则为 UMD 格式
  - /Unexpected token 'export'/
  - /Cannot use import statement outside a module/
  - /Cannot use 'import.meta' outside a module/
  - /Unexpected keyword 'export'/
  - /Unexpected identifier .+ import call expects exactly one argument/
  - /import.meta is only valid inside modules/
  - /(import|export) declarations may only appear at top level of a module/
  - /import.meta may only appear in a module/

::: warning
为避免产生不必要的歧义和副作用，如果一定要使用JS格式，请尽可能指定明确的后缀名。
:::

::: tip
如果 entry 以 _.js_ 或者 _.mjs_ 结尾，或者请求 entry 返回的 Content-Type 包含 _text/javascript_、_application/javascript_ 或者 _application/ecmascript_，则该 entry 被认定为 JS 格式。
:::

### Object entry

无论何种 entry 格式，最终的目标都是从中获取 JS 和 CSS，执行后得到子应用的生命周期方法。如果生命周期方法是现成的，那么就省去了访问 entry 的过程。

```ts
rc.registerApp({
  name: "foo",
  entry: {
    mount: () => {},
    unmount: () => {},
    bootstrap: () => {},
    update: () => {},
  },
  activeWhen: "/foo",
});
```

这种形式通常用于主子应用在一个构建应用中的场景。

## 异步入口

无论使用何种格式的 entry，Haploid.js 都支持其 **函数变种**、**Promise变种** 和 **两者混合变种**。

```ts
// 函数变种
rc.registerApp({
  name: "foo",
  entry: () => "https://foo.com/entry",
  activeWhen: "/foo",
});
// Promise变种
rc.registerApp({
  name: "foo",
  entry: Promise.resolve("https://foo.com/entry"),
  activeWhen: "/foo",
});
// 函数-Promise混合变种
rc.registerApp({
  name: "foo",
  entry: () => Promise.resolve("https://foo.com/entry"),
  activeWhen: "/foo",
});
```
