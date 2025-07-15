import { menuItems } from "@/type/constMenubar";
import { usePathname } from "next/navigation";

export function getMenuItems() {
    const menulist = menuItems;
    return menulist;
}

export function getMenuPath() {
    const pathname = usePathname();
    return pathname;
}