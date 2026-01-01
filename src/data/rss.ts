export const RSS_FEEDS = {
    home: "https://nld.com.vn/rss/home.rss",
    "thoi-su": "https://nld.com.vn/rss/thoi-su.rss",
    "/thoi-su/chinh-tri": "https://nld.com.vn/rss/chinh-tri.rss",

    "quoc-te": "https://nld.com.vn/rss/quoc-te.rss",
    "lao-dong": "https://nld.com.vn/rss/lao-dong.rss",
    "ban-doc": "https://nld.com.vn/rss/ban-doc.rss",
    "net-zero": "https://nld.com.vn/rss/net-zero.rss",
    "kinh-te": "https://nld.com.vn/rss/kinh-te.rss",
    "suc-khoe": "https://nld.com.vn/rss/suc-khoe.rss",
    "giao-duc": "https://nld.com.vn/rss/giao-duc-khoa-hoc.rss",
    "phap-luat": "https://nld.com.vn/rss/phap-luat.rss",
    "van-hoa-van-nghe": "https://nld.com.vn/rss/van-hoa-van-nghe.rss",
    "giai-tri": "https://nld.com.vn/rss/giai-tri.rss",
    "the-thao": "https://nld.com.vn/rss/the-thao.rss",
    "ai-365": "https://nld.com.vn/rss/ai-365.rss",
    "gia-dinh": "https://nld.com.vn/rss/gia-dinh.rss",
} as const;

export type RssKey = keyof typeof RSS_FEEDS;
