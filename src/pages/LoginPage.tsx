import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Delete, XCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
export function LoginPage() {
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const verifyPin = useMutation(api.pos.verifyPin);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const handlePress = (val: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + val);
      setIsError(false);
    }
  };
  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setIsError(false);
  };
  const handleClear = () => {
    setPin("");
    setIsError(false);
  };
  const handleSubmit = async () => {
    if (pin.length < 4) return;
    try {
      const result = await verifyPin({ pin });
      if (result) {
        login(result.role, result.sellerId);
        toast.success(`Bienvenue ${result.role === 'admin' ? 'Administrateur' : 'Vendeur'}`);
        navigate("/");
      } else {
        setIsError(true);
        setPin("");
        toast.error("Code PIN incorrect");
      }
    } catch (e) {
      toast.error("Erreur de connexion");
    }
  };
  React.useEffect(() => {
    if (pin.length === 4) {
      handleSubmit();
    }
  }, [pin]);
  const numpad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "DEL"];
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-20 w-20 bg-primary rounded-3xl flex items-center justify-center shadow-primary shadow-2xl">
            <UtensilsCrossed className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Chal Step</h1>
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Accès Sécurisé POS</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-8">
          <div className="flex justify-center gap-4">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={isError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all duration-200",
                  i < pin.length 
                    ? "bg-primary border-primary scale-125" 
                    : "border-white/20 bg-transparent",
                  isError && "border-rose-500 bg-rose-500"
                )}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {numpad.map((val) => (
              <Button
                key={val}
                variant="ghost"
                onClick={() => {
                  if (val === "C") handleClear();
                  else if (val === "DEL") handleDelete();
                  else handlePress(val);
                }}
                className={cn(
                  "h-20 rounded-2xl text-2xl font-black transition-all active:scale-90",
                  val === "C" || val === "DEL" 
                    ? "text-slate-400 hover:text-white" 
                    : "text-white bg-white/5 hover:bg-white/10 border border-white/5 shadow-sm"
                )}
              >
                {val === "DEL" ? <Delete className="h-6 w-6" /> : val}
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