import type {NavItem} from "../../types/types.ts";

export const CATEGORIES: NavItem[] = [
  {label: "Thời sự",
    path: "/thoi-su",
    subItems: [
      { label: "Chính trị", path: "/thoi-su/chinh-tri" },
      { label: "Xã hội", path: "/thoi-su/xa-hoi" },
      { label: "Đô thị", path: "/thoi-su/do-thi" },
      { label: "Chuyện thường ngày ở phường, xã", path: "/thoi-su/chuyen-thuong-ngay-o-phuong-xa" },
      { label: "Biển đảo", path: "/thoi-su/bien-dao" },
    ],
  },

  {
    label: "Quốc tế",
    path: "/quoc-te",
    subItems: [
      { label: "Người Việt đó đây", path: "/quoc-te/nguoi-viet-do-day" },
      { label: "Hay - lạ", path: "/quoc-te/hay-la" },
      { label: "Vấn đề nóng", path: "/quoc-te/van-de-nong" },
      { label: "Hồ sơ", path: "/quoc-te/ho-so" },
      { label: "Quân sự - Quốc phòng", path: "/quoc-te/quan-su-quoc-phong" },
    ],
  },

  {label: "Lao động",
    path: "/lao-dong",
    subItems: [
      { label: "Công đoàn - Công nhân", path: "/lao-dong/cong-doan-cong-nhan" },
      { label: "Việc làm", path: "/lao-dong/viec-lam" },
      { label: "An sinh xã hội", path: "/lao-dong/an-sinh-xa-hoi" },
      { label: "Chính sách", path: "/lao-dong/chinh-sach" },
      { label: "Xuất khẩu lao động", path: "/lao-dong/xuat-khau-lao-dong" },
    ],
  },

  {label: "Bạn đọc",
    path: "/ban-doc",
    subItems: [
      { label: "Nhà ở xã hội", path: "/ban-doc/nha-o-xa-hoi" },
      { label: "Tôi lên tiếng", path: "/ban-doc/toi-len-tieng" },
      { label: "Góc ảnh bạn đọc", path: "/ban-doc/goc-anh-ban-doc" },
      { label: "Cuộc sống nhân ái", path: "/ban-doc/cuoc-song-nhan-ai" },
      { label: "Thư bạn đọc", path: "/ban-doc/thu-ban-doc" },
    ],
  },

  {label: "Net Zero",
    path: "/net-zero",
    subItems: [
      { label: "Tin tức & Xu hướng", path: "/net-zero/tin-tuc-xu-huong" },
      { label: "Chuyển đổi xanh", path: "/net-zero/chuyen-doi-xanh" },
      { label: "Sống xanh", path: "/net-zero/song-xanh" },
      { label: "Cẩm nang", path: "/net-zero/cam-nang" },
    ],
  },

  {label: "Kinh tế",
    path: "/kinh-te",
    subItems: [
      { label: "Kinh doanh", path: "/kinh-te/kinh-doanh" },
      { label: "Tiêu dùng", path: "/kinh-te/tieu-dung" },
      { label: "Ôtô - Xe - Điện máy", path: "/kinh-te/oto-xe-dien-may" },
      { label: "Bất động sản", path: "/kinh-te/bat-dong-san" },
      { label: "Tài chính – Chứng khoán", path: "/kinh-te/tai-chinh-chung-khoan" },
      { label: "Diễn đàn kinh tế", path: "/kinh-te/dien-dan-kinh-te" },
    ],
  },

  {label: "Sức khỏe",
    path: "/suc-khoe",
    subItems: [
      { label: "Chuyển động y học", path: "/suc-khoe/chuyen-dong-y-hoc" },
      { label: "Giới tính", path: "/suc-khoe/gioi-tinh" },
      { label: "Bác sĩ của bạn", path: "/suc-khoe/bac-si-cua-ban" },
      { label: "Khỏe & đẹp", path: "/suc-khoe/khoe-va-dep" },
    ],
  },

  {label: "Giáo dục",
    path: "/giao-duc-khoa-hoc",
    subItems: [
      { label: "Du học", path: "/giao-duc-khoa-hoc/du-hoc" },
      { label: "Tuyển sinh", path: "/giao-duc-khoa-hoc/tuyen-sinh" },
      { label: "Sau bục giảng", path: "/giao-duc-khoa-hoc/sau-buc-giang" },
    ],
  },

  {label: "Pháp luật",
    path: "/phap-luat",
    subItems: [
      { label: "Luật sư của bạn", path: "/phap-luat/luat-su-cua-ban" },
      { label: "Truy nã", path: "/phap-luat/truy-na" },
      { label: "Chuyện pháp đình", path: "/phap-luat/chuyen-phap-dinh" },
    ],
  },

  {label: "Văn hóa-Văn nghệ",
    path: "/van-hoa-van-nghe",
    subItems: [
      { label: "Âm nhạc", path: "/van-hoa-van-nghe/am-nhac" },
      { label: "Văn học", path: "/van-hoa-van-nghe/van-hoc" },
      { label: "Sân khấu", path: "/van-hoa-van-nghe/san-khau" },
      { label: "Điện ảnh", path: "/van-hoa-van-nghe/dien-anh" },
      { label: "Nghe - Xem – Đọc gì?", path: "/van-hoa-van-nghe/nghe-xem-doc-gi" },
    ],

  },
  {label: "Giải trí",
    path: "/giai-tri",
    subItems: [
      { label: "Hậu trường showbiz", path: "/giai-tri/hau-truong-showbiz" },
      { label: "Chuyện của sao", path: "/giai-tri/chuyen-cua-sao" },
    ],
  },

  {label: "Thể thao",
    path: "/the-thao",
    subItems: [
      { label: "Bóng đá", path: "/the-thao/bong-da" },
      { label: "Golf", path: "/the-thao/golf" },
      { label: "Hậu trường", path: "/the-thao/hau-truong" },
      { label: "Các môn khác", path: "/the-thao/cac-mon-khac" },
      { label: "Tennis", path: "/the-thao/tennis" },
      { label: "Marathon", path: "/the-thao/marathon" },
    ],
  },
  {label: "AI 365",
    path: "/ai-365",
    subItems: [
      { label: "Công nghệ số", path: "/ai-365/cong-nghe-so" },
      { label: "Bảo mật", path: "/ai-365/bao-mat" },
      { label: "Mạng xã hội", path: "/ai-365/mang-xa-hoi" },
      { label: "Giải trí cùng AI", path: "/ai-365/giai-tri-cung-ai" },
    ],
  },

  {label: "Gia đình",
    path: "/gia-dinh",
    subItems: [
      { label: "Không gian sống", path: "/gia-dinh/khong-gian-song" },
      { label: "Cha mẹ và con cái", path: "/gia-dinh/cha-me-va-con-cai" },
      { label: "Bí quyết làm đẹp", path: "/gia-dinh/bi-quyet-lam-dep" },
    ],
  },
];
