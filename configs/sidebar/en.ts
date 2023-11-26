import type { SidebarConfig } from "@vuepress/theme-default";

export const sidebarEn: SidebarConfig = {
  "/guide/": [
    {
      text: "Introduction",
      children: [
        "/guide/README.md",
        "/guide/getting-started.md",
        {
          text: "Principles",
          children: ["/guide/principle/concurrent-scheduling.md"],
        },
        "/guide/register-app.md",
        "/guide/preload.md",
        "/guide/keep-alive.md",
        "/guide/router-dead-loop-detect.md",
        "/guide/async-navigation-cancelation.md",
        {
          text: "JS Sandbox",
          link: "/guide/sandbox/README.md",
          children: [
            "/guide/sandbox/js-evalation.md",
            "/guide/sandbox/dom-visit.md",
            "/guide/sandbox/env-proxy.md",
            "/guide/sandbox/events.md",
          ],
        },
      ],
    },
  ],
  "/advanced/": [
    {
      text: "Advanced",
      children: [
        "/advanced/destroy.md",
        "/advanced/nest.md",
        "/advanced/cdn-escape.md",
        "/advanced/resource-fetch.md",
        "/advanced/timeouts.md",
        "/advanced/css-process.md",
        "/advanced/custom-container.md",
        "/advanced/plug-in.md",
        "/advanced/restorability.md",
        "/advanced/faq.md",
      ],
    },
  ],
};
