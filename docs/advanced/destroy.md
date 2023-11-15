# Instance Destruction

Instance destruction is equivalent to Container destruction.

The request for instance destruction comes from the coexistence scenario between the micro-frontend and the existing routing (vue-router/react-router) module. For example, the micro-frontend is instantiated in a &lt;router-view&gt; page of an existing vue-router project. The micro-frontend in this page will necessarily need to be cleaned, otherwise some side effects may occur:

- Some resource exclusive operations may conflict and duplicate during secondary initialization, such as event binding;
- Asynchronous logic that has not been terminated may still affect the page, such as global popups

As soon as a container needs to be destroyed, the registered application will stop the activity as much as possible, cleaning up resources and variables suggests that `destroy()` should be performed during the appropriate lifetime of the component:

```ts
import { onBeforeUnmount } from "vue";

onBeforeUnmount(() => {
  container.destroy();
});
```

**The destruction of containers is also an asynchronous process** that can be tracked by listening for events:

```ts
container.on("destroying", () => {});
container.on("destroyed", () => {});
```

Once the container is destroyed, it will no longer be allowed to register new children applying new event response functions to perform critical function logic and respond to routing changes.

::: warning
The reason why `destroy()` is asynchronous is that in addition to the _unmount_ definition of the child application is asynchronous, it also includes the need to wait for the end of the asynchronous logic that the child application may cause side effects. For example, an application is in the boostrap section, then the destruction of its container does not need to wait for the end of it because of bootstrap Link default will not produce side effects; But if the application is mounting, then you have to wait for it to finish (Haploid.js defaults to interrupt it as early as possible) and then unmount it.
:::
