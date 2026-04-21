import React, { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Trash2, Plus, Minus, CreditCard, Banknote, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
export function CartPanel() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const checkout = useMutation(api.pos.checkout);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const handleCheckout = async (method: "Espèces" | "Carte") => {
    setIsProcessing(true);
    try {
      await checkout({
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        method,
        total
      });
      toast.success("Vente réussie !");
      clearCart();
      setIsCheckoutOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors du paiement");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <Card className="h-full flex flex-col border-none shadow-2xl rounded-4xl bg-secondary/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl font-black">
          <ShoppingCart className="h-6 w-6 text-primary" />
          Panier
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p className="font-medium text-lg">Le panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-4 bg-background p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <div>
                      <p className="font-bold text-sm leading-tight">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} / u</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-muted rounded-full p-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.productId, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.productId, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.productId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col gap-4 p-6 bg-background border-t rounded-b-4xl">
        <div className="flex justify-between w-full text-lg">
          <span className="text-muted-foreground font-medium">Total</span>
          <span className="text-3xl font-black tracking-tight text-primary">{formatCurrency(total)}</span>
        </div>
        <Button 
          className="w-full h-16 text-xl font-bold rounded-2xl btn-gradient shadow-glow" 
          disabled={items.length === 0}
          onClick={() => setIsCheckoutOpen(true)}
        >
          Encaisser
        </Button>
      </CardFooter>
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-2xl font-black mb-2">Choisir le paiement</DialogTitle>
            <p className="text-muted-foreground">Total à régler : <span className="text-primary font-bold">{formatCurrency(total)}</span></p>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-8">
            <Button 
              variant="outline" 
              className="h-32 flex flex-col gap-3 rounded-3xl border-2 hover:border-primary hover:bg-primary/5 transition-all"
              onClick={() => handleCheckout("Espèces")}
              disabled={isProcessing}
            >
              <Banknote className="h-10 w-10 text-emerald-500" />
              <span className="font-bold text-lg">Espèces</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-32 flex flex-col gap-3 rounded-3xl border-2 hover:border-primary hover:bg-primary/5 transition-all"
              onClick={() => handleCheckout("Carte")}
              disabled={isProcessing}
            >
              <CreditCard className="h-10 w-10 text-indigo-500" />
              <span className="font-bold text-lg">Carte</span>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="w-full py-6 text-muted-foreground" onClick={() => setIsCheckoutOpen(false)}>Annuler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}