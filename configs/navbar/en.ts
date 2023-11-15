import type { NavbarConfig } from "@vuepress/theme-default";

export const navbarEn: NavbarConfig = [
  {
    text: "Introduction",
    link: "/guide/",
  },
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
  {
    text: `v1`,
    children: [
      {
        text: "Changelog",
        link: "https://github.com/HaploidJS/haploid/blob/main/CHANGELOG.md",
      },
    ],
  },
];
