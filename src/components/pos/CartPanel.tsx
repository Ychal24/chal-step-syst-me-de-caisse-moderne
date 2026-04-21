import React, { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, CreditCard, Banknote, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ReceiptModal } from "./ReceiptModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
export function CartPanel() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const checkout = useMutation(api.pos.checkout);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalArticles = items.reduce((acc, i) => acc + i.quantity, 0);
  const handleCheckout = async (method: "Espèces" | "Carte") => {
    setIsProcessing(true);
    try {
      const result = await checkout({
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        method,
        total
      });
      setLastTransaction(result);
      toast.success("Vente réussie !");
      clearCart();
      setIsCheckoutOpen(false);
      setIsReceiptOpen(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors du paiement");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <Card className="h-full flex flex-col border-none shadow-glass-lg rounded-4xl bg-secondary/30 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4 border-b bg-background/50 shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-black">
            <ShoppingCart className="h-7 w-7 text-primary" />
            Panier
          </div>
          <Badge variant="outline" className="bg-primary text-primary-foreground border-none px-3 h-8 text-sm font-black">
            {totalArticles} {totalArticles > 1 ? 'articles' : 'article'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 relative min-h-0 bg-transparent">
        <ScrollArea className="h-full">
          <div className="px-6">
            <AnimatePresence initial={false}>
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-muted-foreground opacity-50"
                >
                  <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="h-10 w-10" />
                  </div>
                  <p className="font-bold text-lg">Prêt pour une vente ?</p>
                  <p className="text-sm">Sélectionnez des articles à gauche</p>
                </motion.div>
              ) : (
                <div className="space-y-3 py-6">
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.productId}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: 20 }}
                      className="flex items-center justify-between gap-4 bg-background p-4 rounded-2xl shadow-soft group hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl select-none">{item.emoji}</span>
                        <div className="max-w-[120px] overflow-hidden">
                          <p className="font-black text-sm leading-tight truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{formatCurrency(item.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-secondary rounded-xl p-1 border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg hover:bg-background"
                            onClick={() => updateQuantity(item.productId, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg hover:bg-background"
                            onClick={() => updateQuantity(item.productId, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col gap-4 p-8 bg-background border-t shadow-[0_-10px_20px_rgba(0,0,0,0.02)] shrink-0">
        <div className="flex justify-between w-full items-end pb-2">
          <div className="flex flex-col">
            <span className="text-xs uppercase font-black tracking-widest text-muted-foreground">À percevoir</span>
            <span className="text-4xl font-black tracking-tighter text-foreground">{formatCurrency(total)}</span>
          </div>
          {total > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCart} 
              className="text-rose-500 hover:bg-rose-50 rounded-lg h-10 px-4 font-bold uppercase text-[10px] tracking-widest"
            >
              Vider
            </Button>
          )}
        </div>
        <Button
          className="w-full h-18 text-2xl font-black rounded-2xl btn-gradient shadow-primary active:scale-[0.98] transition-transform disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          disabled={items.length === 0}
          onClick={() => setIsCheckoutOpen(true)}
        >
          {items.length === 0 ? "Panier Vide" : `Payer ${formatCurrency(total)}`}
        </Button>
      </CardFooter>
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl">
          <DialogHeader className="items-center text-center pb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Banknote className="h-10 w-10 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-black mb-1">Moyen de Paiement</DialogTitle>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
              Somme à régler : <span className="text-primary font-black ml-1 text-lg">{formatCurrency(total)}</span>
            </p>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-8">
            <Button
              variant="outline"
              className="h-36 flex flex-col gap-4 rounded-3xl border-2 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
              onClick={() => handleCheckout("Espèces")}
              disabled={isProcessing}
            >
              <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Banknote className="h-8 w-8 text-emerald-600" />
              </div>
              <span className="font-black text-lg tracking-tight">ESPECES</span>
            </Button>
            <Button
              variant="outline"
              className="h-36 flex flex-col gap-4 rounded-3xl border-2 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
              onClick={() => handleCheckout("Carte")}
              disabled={isProcessing}
            >
              <div className="h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="h-8 w-8 text-indigo-600" />
              </div>
              <span className="font-black text-lg tracking-tight">CARTE</span>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="w-full py-6 text-muted-foreground font-bold" onClick={() => setIsCheckoutOpen(false)}>Annuler la transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ReceiptModal open={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} transaction={lastTransaction} />
    </Card>
  );
}