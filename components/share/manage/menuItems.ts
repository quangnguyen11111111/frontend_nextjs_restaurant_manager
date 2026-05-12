import { Role } from "@/constants/type";
import {
  Home,
  LineChart,
  ShoppingCart,
  Users2,
  Salad,
  Table,
  Layers,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: "/manage/orders",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Bàn ăn",
    Icon: Table,
    href: "/manage/tables",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Món ăn",
    Icon: Salad,
    href: "/manage/dishes",
    roles: [Role.Owner],
  },
  {
    title: "Danh mục",
    Icon: Layers,
    href: "/manage/categories",
    roles: [Role.Owner],
  },

  {
    title: "Phân tích",
    Icon: LineChart,
    href: "/manage/analytics",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "/manage/accounts",
    roles: [Role.Owner],
  },
];

export default menuItems;
