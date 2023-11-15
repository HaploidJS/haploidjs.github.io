# Router Dead Loop Detection

Dead-loop routing is usually a dead-loop jump of a page request caused by setting an incorrect routing jump is usually blocked by the browser, while a dead-loop in history causes a stack overflow error in JS.

Haploid.js will try to detect the loop to some extent, by calculating the `history.pushState/replaceState` operation in the past 1 second, if the jump more than 50 times, or jump to the same path more than 20 times, it is recognized as a routing exception.

Detection results can be captured by events:

```ts
import { getUniversalRouter } from "haploid";

getUniversalRouter().on("deadloopdetect", () => {
  console.log("Routing Exception");
});
```

You can also disable routing loop detection:

```ts
window__HAPLOID_DISABLE_DEADLOOP_DETECT__ = false;
```

::: warning
As can also be seen from the **getUniversalRouter**, the routing module is globally unique, which is one of the key prerequisites for Haploid.js to implement multiple instances. Therefore, once this option is set, the routing loop detection function is disabled for all instances.
:::
