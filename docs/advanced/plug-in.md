# Plugins

Haploid.js reuses webpack's <a href="https://github.com/webpack/tapable" target="_blank">tapable</a> mode to provide scalability.

In fact, the _preload_, _keep-alive_ and the ability to request a variety of formats entry in Haploid.js internal are accomplished through plugins, such as [LoadFromEntryPlugin.ts](https://github.com/HaploidJS/haploid/blob/main/src/plugins/LoadFromEntryPlugin.ts).

## Hooks & Events

### Container

The Container contains the following registrable events:

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

Both registration and unregistration events need to be prior to destruction:

```ts
container.on("appactivating", (appname) => {});
container.once("destroying", () => {});

container.off("appactivating", () => {});
```

Container has the following hooks：

```ts
type ContainerHooks = {
  afterrootready: AsyncSeriesBailHook<{ source: unknown }, void>;
};

container.hooks.afterrootready.tapPromise("any", ({ source }) => {});
```

### Lifecycle

_Lifecycle_ represents a description of the sub-application lifecycle functions and contains the following registrable events:

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

Lifeycycle has the following hooks：

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

_App_ contains the following registrable events:

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

App has the following hooks：

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

When registering an App in the Container, function plugins can be passed in:

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

Plugins are executed in the order they were passed in.
