# JS Sandbox

The sandbox has become a standard feature of the micro-frontend frameworks. Haploid.js according to the actual business needs, after referring to the implementation of various, focusing on the following areas to do some capacity strengthening:

1. Js Execution
2. DOM Visit
3. Environmental Proxy
4. Local Event

You can only enable the sandbox when registering sub-applications, by the `sandbox` option:

```ts{4}
container.registerApp({
    name: 'foo',
    entry: 'https://foo.com/entry',
    sandbox: true,
})
```

::: danger
The sandbox cannot work for ESM format.
:::

The `sandbox` options can also provide more details:

```ts{5-11}
container.registerApp({
    name: 'foo',
    entry: 'https://foo.com/entry',
    sandbox: {
        escapeVariables: [],
        escapeWindowEvents: [],
        autoWindowEvents: ['load'],
        patches: {
            fetch: true,
            XMLHttpRequest: true
        },
    },
})
```

The detailed options are as follows:

| Option                                                                                                | Type                                                                          | Function                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `escapeVariables`                                                                                     | _string[]_                                                                    | The variables that allow the fleeing out of the sandbox, that is, the reading and writing will affect the real Window and Document objects. <br><br>See <a href="/essentials/sandbox/js-evalation.html">Js Execution</a>.                                                                                                                                                                              |
| `enableHtmlPretending`<br>`enableTitlePretending`<br>`enableHeadPretending`<br>`enableBodyPretending` | _boolean_                                                                     | As much as possible, the &lt;haploid-html&gt; &lt;haploid-head&gt; &lt;haploid-title&gt; and &lt;haploid-body&gt; in the inherent DOM structure are disguised as real html head title and body, including attribute stereotype chain constructors and so on.<br><br>See <a href="/essentials/sandbox/dom-visit.html">DOM Visit</a>.                                                                    |
| `escapeWindowEvents`<br>`escapeDocumentEvents`                                                        | _string[]_                                                                    | The set of event names that are allowed to escape the sandbox In general, dispatchEvent inside the sandbox, is not received outside the sandbox if the event name is declared in either of these options, then it is received outside the sandbox<br>In any case, events sent outside can be received inside the sandbox, right.<br><br>See <a href="/essentials/sandbox/events.html">Local Event</a>. |
| `autoWindowEvents`<br>`autoDocumentEvents`                                                            | _Array&lt;keyof WindowEventMap&gt;_ and _Array&lt;keyof DocumentEventMap&gt;_ | Compensation events within the sandbox, such as DOMContentLoaded beforeunload, are usually not received by the sandbox by declaring these two options that can be compensated for the sandbox. <br><br>See <a href="/essentials/sandbox/events.html">Local Event</a>.                                                                                                                                  |
