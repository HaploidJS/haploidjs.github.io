import { defineUserConfig, defaultTheme } from "vuepress";
import { shikiPlugin } from "@vuepress/plugin-shiki";

import { sidebarEn, sidebarZh } from "./configs/sidebar/";

import { navbarEn, navbarZh } from "./configs/navbar/";

export default defineUserConfig({
  plugins: [
    shikiPlugin({
      theme: "material-theme",
      langs: ["javascript", "typescript", "ts", "html", "css", "bash", "shell"],
    }),
  ],
  theme: defaultTheme({
    logo: "/assets/logo.svg",
    repo: "HaploidJS/haploid",
    docsRepo: "HaploidJS/haploidjs.github.io",
    docsBranch: "main",
    docsDir: "docs",
    editLinkPattern: ":repo/edit/:branch/:path",
    sidebarDepth: 3,
    locales: {
      "/": {
        // navbar
        navbar: navbarEn,
        // sidebar
        sidebar: sidebarEn,
        selectLanguageName: "English",
        editLinkText: "Edit this page on GitHub",
      },
      "/zh/": {
        // navbar
        navbar: navbarZh,
        // sidebar
        sidebar: sidebarZh,
        selectLanguageName: "简体中文",
        selectLanguageText: "选择语言",
        selectLanguageAriaLabel: "选择语言",
        // page meta
        editLinkText: "在 GitHub 上编辑此页",
        lastUpdatedText: "上次更新",
        contributorsText: "贡献者",
        // custom containers
        tip: "提示",
        warning: "注意",
        danger: "警告",
        // 404 page
        notFound: [
          "这里什么都没有",
          "我们怎么到这来了？",
          "这是一个 404 页面",
          "看起来我们进入了错误的链接",
        ],
        backToHome: "返回首页",
        // a11y
        openInNewWindow: "在新窗口打开",
        toggleColorMode: "切换颜色模式",
        toggleSidebar: "切换侧边栏",
      },
    },
  }),
  locales: {
    "/": {
      lang: "en-US",
      title: "HaploidJS",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "HaploidJS",
    },
  },
});
