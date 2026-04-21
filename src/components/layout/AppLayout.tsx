import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
export function AppLayout(): JSX.Element {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, location.pathname]);
  if (!isAuthenticated && location.pathname !== "/login") {
    return <div className="h-screen w-screen bg-slate-950" />;
  }
  // Si on est sur /login, on affiche juste l'outlet sans le layout complet
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
            onClick={() => { logout(); navigate("/login"); }}
            className="h-8 w-8 text-muted-foreground hover:text-rose-500 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}