import React, { useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { LogOut, Lock } from "lucide-react";
export function AppLayout(): JSX.Element {
  const logoutAction = useAuthStore(s => s.logout);
  const resetCartAction = useCartStore(s => s.resetCart);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = useCallback(() => {
    logoutAction();
    resetCartAction();
    navigate("/"); // In demo mode, logout just clears state
  }, [logoutAction, resetCartAction, navigate]);
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
            className="h-8 w-8 text-muted-foreground hover:text-amber-500 rounded-lg"
            title="Réinitialiser la session"
          >
            <RefreshIcon className="h-4 w-4" />
          </Button>
        </div>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}