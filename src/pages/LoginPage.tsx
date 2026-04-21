import React, { useState, useCallback, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Delete, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
export function LoginPage() {
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const verifyPin = useMutation(api.pos.verifyPin);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const handleSubmit = useCallback(async (currentPin: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await verifyPin({ pin: currentPin });
      if (result) {
        login(result.role, result.sellerId);
        toast.success(`Bienvenue ${result.role === 'admin' ? 'Administrateur' : 'Vendeur'}`);
        navigate("/");
      } else {
        setIsError(true);
        setPin("");
        toast.error("Code PIN incorrect");
        // Reset error state after animation
        setTimeout(() => setIsError(false), 500);
      }
    } catch (e) {
      toast.error("Erreur de connexion");
      setPin("");
    } finally {
      setIsSubmitting(false);
    }
  }, [verifyPin, login, navigate, isSubmitting]);
  const handlePress = useCallback((val: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + val);
      setIsError(false);
    }
  }, [pin.length]);
  const handleDelete = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
    setIsError(false);
  }, []);
  useEffect(() => {
    // Only auto-submit for 4-digit PINs (typically admin or set seller PINs)
    // PINs that are intentionally empty (demo mode) require clicking "OK"
    if (pin.length === 4) {
      handleSubmit(pin);
    }
  }, [pin, handleSubmit]);
  const numpad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "DEL", "0", "OK"];
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="h-20 w-20 bg-primary rounded-3xl flex items-center justify-center shadow-primary shadow-2xl"
          >
            <UtensilsCrossed className="h-10 w-10 text-white" />
          </motion.div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Chal Step</h1>
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Accès Sécurisé POS</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-8">
          <div className="flex justify-center gap-4 h-10 items-center">
            <AnimatePresence mode="popLayout">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={isError ? { 
                    x: [0, -10, 10, -10, 10, 0],
                    backgroundColor: "#f43f5e",
                    borderColor: "#f43f5e"
                  } : {
                    x: 0,
                    backgroundColor: i < pin.length ? "hsl(var(--primary))" : "transparent",
                    borderColor: i < pin.length ? "hsl(var(--primary))" : "rgba(255,255,255,0.2)",
                    scale: i < pin.length ? 1.25 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-5 w-5 rounded-full border-2 transition-colors duration-200"
                />
              ))}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {numpad.map((val) => (
              <Button
                key={val}
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => {
                  if (val === "OK") handleSubmit(pin);
                  else if (val === "DEL") handleDelete();
                  else handlePress(val);
                }}
                className={cn(
                  "h-20 rounded-2xl text-2xl font-black transition-all active:scale-90",
                  val === "OK"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                    : val === "DEL"
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-white bg-white/5 hover:bg-white/10 border border-white/5 shadow-sm"
                )}
              >
                {val === "DEL" ? <Delete className="h-6 w-6" /> : val === "OK" ? <CheckCircle2 className="h-7 w-7" /> : val}
              </Button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <Lock className="h-3 w-3" />
            Terminal POS Verrouillé
          </div>
        </div>
      </motion.div>
    </div>
  );
}