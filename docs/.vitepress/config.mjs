import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '北京旅游攻略',
  description: '北京旅游 Wiki - 名胜古迹、历史文化、博物馆完整指南',
  lang: 'zh-CN',
  base: '/beijing-travel-guide/',
  lastUpdated: true,
  ignoreDeadLinks: false,
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '名胜古迹', link: '/landmarks/' },
      { text: '近代历史', link: '/history/' },
      { text: '宗教建筑', link: '/religion/' },
      { text: '博物馆', link: '/museums/' },
      { text: '公园', link: '/parks/' },
      { text: '实用攻略', link: '/guide/' }
    ],
    
    sidebar: {
      '/landmarks/': [
        {
          text: '皇家建筑',
          collapsed: false,
          items: [
            {
              text: '故宫博物院',
              link: '/landmarks/forbidden-city/',
              collapsed: true,
              items: [
                { text: '午门', link: '/landmarks/forbidden-city/wumen' },
                { text: '太和殿', link: '/landmarks/forbidden-city/taihe-dian' },
                { text: '中和殿', link: '/landmarks/forbidden-city/zhonghe-dian' },
                { text: '保和殿', link: '/landmarks/forbidden-city/baohe-dian' },
                { text: '乾清宫', link: '/landmarks/forbidden-city/qianqing-gong' },
                { text: '交泰殿', link: '/landmarks/forbidden-city/jiaotai-dian' },
                { text: '坤宁宫', link: '/landmarks/forbidden-city/kunning-gong' },
                { text: '御花园', link: '/landmarks/forbidden-city/yuhua-garden' },
                { text: '珍宝馆', link: '/landmarks/forbidden-city/zhenbao-guan' },
                { text: '钟表馆', link: '/landmarks/forbidden-city/zhongbiao-guan' },
                { text: '九龙壁', link: '/landmarks/forbidden-city/jiulong-bi' }
              ]
            },
            {
              text: '天坛',
              link: '/landmarks/temple-of-heaven/',
              collapsed: true,
              items: [
                { text: '祈年殿', link: '/landmarks/temple-of-heaven/qinian-dian' },
                { text: '圜丘坛', link: '/landmarks/temple-of-heaven/huanqiu-tan' },
                { text: '皇穹宇与回音壁', link: '/landmarks/temple-of-heaven/huangqiong-yu' },
                { text: '丹陛桥', link: '/landmarks/temple-of-heaven/danbi-qiao' },
                { text: '斋宫', link: '/landmarks/temple-of-heaven/zhai-gong' },
                { text: '神乐署', link: '/landmarks/temple-of-heaven/shenyue-shu' }
              ]
            },
            {
              text: '颐和园',
              link: '/landmarks/summer-palace/',
              collapsed: true,
              items: [
                { text: '仁寿殿', link: '/landmarks/summer-palace/renshou-dian' },
                { text: '德和园', link: '/landmarks/summer-palace/dehe-yuan' },
                { text: '佛香阁', link: '/landmarks/summer-palace/foxiang-ge' },
                { text: '长廊', link: '/landmarks/summer-palace/changlang' },
                { text: '排云殿', link: '/landmarks/summer-palace/paiyun-dian' },
                { text: '昆明湖与十七孔桥', link: '/landmarks/summer-palace/kunming-lake' },
                { text: '石舫', link: '/landmarks/summer-palace/shifang' },
                { text: '苏州街', link: '/landmarks/summer-palace/suzhou-street' },
                { text: '谐趣园', link: '/landmarks/summer-palace/xiequ-yuan' },
                { text: '西堤六桥', link: '/landmarks/summer-palace/xidi-bridges' }
              ]
            },
            {
              text: '圆明园',
              link: '/landmarks/yuanmingyuan/',
              collapsed: true,
              items: [
                { text: '大水法', link: '/landmarks/yuanmingyuan/dashuifa' },
                { text: '海晏堂与十二生肖兽首', link: '/landmarks/yuanmingyuan/haiyan-tang' },
                { text: '西洋楼建筑群', link: '/landmarks/yuanmingyuan/xiyang-lou' },
                { text: '福海景区', link: '/landmarks/yuanmingyuan/fuhai' },
                { text: '绮春园', link: '/landmarks/yuanmingyuan/qichun-yuan' },
                { text: '文源阁', link: '/landmarks/yuanmingyuan/wenyuan-ge' }
              ]
            },
            {
              text: '北海公园',
              link: '/landmarks/beihai/',
              collapsed: true,
              items: [
                { text: '白塔与琼华岛', link: '/landmarks/beihai/baita' },
                { text: '九龙壁', link: '/landmarks/beihai/jiulongbi' },
                { text: '五龙亭', link: '/landmarks/beihai/wulongting' },
                { text: '团城', link: '/landmarks/beihai/tuancheng' },
                { text: '静心斋', link: '/landmarks/beihai/jingxinzhai' },
                { text: '西天梵境', link: '/landmarks/beihai/xitianfanjing' }
              ]
            },
            { text: '景山公园', link: '/landmarks/jingshan/' }
          ]
        },
        {
          text: '长城',
          collapsed: false,
          items: [
            {
              text: '八达岭长城',
              link: '/landmarks/badaling/',
              collapsed: true,
              items: [
                { text: '北八楼与好汉坡', link: '/landmarks/badaling/beibalou' },
                { text: '关城与城门', link: '/landmarks/badaling/guancheng' },
                { text: '敌楼与城墙', link: '/landmarks/badaling/dilou' },
                { text: '望京石与历史遗迹', link: '/landmarks/badaling/wangjingshi' },
                { text: '中国长城博物馆', link: '/landmarks/badaling/changcheng-museum' }
              ]
            },
            { text: '慕田峪长城', link: '/landmarks/mutianyu' },
            { text: '司马台长城', link: '/landmarks/simatai' },
            { text: '居庸关', link: '/landmarks/juyongguan' }
          ]
        },
        {
          text: '胡同街区',
          collapsed: false,
          items: [
            { text: '什刹海', link: '/landmarks/shichahai' },
            { text: '南锣鼓巷', link: '/landmarks/nanluoguxiang' },
            { text: '前门大街', link: '/landmarks/qianmen' },
            { text: '大栅栏', link: '/landmarks/dashilan' },
            { text: '琉璃厂', link: '/landmarks/liulichang' },
            { text: '天桥', link: '/landmarks/tianqiao' }
          ]
        },
        {
          text: '古城遗迹',
          collapsed: false,
          items: [
            { text: '明城墙遗址', link: '/landmarks/city-wall' },
            { text: '正阳门（箭楼）', link: '/landmarks/zhengyangmen' },
            { text: '钟鼓楼', link: '/landmarks/drum-tower' },
            { text: '恭王府', link: '/landmarks/gongwangfu' },
            { text: '国子监与孔庙', link: '/landmarks/guozijian' }
          ]
        },
        {
          text: '现代地标',
          collapsed: false,
          items: [
            { text: '鸟巢与水立方', link: '/landmarks/niaochao' },
            { text: '国家大剧院', link: '/landmarks/national-theatre' },
            { text: '798艺术区', link: '/landmarks/798-art-zone' }
          ]
        },
        {
          text: '文化体验',
          collapsed: false,
          items: [
            { text: '老舍茶馆', link: '/landmarks/lao-she-teahouse' },
            { text: '潘家园旧货市场', link: '/landmarks/panjiayuan' }
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
          text: '名人故居',
          collapsed: false,
          items: [
            { text: '北大红楼', link: '/history/peking-university-red' },
            { text: '曹雪芹故居', link: '/history/cao-xueqin-residence' },
            { text: '宋庆龄故居', link: '/history/soong-ching-ling-residence' },
            { text: '老舍故居', link: '/history/lao-she-residence' },
            { text: '鲁迅故居', link: '/history/lu-xun-residence' },
            { text: '茅盾故居', link: '/history/mao-dun-residence' },
            { text: '郭沫若故居', link: '/history/guo-moruo-residence' },
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
            {
              text: '雍和宫',
              link: '/religion/yonghegong/',
              collapsed: true,
              items: [
                { text: '牌楼院与昭泰门', link: '/religion/yonghegong/pailou-yuan' },
                { text: '雍和门（天王殿）', link: '/religion/yonghegong/yonghe-men' },
                { text: '雍和宫殿', link: '/religion/yonghegong/yonghe-dadian' },
                { text: '永佑殿', link: '/religion/yonghegong/yongyou-dian' },
                { text: '法轮殿', link: '/religion/yonghegong/falun-dian' },
                { text: '万福阁（弥勒大佛）', link: '/religion/yonghegong/wanfu-ge' }
              ]
            },
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
            { text: '香山公园', link: '/parks/xiangshan' },
            { text: '北京植物园', link: '/parks/botanical-garden' },
            { text: '北京动物园', link: '/parks/beijing-zoo' },
            { text: '奥林匹克森林公园', link: '/parks/olympic-forest' },
            { text: '朝阳公园', link: '/parks/chaoyang-park' },
            { text: '玉渊潭公园', link: '/parks/yuyuantan' },
            { text: '紫竹院公园', link: '/parks/zizhuyuan' },
            { text: '温榆河公园', link: '/parks/wenyuhe' }
          ]
        }
      ]
    },
    
    footer: {
      message: '用心记录北京的历史与文化',
      copyright: 'Copyright © 2024 北京旅游攻略'
    },
    
    search: {
      provider: 'local'
    },
    
    // editLink: {
    //   pattern: 'https://github.com/<你的用户名>/beijing-travel-guide/edit/main/docs/:path'
    // }
  },
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@700;900&display=swap' }],
    ['meta', { name: 'theme-color', content: '#A83226' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '北京旅游攻略' }],
    ['meta', { property: 'og:description', content: '北京旅游 Wiki - 名胜古迹、历史文化、博物馆完整指南' }]
  ]
})
