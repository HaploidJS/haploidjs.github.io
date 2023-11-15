# Introduction

**Haploid.js** is a [micro-frontend](https://micro-frontends.org/) framework for scheduling the running of independent micro-applications in complex demand environments.

Micro-frontend, also known as _frontend microservices_, is an architecture that assembler multiple independent frontend applications at runtime. The original intention of building Haploid.js is to solve or optimize the problems and insufficient capabilities of existing micro-frontend tools to meet various business demands.

## Why do you need it?

At the beginning of the deployment of micro-frontend architecture applications in the summer and autumn of 2020, the problem to be solved at that time was not the integration of stock applications, but based on the judgment of the future development scale of the business, from the initial design to avoid the problem of evolving into monolith applications in the future.

The ready-made solution available at the time was the [single-spa](https://single-spa.js.org/), and the [qiankun](https://qiankun.umijs.org/) built on top of it.

_single-spa_ is not strictly a framework; it defines itself as a router for front-end microservices. To use it, you have to solve some engineering problems such as application loading, CSS management, etc., which is difficult to say out of the box, so qiankun is a good complement and extension of it, and sets a basic capability benchmark as a micro-frontend framework for new frameworks to emerge.

Our application also built a micro-framework with the support of _single-spa_, but as the complexity of the business increased, this architecture gradually exposed many shortcomings.

The first is **`the limitation of the singleton model`**. The _single-spa_ API is all singleton, which means that you can only implement one micro-frontend instance on a page. Although you can configure different applications to have different DOM mount points, classification management is still cumbersome, and you need to manually distinguish which applications share a mount point In addition, if there is a nested relationship, the application is likely to fail to mount due to the absence of DOM mount points.

> In fact, most of today's micro-frontend solutions are singleton mode.

The second is **`the scheduling efficiency of the application`**, _single-spa_ is based on a single-queue blocking scheduling model, that is, the task of the previous application needs to be completed before the next task can be processed. This creates two problems:

1. As with the singleton model, there should be no blocking between applications at different mount points;
2. An unfinished expired task will block the latest valid task, for example, an old application that is executing a network request will block the latest application from launching

The third is **`the robustness of application scheduling`**, how to deal with the above scheduling optimization improperly, and under some special logic, the effect of the final response of the entire application is not in line with the expectation of the user's final operation, refer to [single-spa#953](https://github.com/single-spa/single-spa/issues/953) and [single-spa#950](https://github.com/single-spa/single-spa/issues/950). And we firmly believe that any framework that is not specifically designed in this area will have a very high probability of this problem.

The fourth is **`the lack of a secure exit mechanism`**, and a number of solutions similar to _single-spa_, expect themselves to be the top-level route, and then in the old application transformation needs, micro-frontend instances often exist in a certain _vue-router/react-router_, so once the route changes, A secure resource destruction mechanism is needed. _single-spa_ have an _unregisterApplication_ mechanism, but only apply to applications that are MOUNTED and cannot be cleaned.

Finally, we need a series of **`fine-grained optimizations for common features`**, such as:

1.  Implemented `Async Navigation Cancelation`, a feature introduced in single-spa v6, but there are bugs;
2.  Enhanced the ability to `keep alive`
3.  Enhanced the ability to `preload`
4.  Implemented `Dead Loop Detect`
5.  Enhanced granularity of control over resource request parameters
6.  etc.

In response to the above needs, we built Haploid.js, which mainly refers to the life cycle model of _single-spa_, so you can still use _single-spa-vue_/_single-spa-react_ and other tools to package sub-applications, they are compatible.

Haploid.js is tested using more than 800 cases to ensure its correctness in application scheduling.
