# 局域事件

这里仅指 document 和 window 两个对象的事件，因此叫*局域事件*。

**Haploid.js 为 window 和 document 单独设计了一套事件系统，使得沙箱具备和外部隔离的能力**。这套系统模拟了事件的捕获、冒泡行为，_stopPropagation_、_stopImmediatePropagation_、_composedPath_、_preventDefault_ 函数以及 _eventPhase_、_target_、_currentTarget_ 属性都是可用的。

但需要注意，普通 DOM 的冒泡事件，会通过真实 document、window 对象传递到代理 document、代理 window 上，事件的 _composedPath_ 函数返回值会逃逸出沙箱范围。

## 透传

在沙箱中，window 和 document 都可以通过 **addEventListener** 正常注册事件，且同样受到 `useCapture` 的影响。

```ts
function onClick() {
  console.log("click event");
}

document.addEventListener("click", onClick, true);
document.addEventListener("click", onClick, { capture: true }); // capture 重复，不会重复 add

document.removeEventListener("click", onClick); // capture 不匹配，remove 不成功
```

沙箱内部可以接收到来自外部的事件。如果在沙箱内部派发事件，如：

```ts
document.dispatchEvent(new Event("type"));
window.dispatchEvent(new Event("type"));
```

默认地，沙箱外部是接收不到的。如果想接收，那么可以把事件名声明在 `escapeDocumentEvents` 和 `escapeWindowEvents` 选项中。

## 清理

沙箱中 window 和 document 通过 **addEventListener** 注册的事件，在沙箱退出后会自动移除。

## on&lt;event&gt;

通过 on&lt;event&gt; 属性赋值的事件，会被转换为 addEventListener 操作，依然保留了自动清理的能力。

```ts
function onBeforeUnload() {
  console.log("click event");
}

function onBeforeUnload2() {
  console.log("click event");
}

window.onbeforeunload = onBeforeUnload;
window.onbeforeunload = onBeforeUnload2; // onBeforeUnload is removed immediately
```

## 补偿

由于微前端下子应用载入时序的特殊性，它往往缺乏一些特定的页面事件，比如 load、DOMContentLoaded、beforeunload 等等。Haploid.js 提供了一定的补偿能力，可以用 `autoDocumentEvents` 和 `autoWindowEvents` 选项指定哪些事件需要补偿。

目前支持的补偿事件有：

- document
  - DOMContentLoaded
- window
  - beforeunload: 不支持弹窗
  - DOMContentLoaded: 在 document 处开启即可，自动冒泡到 window
  - load: 与 DOMContentLoaded 几乎同时触发

```ts{6-7}
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  sandbox: {
    autoDocumentEvents: ["DOMContentLoaded"],
    autoWindowEvents: ["beforeunload", "load"],
  },
});
```
