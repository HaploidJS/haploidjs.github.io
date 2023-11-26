# Register Sub-Apps

[[toc]]

You can usually register a sub-application using the `registerApp` method of a container instance, or you can register by `registerApps` in bulk.

They return an _AppAPI_ object, which provides a set of properties for fine-grained access to the state of the sub-application, controlling the behavior of the sub-application, and listening to the events of the sub-application.

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

In Haploid.js, there are several ways to declare a sub-application's entry.

## Entry Type

### HTML entry

Starting with _qiankun_, almost all micro-frontend frameworks support entry in HTML format, i.e. parsing JS and CSS from HTML pages. It's just that HTML code is ever-changing, and different attributes contained by different elements can affect the availability of JS and CSS, the execution method, and the order of execution.

Haploid.js supports the following attributes of HTML elements, making it as compatible as possible with HTML:

- &lt;style&gt;
  - type: valid if not present or equals "text/css"
  - media: retain
- &lt;link&gt;
  - disabled: not legal if present
  - type: valid if it not present or if the value is "text/css"
  - rel: valid if it not present or if the value is "stylesheet"
  - href: illegal if not present or empty
  - media: retain
  - crossorigin: retain
- &lt;script&gt;
  - src: may be a relative path that needs to be converted to an absolute path
  - text: inline codes, only meaningful when src is not present
  - async
  - defer: valid only for external
  - type: legal if not present or equals to "module" or equals to "text/javascript"
  - entry
  - crossorigin
  - nomodule

::: tip
If the entry ends with _.htm_, _.html_, _.xhtml_, _.shtml_, or if the Content-Type returned by the request for entry contains _text/html_ or _application/xhtml+xml_, the entry is considered to be in HTML format.
:::

### JSON entry

JSON supports two formats:

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

The reason for supporting JSON is that compared to HTML,JSON is more semantic and easier to parse, if the sub-application does not have complex logic, it is recommended to use this format, but this requires the pro-actively generation of JSON files.

> Currently, the customized JSON format is not supported.

::: tip
If an entry ends with _.json_, or if the Content-Type returned by the request entry contains _application/json_, the entry is considered to be in json format.
:::

### JS entry

Haploid.js also supports entry in JS format, but this is missing the CSS description.

::: tip
If the entry ends with _.js_ or _.mjs_, or if the _Content-Type_ returned by the request entry contains _text/javascript_, _application/javascript_, _application/ecmascript_, the entry is considered to be in JS format.
:::

JS is divided into ESM and UMD two formats. Since the execution of these two is different, Haploid.js needs to determine the format, in the following way:

- If the entry ends in _.js_, it is considered to be in UMD format;
- If the entry ends with _.mjs_, it is considered to be in ESM format;
- An attempt is made to create a Function as _Function(code)_. If the following exception is thrown, it is considered to be in ESM format, otherwise it is in UMD format:
  - `/Unexpected token 'export'/`
  - `/Cannot use import statement outside a module/`
  - `/Cannot use 'import.meta' outside a module/`
  - `/Unexpected keyword 'export'/`
  - `/Unexpected identifier .+ import call expects exactly one argument/`
  - `/import.meta is only valid inside modules/`
  - `/(import|export) declarations may only appear at top level of a module/`
  - `/import.meta may only appear in a module/`

::: warning
The above method is not safe, to avoid unnecessary ambiguity and side effects, if you must use JS entry, please specify as explicit a suffix as possible.
:::

### Object entry

Regardless of the entry format, the ultimate goal is to get JS and CSS out of it, execute it and get the lifecycle methods for the sub-application. If the lifecycle methods are readily available, then the process of accessing the entry is eliminated.

```ts{3}
rc.registerApp({
  name: "foo",
  lifecycle: {
    mount: () => {},
    unmount: () => {},
    bootstrap: () => {},
    update: () => {},
  },
  activeWhen: "/foo",
});
```

This form is often used in scenarios where the master and sub-application are in one project.

## Asynchronous Entry

Regardless of the format of entry used, Haploid.js supports the **Function variant**, **Promise variant** and **Mixed of the two**.

```ts
// Function
rc.registerApp({
  name: "foo",
  entry: () => "https://foo.com/entry",
  activeWhen: "/foo",
});
// Promise
rc.registerApp({
  name: "foo",
  entry: Promise.resolve("https://foo.com/entry"),
  activeWhen: "/foo",
});
// Mixed
rc.registerApp({
  name: "foo",
  entry: () => Promise.resolve("https://foo.com/entry"),
  activeWhen: "/foo",
});
```
