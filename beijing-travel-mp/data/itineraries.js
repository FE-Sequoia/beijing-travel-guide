// 小程序静态数据模块：避免部分开发者工具对 require(JSON) 的兼容问题。
module.exports = [
  {
    "id": "classic-1-day",
    "days": 1,
    "title": "一日初见北京",
    "summary": "把中轴线的第一眼，留给天安门、故宫和老城夜色。",
    "theme": "经典中轴线",
    "tips": "故宫等热门场馆请提前以官方渠道确认预约；当天只选一处馆内重点慢慢看。",
    "schedule": [
      {
        "day": 1,
        "title": "皇城与湖畔",
        "stops": [
          {
            "time": "上午",
            "placeId": "tiananmen",
            "note": "清晨广场视野开阔，按现场安排游览。"
          },
          {
            "time": "上午",
            "placeId": "forbidden-city",
            "note": "从午门入馆，预留半天。"
          },
          {
            "time": "午后",
            "placeId": "jingshan-park",
            "note": "登高看中轴线，再按体力继续。"
          },
          {
            "time": "傍晚",
            "placeId": "landmarks-shichahai",
            "note": "沿水边散步，给晚餐留出时间。"
          }
        ]
      }
    ]
  },
  {
    "id": "highlights-2-days",
    "days": 2,
    "title": "两日精华慢游",
    "summary": "一天走皇城，一天逛古寺与学府，把步行量控制在舒服的节奏。",
    "theme": "初次到访",
    "tips": "第二天路线较长，优先地铁接驳，体力不足时可省略最后一站。",
    "schedule": [
      {
        "day": 1,
        "title": "皇城记忆",
        "stops": [
          {
            "time": "上午",
            "placeId": "tiananmen",
            "note": "先从开阔的城市中轴线开始。"
          },
          {
            "time": "上午",
            "placeId": "forbidden-city",
            "note": "预约成功后再安排当天路线。"
          },
          {
            "time": "午后",
            "placeId": "jingshan-park",
            "note": "用一段登高收束故宫视角。"
          },
          {
            "time": "傍晚",
            "placeId": "beihai",
            "note": "在湖边放慢脚步。"
          }
        ]
      },
      {
        "day": 2,
        "title": "古寺与学府",
        "stops": [
          {
            "time": "上午",
            "placeId": "yonghegong",
            "note": "雍和宫五进院落，慢慢看。"
          },
          {
            "time": "午后",
            "placeId": "guozijian",
            "note": "孔庙与国子监一街之隔，看辟雍大殿。"
          },
          {
            "time": "傍晚",
            "placeId": "parks-olympic-forest",
            "note": "以轻松散步结束一天。"
          }
        ]
      }
    ]
  },
  {
    "id": "classic-3-days",
    "days": 3,
    "title": "三日北京经典线",
    "summary": "中轴线、古寺学府和长城各留一天，第一次来也能把最想看的都看遍。",
    "theme": "经典全览",
    "tips": "第二天可在雍和宫、国子监和奥林匹克森林公园之间灵活取舍；去长城请早出发，预留往返时间。",
    "schedule": [
      {
        "day": 1,
        "title": "中轴线初见",
        "stops": [
          {
            "time": "上午",
            "placeId": "tiananmen",
            "note": "城市地标与广场。"
          },
          {
            "time": "上午",
            "placeId": "forbidden-city",
            "note": "半天深度游览。"
          },
          {
            "time": "午后",
            "placeId": "jingshan-park",
            "note": "看故宫全景。"
          }
        ]
      },
      {
        "day": 2,
        "title": "古寺与学府",
        "stops": [
          {
            "time": "上午",
            "placeId": "yonghegong",
            "note": "重点游览中轴大殿与藏宝阁一带。"
          },
          {
            "time": "午后",
            "placeId": "guozijian",
            "note": "从国学殿堂中读一段文教史。"
          },
          {
            "time": "傍晚",
            "placeId": "parks-olympic-forest",
            "note": "顺路看鸟巢与水立方的灯光。"
          }
        ]
      },
      {
        "day": 3,
        "title": "长城与老城",
        "stops": [
          {
            "time": "上午",
            "placeId": "shuiguan",
            "note": "早出发，缆车或徒步登城，预留往返时间。"
          },
          {
            "time": "傍晚",
            "placeId": "landmarks-nanluoguxiang",
            "note": "回城后沿胡同慢逛，晚餐随心。"
          }
        ]
      }
    ]
  },
  {
    "id": "deep-5-days",
    "days": 5,
    "title": "五日深度体验",
    "summary": "经典、长城、博物馆、胡同与公园各留一天，把北京的高光都走一遍。",
    "theme": "慢节奏城市漫游",
    "tips": "每一天最多安排两处重点景点，下午留出交通与休息弹性。",
    "schedule": [
      {
        "day": 1,
        "title": "皇城中轴",
        "stops": [
          {
            "time": "上午",
            "placeId": "tiananmen",
            "note": "从广场开始。"
          },
          {
            "time": "上午",
            "placeId": "forbidden-city",
            "note": "故宫半日。"
          },
          {
            "time": "午后",
            "placeId": "jingshan-park",
            "note": "登景山。"
          }
        ]
      },
      {
        "day": 2,
        "title": "山色与花木",
        "stops": [
          {
            "time": "上午",
            "placeId": "xiangshan",
            "note": "登高看西山，秋色尤佳。"
          },
          {
            "time": "午后",
            "placeId": "botanical-garden",
            "note": "从植物园缓行下山。"
          }
        ]
      },
      {
        "day": 3,
        "title": "长城一日",
        "stops": [
          {
            "time": "上午",
            "placeId": "shuiguan",
            "note": "早出发登城，索道或徒步都可，预留全天。"
          },
          {
            "time": "傍晚",
            "placeId": "wangfujing",
            "note": "回城后逛步行街，晚餐自由。"
          }
        ]
      },
      {
        "day": 4,
        "title": "老城街巷",
        "stops": [
          {
            "time": "上午",
            "placeId": "landmarks-qianmen",
            "note": "老城步行。"
          },
          {
            "time": "午后",
            "placeId": "landmarks-nanluoguxiang",
            "note": "胡同慢游。"
          },
          {
            "time": "傍晚",
            "placeId": "landmarks-shichahai",
            "note": "水边晚风。"
          }
        ]
      },
      {
        "day": 5,
        "title": "博物馆与公园",
        "stops": [
          {
            "time": "上午",
            "placeId": "national-museum",
            "note": "看一条展览主线。"
          },
          {
            "time": "午后",
            "placeId": "parks-temple-heaven",
            "note": "公园主轴线。"
          },
          {
            "time": "傍晚",
            "placeId": "parks-olympic-forest",
            "note": "按体力调整。"
          }
        ]
      }
    ]
  },
  {
    "id": "complete-7-days",
    "days": 7,
    "title": "七日从容北京",
    "summary": "适合第一次深入停留：中轴线、长城、山色花木、博物馆、胡同与公园都有余白。",
    "theme": "全景慢游",
    "tips": "把预约制场馆优先固定，再把公园和街巷作为可替换的弹性日程；长城日务必早出发。",
    "schedule": [
      {
        "day": 1,
        "title": "中轴线",
        "stops": [
          {
            "time": "上午",
            "placeId": "tiananmen",
            "note": "开场地标。"
          },
          {
            "time": "上午",
            "placeId": "forbidden-city",
            "note": "故宫主线。"
          }
        ]
      },
      {
        "day": 2,
        "title": "景山与北海",
        "stops": [
          {
            "time": "上午",
            "placeId": "jingshan-park",
            "note": "高处看城。"
          },
          {
            "time": "午后",
            "placeId": "beihai",
            "note": "湖畔休闲。"
          }
        ]
      },
      {
        "day": 3,
        "title": "长城与夜色",
        "stops": [
          {
            "time": "上午",
            "placeId": "shuiguan",
            "note": "全天登城，早去早回。"
          },
          {
            "time": "傍晚",
            "placeId": "wangfujing",
            "note": "回城逛步行街。"
          }
        ]
      },
      {
        "day": 4,
        "title": "山色与花木",
        "stops": [
          {
            "time": "上午",
            "placeId": "xiangshan",
            "note": "香山登高，看西山余脉。"
          },
          {
            "time": "午后",
            "placeId": "botanical-garden",
            "note": "植物园缓步。"
          }
        ]
      },
      {
        "day": 5,
        "title": "国博与前门",
        "stops": [
          {
            "time": "上午",
            "placeId": "national-museum",
            "note": "看一条展览线。"
          },
          {
            "time": "午后",
            "placeId": "landmarks-qianmen",
            "note": "老城散步。"
          }
        ]
      },
      {
        "day": 6,
        "title": "胡同",
        "stops": [
          {
            "time": "上午",
            "placeId": "landmarks-nanluoguxiang",
            "note": "早些出发。"
          },
          {
            "time": "午后",
            "placeId": "landmarks-shichahai",
            "note": "水边与街巷。"
          },
          {
            "time": "傍晚",
            "placeId": "landmarks-gongwangfu",
            "note": "按预约与体力决定。"
          }
        ]
      },
      {
        "day": 7,
        "title": "天坛与公园",
        "stops": [
          {
            "time": "上午",
            "placeId": "parks-temple-heaven",
            "note": "留意开放安排。"
          },
          {
            "time": "午后",
            "placeId": "parks-olympic-forest",
            "note": "森林公园散步。"
          },
          {
            "time": "傍晚",
            "placeId": "zhonglou",
            "note": "选一处小而安静的文化停留。"
          }
        ]
      }
    ]
  }
];
