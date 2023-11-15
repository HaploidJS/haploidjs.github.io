# JS Execution

## Variable read and write

After turning on the sandbox, the reading and writing of the Window attribute will be limited to the sandbox without spilling, including the following operations:

```ts
window.foo = 1;
window["foo"] = 1;
Reflect.defineProperty(window, "foo", {
  value: 1,
});
delete window.foo;
Reflect.deleteProperty(window, "foo");
```

Note that the success of the read and write operation is also affected by the attributes of the original variable, for example, there is a _non-writable_ attribute foo on the window, then the sandbox assignment will also fail

```ts
window.foo = "new value"; // ❌
```

In addition to window, Haploid.js also **protects reading and writing to the document attribute**, although this is rarely done

::: warning
Reads and writes to global variables other than window document are not sandboxed, such as **navigator.c=1**.
:::

## Escape of variable

You may want to use the `escapeVariables` option to read and write the actual window and document versions of the file in Haploid.js.

```ts
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  sandbox: {
    escapeVariables: ["__GLOBAL_BASE"],
  },
});
```

However, one risk to pay special attention to is that once a global variable is redefined, it is likely to cause previously readable variables to become unreadable.

```ts
window.foo; // ok
// other program defines foo to unreadable
window.foo; // throw error
```

## Global Variables

In general, for reading and writing _window.foo_, we can omit the context prefix and simply write _foo_ instead of the usual one. This is how we use document history navigaor

In a sandbox environment, except self top parent globalThis document location addEventListener removeEventListener dispatchEvent eval isFinite isNaN parseFloat parseInt hasOwnProperty decodeURI decodeURIComponent encodeURI encodeURIComponent and so on in **envVariables** None of the variables declared in the option should be used this way, **as it will escape to the world, and exceptions will be thrown for undeclared variables in strict mode (with useStrict turned on).**

It is recommended that custom variables use Window/Globalthis prefix.

## Environment Variables

Hapload.js provides the `envVariables` option to declare some virtual variables.This option is effective, but it is obviously different.

```ts
container.registerApp({
  name: "foo",
  entry: "https://foo.com/entry",
  activeWhen: "/foo",
  envVariables: {
    __BASE__: "https://foo.com/",
  },
});
```

In a sandboxed environment, these variables can always be read in a non-sandboxed environment, accessible only in the synchronous code at the entrance.

If there is a conflict with a variable on window, the values in **envVariables** will prevail.

## Context

In a normal sandbox,JS is executed in a separate function context, so the global variable a cannot be accessed later, as in the following code:

```html
<script>
  var a = 2022;
</script>
<script>
  console.log(a);
</script>
```

However, Haploid.js implements a context nesting relationship that enables simple context passing as described above but only if variables can be declared with var as shown below:

```ts
function () {
    var a = 2022;
    function () {
        var b = 2023
        function () {
            console.log(a, b);
        }
    }
}
```

Of course, the most secure way is to directly operate the attributes of Window/globaTthis.
