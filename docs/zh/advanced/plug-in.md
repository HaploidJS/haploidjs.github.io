# 插件扩展

Haploid.js 复用了 webpack 的 <a href="https://github.com/webpack/tapable" target="_blank">tapable</a> 模式提供了扩展能力。

事实上，Preload、Keep-Alive 以及请求各种格式 entry 的能力在 Haploid.js 内部都是通过插件来完成的，比如 [LoadFromEntryPlugin.ts](https://github.com/HaploidJS/haploid/blob/main/src/plugins/LoadFromEntryPlugin.ts)。

## Hooks & Events

### Container

Container 包含如下的可注册事件：

```ts
interface ContainerEvent {
  destroying: void;
  destroyed: void;

  appactivating: { appname: string | null };
  appactivated: { appname: string };
  appactivateerror: { appname: string; error: Error };
  noappactivated: { error: Error };

  appregisteredchange: void;

  appregistererror: { error: Error };
}
```

注册与反注册事件都需要在销毁之前：

```ts
container.on("appactivating", (appname) => {});
container.once("destroying", () => {});

container.off("appactivating", () => {});
```

Container 有如下 hooks：

```ts
type ContainerHooks = {
  afterrootready: AsyncSeriesBailHook<{ source: unknown }, void>;
};

container.hooks.afterrootready.tapPromise("any", ({ source }) => {});
```

### Lifecycle

_Lifecycle_ 代表了对子应用生命周期函数的描述，包含如下的可注册事件：

```ts
interface LifecycleEvent {
  beforebootstrap: void;
  afterbootstrap: void;
  bootstraperror: AppError;

  beforemount: void;
  aftermount: void;
  mounterror: AppError;

  beforeunmount: void;
  afterunmount: void;
  unmounterror: AppError;

  beforeupdate: void;
  afterupdate: void;
  updateerror: AppError;
}
```

```ts
app.lifecycle.on("beforemount", () => {});
app.lifecycle.once("beforeunmount", () => {});

app.lifecycle.off("beforemount", () => {});
```

Lifeycycle 有如下 hooks：

```ts
type LifecycleHooks<CustomProps> = {
  beforebootstrap: AsyncSeriesHook<void>;
  afterbootstrap: AsyncSeriesHook<void>;
  bootstraperror: AsyncSeriesHook<AppError>;

  beforemount: AsyncSeriesHook<void>;
  aftermount: AsyncSeriesHook<void>;
  mounterror: AsyncSeriesHook<AppError>;

  beforeunmount: AsyncSeriesHook<void>;
  afterunmount: AsyncSeriesHook<void>;
  unmounterror: AsyncSeriesHook<AppError>;

  beforeupdate: AsyncSeriesHook<{ props: CustomProps }>;
  afterupdate: AsyncSeriesHook<{ props: CustomProps }>;
  updateerror: AsyncSeriesHook<AppError & { props: CustomProps }>;

  bootstrap: AsyncSeriesBailHook<void, unknown>;
  mount: AsyncSeriesBailHook<void, unknown>;
  unmount: AsyncSeriesBailHook<void, unknown>;
  update: AsyncSeriesBailHook<{ props: CustomProps }, unknown>;
};
```

### App

_App_ 包含如下的可注册事件：

```ts
interface AppEvent {
  statechange: { prevState: AppState; nextState: AppState };

  beforeload: void;
  afterload: void;
  loaderror: AppError;

  beforestart: void;
  afterstart: void;
  starterror: AppError;

  beforestop: void;
  afterstop: void;
  stoperror: AppError;

  beforeupdate: void;
  afterupdate: void;
  updateerror: AppError;

  beforeunload: void;
  afterunload: void;
}
```

```ts
app.on("beforestop", () => {});
container.once("beforeunload", () => {});

container.off("beforestop", () => {});
```

App 有如下 hooks：

```ts
type AppHooks = {
  encounterUnmountFailure: SyncBailHook<void, { ignore: boolean } | void>;
  encounterLoadingSourceCodeFailure: SyncBailHook<
    void,
    { retry: boolean; count: number } | void
  >;
  waitForLoadingOrBootstrappingWhenStop: SyncBailHook<
    void,
    { wait: boolean } | void
  >;

  resolveAssets: AsyncSeriesBailHook<
    void,
    { html?: string; scripts: ScriptNode[]; styles: StyleNode[] } | void
  >;

  resolveEnvVariables: AsyncSeriesWaterfallHook<
    Record<string, unknown>,
    Record<string, unknown>
  >;

  beforeload: AsyncSeriesHook<void>;
  afterload: AsyncSeriesHook<void>;
  loaderror: AsyncSeriesHook<AppError>;

  beforestart: AsyncSeriesHook<void>;
  afterstart: AsyncSeriesHook<void>;
  starterror: AsyncSeriesHook<AppError>;

  beforestop: AsyncSeriesHook<void>;
  afterstop: AsyncSeriesHook<void>;
  stoperror: AsyncSeriesHook<AppError>;

  beforeupdate: AsyncSeriesHook<void>;
  afterupdate: AsyncSeriesHook<void>;
  updateerror: AsyncSeriesHook<AppError>;

  beforeunload: AsyncSeriesHook<void>;
  afterunload: AsyncSeriesHook<void>;
};
```

## Plugin

在 Container 注册 App 时，可传入函数插件：

```ts
function createMyPlugin<AdditionalOptions, CustomProps>(): AppPlugin<AdditionalOptions, CustomProps> {
    return ({ app, debug }) => {
        app.hooks...
        app.lifecycle.hooks...
    };
}

container.registerApp({
    name: 'foo'
}, [
    ['MyPlugin', createMyPlugin()]
]);
```

插件会以传入的顺序被执行。
