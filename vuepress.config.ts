import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'HaploidJS',
  theme: defaultTheme({
    sidebar: {
        '/guide/': [
            {
              text: 'Guide',
              children: [
                {
                    text: 'Introduction',
                    link: '/guide/',
                },
                {
                    text: 'Getting Started',
                    link: '/guide/getting-started/',
                },
              ],
            },
        ],
    }
  }),
})