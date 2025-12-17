import type {NavItem} from "../../types";

export const CATEGORIES: NavItem[] = [
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
  }
];
