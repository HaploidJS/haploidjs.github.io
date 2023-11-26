# Async Navigation Cancelation

Async navigation cancelation is <a href="https://github.com/single-spa/single-spa/pull/826" target="_blank">introduced</a> in version v6 of _single-spa_. However, subject to its implementation has loopholes, see [#single-spa#953](https://github.com/single-spa/single-spa/issues/953), which is likely to cause the view that the user sees to be accidentally tampered with and does not meet the operation expectations

```
  enter A → enter B → enter C         back to A
              ↓                           ↑
              ↓                           ↑ ❌
             ANC---------------------------
```

The key reason for this problem in _single-spa_ is that the rollback back to the previous route does not take into account the latest state of the system and blindly bounces back.

Haploid.js implements this feature by declaring a `cancelActivateApp` asynchronous function for the RouterContainer instance:

```ts{6-14}
import { RouterContainer, CancelationRouterNavigation } from "haploid";

new RouterContainer({
  name: "root",
  root: "#app",
  cancelActivateApp: (
    app: string | undefined,
    evt: CancelationRouterNavigation,
  ): Promise<boolean> => {
    const fromUrl = evt.oldUrl;
    return checkPermission(app, fromUrl).then((result) =>
      result.pass ? true : false,
    );
  },
});
```

> If **cancelActivateApp** throws an exception, it is considered not to cancel.

## Implementation Principle

Unlike _single-spa_, Haploid.js chooses a special confirm/cancel queue model to implement this feature:

- Record each route jump only in the states of confirmed, confirming, and canceled;
- Push them all into a queue in order of priority;
- 「Rule 1」: The left side of the confirmed unit on the far right must be removed from the queue
- 「Rule 2」: The rightmost consecutive cancelled units must be removed from the queue

> Pages that are not in the queue, whether eventually confirmed or cancelled, no longer have control over page navigation.

For example, if the user enters the page A for the first time, setting it confirmed unconditionally, and then the user jumps to pages B and C consecutively, then the current queue state is (bottom-up):

```
[C confirming]
[B confirming]
[A confirmed]
```

At this time, the _cancelActivateApp_ of B and C has not returned. Now assuming C confirms first, A and B must be removed according to 「Rule 1」, that is, in the end, neither confirmation nor cancellation of B has any effect.

```{1}
[C confirmed]
[B confirming] ❌
[A confirmed] ❌
```

If B is assumed to confirm first, A must be removed according to 「Rule 1」:

```{2}
[C confirming]
[B confirmed]
[A confirmed] ❌
```

Now we need to see the result of C, if C confirms, then B is removed and the page remains unchanged. If C is cancelled, according to 「Rule 2」, C is removed from the queue and the current page should return to B.

Now let's go back to the original state and see the result of C and B being undone first.

If C cancels first, then according to 「Rule 2」, C is removed from the queue and the current page should return to B.

```{1}
[C canceled] ❌
[B confirming]
[A confirmed]
```

Look at the result of B, if B confirms, then A is removed and the page remains unchanged, if B is also cancelled, then B is removed and the current page returns to A.

So if B cancels first, does not match any rules, the page and queue remain unchanged, see C. C is confirmed, then A and B are removed, the page remains unchanged. If C is also cancelled, then according to 「Rule 2」, remove B and C, and the page should return to A:

```{1,2}
[C canceled] ❌
[B canceled] ❌
[A confirmed]
```

The progression of the queue goes something like this:

```
Queue Status      Operation           Queue Status      Operation            Queue Status

[C confirming]
[B confirming]
[A confirmed ]  =>confirm C(rule1)=>  [C confirmed]

                =>confirm B(rule1)=>  [C confirming]
                                      [B confirmed ]  =>confirm C(rule1)=>  [C confirming]
                                                      =>cancel C(rule2) =>  [B confirmed]

                =>cancel C(rule2) =>  [B confirming]
                                      [A confirmed]   =>confirm B(rule1)=>  [B confirmed]
                                                      =>cancel B(rule2) =>  [A confirmed]
                =>cancel B(no rule)=> [C confirming]
                                      [B canceled]
                                      [B confirmed]   =>confirm C(rule1)=>  [C confirmed]
                                                      =>cancel C(rule2) =>  [A confirmed]
```

::: tip
Since Haploid.js supports multi-instances on the same page, that is, multiple `RouterContainer`s, they will all participate in the decision of whether to cancel the route. The specific policy is **one-vote veto**, that is, if any instance decides to cancel the route jump, the route will be cancelled.
:::

::: danger
In a multi-instance environment, the execution of `cancelActivateApp `is parallel, and the routing cancellation effectiveness depends on the one that consumes the most time.
:::

Asynchronous route revocation can be used in authentication scenarios with low requirements, similar to route guarding in a _vue-router_.
