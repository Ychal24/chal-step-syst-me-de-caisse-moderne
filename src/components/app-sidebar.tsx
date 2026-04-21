import React from "react";
import { ShoppingBag, Package, LayoutDashboard, UtensilsCrossed } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
const navItems = [
  { label: "Caisse", path: "/", icon: ShoppingBag },
  { label: "Stock", path: "/stock", icon: Package },
  { label: "Admin", path: "/admin", icon: LayoutDashboard },
];
export function AppSidebar(): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold tracking-tight">Chal Step</span>
            <span className="text-xs text-muted-foreground">Système POS Moderne</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.path}
                  tooltip={item.label}
                  className="py-6"
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" /> 
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="p-4 border-t">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center">
            PRO POS v1.0
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}