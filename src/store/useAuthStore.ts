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
/**
 * Simplified Auth Store for Demo Mode.
 * Adjusted logout behavior for Phase 14: maintains admin role for uninterrupted demo experience.
 */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  userRole: 'admin',
  sessionSellerId: null,
  login: (role, sellerId = null) => set({
    isAuthenticated: true,
    userRole: role,
    sessionSellerId: sellerId
  }),
  logout: () => set({
    isAuthenticated: true,
    userRole: 'admin',
    sessionSellerId: null
  }),
}));