import type { SidebarConfig } from "@vuepress/theme-default";

export const sidebarZh: SidebarConfig = {
  "/zh/guide/": [
    {
      text: "指南",
      children: [
        "/zh/guide/README.md",
        "/zh/guide/getting-started.md",
        {
          text: "原理",
          children: ["/zh/guide/principle/concurrent-scheduling.md"],
        },
        "/zh/guide/register-app.md",
        "/zh/guide/preload.md",
        "/zh/guide/keep-alive.md",
        "/zh/guide/router-dead-loop-detect.md",
        "/zh/guide/async-navigation-cancelation.md",
        {
          text: "JS 沙箱",
          link: "/zh/guide/sandbox/README.md",
          children: [
            "/zh/guide/sandbox/js-evalation.md",
            "/zh/guide/sandbox/dom-visit.md",
            "/zh/guide/sandbox/env-proxy.md",
            "/zh/guide/sandbox/events.md",
          ],
        },
      ],
    },
  ],
  "/zh/advanced/": [
    {
      text: "进阶",
      children: [
        "/zh/advanced/destroy.md",
        "/zh/advanced/nest.md",
        "/zh/advanced/cdn-escape.md",
        "/zh/advanced/resource-fetch.md",
        "/zh/advanced/timeouts.md",
        "/zh/advanced/css-process.md",
        "/zh/advanced/custom-container.md",
        "/zh/advanced/plug-in.md",
        "/zh/advanced/restorability.md",
        "/zh/advanced/safe-mode.md",
        "/zh/advanced/faq.md",
      ],
    },
  ],
};
