# JS 沙箱

沙箱（或沙盒）已经成为微前端框架的标配。Haploid.js 根据一线的业务需求，在参考了各家的实现后，着重在以下领域做了部分能力强化：

1. JS 执行
2. DOM 访问
3. 环境代理
4. 局域事件

只能在注册子应用时选择是否开启沙箱，用 `sandbox` 选项：

```ts{4}
container.registerApp({
    name: 'foo',
    entry: 'https://foo.com/entry',
    sandbox: true,
})
```

::: danger
沙箱仅作用于 UMD 格式。
:::

`sandbox` 选项也可以为一个对象，以提供更详尽的控制：

```ts{5-11}
container.registerApp({
    name: 'foo',
    entry: 'https://foo.com/entry',
    sandbox: {
        escapeVariables: [],
        escapeWindowEvents: [];
        autoWindowEvents: ['load'],
        patches: {
            fetch: true,
            XMLHttpRequest: true
        },
    },
})
```

详尽的选项如下：

| 选项                                                                                                  | 类型                                                                       | 功能                                                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `escapeVariables`                                                                                     | _string[]_                                                                 | 允许逃逸出沙箱的变量名集合，即无论读写都会影响到真正的window和document对象。<br><br>参考<a href="/zh/essentials/sandbox/js-evalation.html">JS执行</a>。                                                                                                                   |
| `enableHtmlPretending`<br>`enableTitlePretending`<br>`enableHeadPretending`<br>`enableBodyPretending` | _boolean_                                                                  | 尽可能将固有DOM结构中的&lt;haploid-html&gt;、&lt;haploid-head&gt;、&lt;haploid-title&gt;和&lt;haploid-body&gt;伪装成真正的html、head、title和body，包括属性、原型链、构造函数等等。<br><br>参考<a href="/zh/essentials/sandbox/dom-visit.html">DOM访问</a>。              |
| `escapeWindowEvents`<br>`escapeDocumentEvents`                                                        | _string[]_                                                                 | 允许逃逸出沙箱的事件名集合。通常来说，在沙箱内部 dispatchEvent，沙箱外部是不会接收到的。如果事件名声明在了这两个选项中，那么外部就可以接收到。<br>无论如何，外部派发的事件，沙箱内部都可以接收到。<br><br>参考<a href="/zh/essentials/sandbox/events.html">局域事件</a>。 |
| `autoWindowEvents`<br>`autoDocumentEvents`                                                            | *Array&lt;keyof WindowEventMap&gt;*和*Array&lt;keyof DocumentEventMap&gt;* | 沙箱内部补偿的事件，比如DOMContentLoaded、beforeunload等，通常来说沙箱是不会收到的。通过声明这两个选项，可以为沙箱补偿。<br><br>参考<a href="/zh/essentials/sandbox/events.html">局域事件</a>。                                                                           |
