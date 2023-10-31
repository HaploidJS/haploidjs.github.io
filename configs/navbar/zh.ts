import type { NavbarConfig } from "@vuepress/theme-default";

export const navbarZh: NavbarConfig = [
  {
    text: "指南",
    link: "/zh/guide/",
  },
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
      "/zh/advanced/faq.md",
    ],
  },
  {
    text: `v1`,
    children: [
      {
        text: "更新日志",
        link: "https://github.com/HaploidJS/haploid/blob/main/CHANGELOG.md",
      },
    ],
  },
];
