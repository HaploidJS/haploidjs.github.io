# Local Event

This only refers to the events of the document and window objects, so it is called a _local event_.

**Haploid.js has designed a separate event system for window and document, so that the sandbox has the ability to isolate from the outside.** The system simulates the trapping and bubbling behavior of events, functions like _stopPropagation_, _stopImmediatePropagation_, _composedPath_, _preventDefault_ and properties like _eventPhase_, _target_, _currentTarget_ are all avaliable.

However, it should be noted that ordinary DOM bubbling events will be passed to the proxy document proxy window through the real document window object, and the return value of the _composedPath_ function of the event will escape the sandbox range.

## Passthrough

In the sandbox, both window and document can register events normally through **addEventListener** and are also affected by `useCapture`.

```ts
function onClick() {
  console.log("click event");
}

document.addEventListener("click", onClick, true);
document.addEventListener("click", onClick, { capture: true }); // Duplicated capture won't add repeatly

document.removeEventListener("click", onClick); // capture not matchm, remove unsuccessfully
```

The sandbox can receive events from outside if an event is sent inside the sandbox, such as:

```ts
document.dispatchEvent(new Event("type"));
window.dispatchEvent(new Event("type"));
```

By default, it is not received outside the sandbox and if you want to receive it, you can declare the event name in the `escapeDocumentEvents` and `escapeWindowEvents` options.

## Cleanup

Events registered by window and document in the sandbox through **addEventListener** are automatically removed after the sandbox exits.

## on&lt;event&gt;

Events assigned by the on&lt;event&gt; attribute are converted to addEventListener operations, still retaining the ability to clean up automatically.

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

## Compensation

Due to the particularity of the micro-frontend sub-application load timing, it often lacks some specific page events, such as load/DOMContentLoaded/beforeunload, etc. Haploid.js provides certain compensation capabilities, can use the `autoDocumentEvents` and `autoWindowEvents` option specifies which events need to be compensated.

Currently supported compensation events are:

- document
  - DOMContentLoaded
- window
  - beforeunload: popups like `alert` are not supported
  - DOMContentLoaded: enabled in document and bubbles to window automatically
  - load: triggers almost simultaneously with DOMContentLoaded

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
