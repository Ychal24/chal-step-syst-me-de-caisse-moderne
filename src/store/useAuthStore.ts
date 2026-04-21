import { create } from 'zustand';
import { Id } from '@convex/_generated/dataModel';
type UserRole = 'admin' | 'seller' | null;
interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole;
  sessionSellerId: Id<"sellers"> | null;
  login: (role: UserRole, sellerId?: Id<"sellers"> | null) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userRole: null,
  sessionSellerId: null,
  login: (role, sellerId = null) => set({
    isAuthenticated: true,
    userRole: role,
    sessionSellerId: sellerId
  }),
  logout: () => set({
    isAuthenticated: false,
    userRole: null,
    sessionSellerId: null
  }),
}));