# Instance Nesting

Instance nesting is equivalent to Container nesting.

Obviously, **a necessary condition for container nesting to be possible is that the container (instance) can be destroyed**.

You can create a new container in the sub-application, while noting that you still need to manually adapt the routing compatibility with the main application, and manually trigger destruction.

```ts
// Main App
const container = new Container({
  name: "app",
  root: "#app",
});
container.registerApp({
  name: "foo",
  activeWhen: "/foo",
});

// Sub App
const subContainer = new Container({
  name: "foo",
  root: "#foo",
});
subContainer.registerApp({
  name: "foo-about",
  activeWhen: "/foo/about", // must be under /foo
});

// trigger unmount manually
onBeforeUnmount(() => {
  subContainer.destroy();
});
```

When both primary and sub-applications are of the Router type, they can be likened to the primary and sub-routes of vue-router/react-router, except that the primary and sub-applications do not perceive each other. This is due to the nature of the micro-frontend architecture.

In the actual business scenario, the main-sub-application and sub-sub-application are often independent projects, that is, independent warehouses are independently built and published, and even have independent domain names and independent maintenance team.

Therefore, one practice of the above code is that the main subproject imports Haploid.js independently, which can result in multiple copies of Haploid.js on the page.

Of course, you can also use technical means to achieve the uniqueness of Haploid.js, but **Haploid.js is designed to be as compatible as possible with multiple copies running at the same time**, that is, the master sub-application can have their own different versions of Haploid.js import this is also Haploid.js An effort to implement multi-instance instance nesting

:::warning
Of course, in the long run, there is a possibility of incompatibility between different versions of Haploid.js, and Haploid.js itself has made an internal judgment that we recommend that the master and sub-applications remain the same or similar versions as much as possible, so that they can run completely decouple and independently.
:::
