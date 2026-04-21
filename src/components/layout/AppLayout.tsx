import React, { useEffect, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
export function AppLayout(): JSX.Element {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logoutAction = useAuthStore(s => s.logout);
  const resetCartAction = useCartStore(s => s.resetCart);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, location.pathname]);
  const handleLogout = useCallback(() => {
    logoutAction();
    resetCartAction();
    navigate("/login");
  }, [logoutAction, resetCartAction, navigate]);
  if (!isAuthenticated && location.pathname !== "/login") {
    return <div className="h-screen w-screen bg-slate-950" />;
  }
  if (location.pathname === "/login") {
    return <Outlet />;
  }
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <div className="absolute left-2 top-2 z-20 flex items-center gap-2">
          <SidebarTrigger />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 text-muted-foreground hover:text-rose-500 rounded-lg"
            title="Se déconnecter"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}