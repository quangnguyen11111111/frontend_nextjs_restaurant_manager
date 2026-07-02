import { Role } from "@/constants/type";
import {
  Home,
  LineChart,
  ShoppingCart,
  Users2,
  Salad,
  Table,
  Layers,
  Utensils,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    name: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Đơn hàng",
    name: "Orders",
    Icon: ShoppingCart,
    href: "/manage/orders",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Nhà bếp",
    name: "ManageKitchen",
    Icon: Utensils,
    href: "/manage/kitchen",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Bàn ăn",
    name: "Tables",
    Icon: Table,
    href: "/manage/tables",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Món ăn",
    name: "Dishes",
    Icon: Salad,
    href: "/manage/dishes",
    roles: [Role.Owner],
  },
  {
    title: "Danh mục",
    name: "Categories",
    Icon: Layers,
    href: "/manage/categories",
    roles: [Role.Owner],
  },
  {
    title: "Phân tích",
    name: "Analytics",
    Icon: LineChart,
    href: "/manage/analytics",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Nhân viên",
    name: "ManageAccounts",
    Icon: Users2,
    href: "/manage/accounts",
    roles: [Role.Owner],
  },
];

export default menuItems;
