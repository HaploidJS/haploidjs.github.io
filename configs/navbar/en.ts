import type { NavbarConfig } from "@vuepress/theme-default";

export const navbarEn: NavbarConfig = [
  {
    text: "Guide",
    link: "/guide/",
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
