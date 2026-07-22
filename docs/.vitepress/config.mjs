import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '北京旅游攻略',
  description: '北京旅游 Wiki - 名胜古迹、历史文化、博物馆完整指南',
  lang: 'zh-CN',
  base: '/beijing-travel-guide/',
  lastUpdated: true,
  ignoreDeadLinks: true,
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '名胜古迹', link: '/landmarks/forbidden-city' },
      { text: '近代历史', link: '/history/summer-palace' },
      { text: '宗教建筑', link: '/religion/catholic-churches' },
      { text: '博物馆', link: '/museums/palace-museum' },
      { text: '公园', link: '/parks/beihai-park' }
    ],
    
    sidebar: {
      '/landmarks/': [
        {
          text: '皇家建筑',
          collapsed: false,
          items: [
            { text: '故宫博物院', link: '/landmarks/forbidden-city' },
            { text: '天坛', link: '/landmarks/temple-of-heaven' },
            { text: '颐和园', link: '/landmarks/summer-palace' },
            { text: '圆明园', link: '/landmarks/yuanmingyuan' },
            { text: '北海公园', link: '/landmarks/beihai' },
            { text: '景山公园', link: '/landmarks/jingshan' }
          ]
        },
        {
          text: '长城',
          collapsed: false,
          items: [
            { text: '八达岭长城', link: '/landmarks/badaling' },
            { text: '慕田峪长城', link: '/landmarks/mutianyu' },
            { text: '司马台长城', link: '/landmarks/simatai' },
            { text: '居庸关', link: '/landmarks/juyongguan' }
          ]
        },
        {
          text: '古城遗迹',
          collapsed: false,
          items: [
            { text: '明城墙遗址', link: '/landmarks/city-wall' },
            { text: '前门大街', link: '/landmarks/qianmen' },
            { text: '钟鼓楼', link: '/landmarks/drum-tower' }
          ]
        }
      ],
      '/history/': [
        {
          text: '近代历史景点',
          collapsed: false,
          items: [
            { text: '颐和园历史', link: '/history/summer-palace' },
            { text: '圆明园遗址', link: '/history/yuanmingyuan-ruins' },
            { text: '卢沟桥', link: '/history/lugou-bridge' },
            { text: '中国人民抗日战争纪念馆', link: '/history/anti-japanese-war' }
          ]
        },
        {
          text: '民国建筑',
          collapsed: false,
          items: [
            { text: '北大红楼', link: '/history/peking-university-red' },
            { text: '鲁迅故居', link: '/history/lu-xun-residence' },
            { text: '蔡元培故居', link: '/history/cai-yuanpei' }
          ]
        },
        {
          text: '革命纪念地',
          collapsed: false,
          items: [
            { text: '天安门广场', link: '/history/tiananmen-square' },
            { text: '人民英雄纪念碑', link: '/history/monument' },
            { text: '毛主席纪念堂', link: '/history/mausoleum' },
            { text: '中国国家博物馆', link: '/history/national-museum' }
          ]
        }
      ],
      '/religion/': [
        {
          text: '天主教堂',
          collapsed: false,
          items: [
            { text: '南堂(宣武门教堂)', link: '/religion/nantang' },
            { text: '北堂(西什库教堂)', link: '/religion/beitang' },
            { text: '东堂(王府井教堂)', link: '/religion/dongtang' },
            { text: '西堂(西直门教堂)', link: '/religion/xitang' },
            { text: '东交民巷天主堂', link: '/religion/dongjiaominxiang' }
          ]
        },
        {
          text: '佛教寺院',
          collapsed: false,
          items: [
            { text: '雍和宫', link: '/religion/yonghegong' },
            { text: '潭柘寺', link: '/religion/tanzhe' },
            { text: '戒台寺', link: '/religion/jietai' },
            { text: '法源寺', link: '/religion/fayuan' },
            { text: '广济寺', link: '/religion/guangji' }
          ]
        },
        {
          text: '道教宫观',
          collapsed: false,
          items: [
            { text: '白云观', link: '/religion/baiyunguan' },
            { text: '东岳庙', link: '/religion/dongyuemiao' },
            { text: '火神庙', link: '/religion/huoshen' }
          ]
        }
      ],
      '/museums/': [
        {
          text: '综合性博物馆',
          collapsed: false,
          items: [
            { text: '中国国家博物馆', link: '/museums/national-museum' },
            { text: '首都博物馆', link: '/museums/capital-museum' },
            { text: '故宫博物院', link: '/museums/palace-museum' }
          ]
        },
        {
          text: '科技馆',
          collapsed: false,
          items: [
            { text: '中国科技馆', link: '/museums/science-center' },
            { text: '北京天文馆', link: '/museums/planetarium' },
            { text: '中国古动物馆', link: '/museums/paleo-zoo' }
          ]
        },
        {
          text: '专题博物馆',
          collapsed: false,
          items: [
            { text: '军事博物馆', link: '/museums/military' },
            { text: '自然博物馆', link: '/museums/natural-history' },
            { text: '鲁迅博物馆', link: '/museums/lu-xun' },
            { text: '老舍纪念馆', link: '/museums/laoshe' }
          ]
        }
      ],
      '/parks/': [
        {
          text: '皇家园林',
          collapsed: false,
          items: [
            { text: '北海公园', link: '/parks/beihai-park' },
            { text: '景山公园', link: '/parks/jingshan-park' },
            { text: '中山公园', link: '/parks/zhongshan-park' },
            { text: '劳动人民文化宫', link: '/parks/cultural-palace' }
          ]
        },
        {
          text: '城市公园',
          collapsed: false,
          items: [
            { text: '天坛公园', link: '/parks/temple-heaven' },
            { text: '地坛公园', link: '/parks/ditan-park' },
            { text: '日坛公园', link: '/parks/ritan-park' },
            { text: '月坛公园', link: '/parks/yuetan-park' }
          ]
        },
        {
          text: '现代公园',
          collapsed: false,
          items: [
            { text: '奥林匹克森林公园', link: '/parks/olympic-forest' },
            { text: '朝阳公园', link: '/parks/chaoyang-park' },
            { text: '玉渊潭公园', link: '/parks/yuyuantan' },
            { text: '紫竹院公园', link: '/parks/zizhuyuan' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/beijing-travel-guide' }
    ],
    
    footer: {
      message: '用心记录北京的历史与文化',
      copyright: 'Copyright © 2024 北京旅游攻略'
    },
    
    search: {
      provider: 'local'
    },
    
    editLink: {
      pattern: 'https://github.com/yourusername/beijing-travel-guide/edit/main/docs/:path'
    }
  },
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '北京旅游攻略' }],
    ['meta', { property: 'og:description', content: '北京旅游 Wiki - 名胜古迹、历史文化、博物馆完整指南' }]
  ]
})
