import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  transaction: {
    items: Array<{ name: string; quantity: number; priceAtSale: number }>;
    total: number;
    method: string;
    timestamp: number;
  } | null;
}
export function ReceiptModal({ open, onClose, transaction }: ReceiptModalProps) {
  if (!transaction) return null;
  const handlePrint = () => {
    window.print();
  };
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md bg-white text-black p-0 overflow-hidden rounded-3xl border-none">
        <div id="receipt-content" className="p-8 print:p-4">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 print:hidden">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Chal Step POS</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Reçu de Vente Officiel</p>
          </div>
          <div className="space-y-1 text-xs mb-6 border-b border-dashed pb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date :</span>
              <span className="font-bold">{formatDate(transaction.timestamp)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paiement :</span>
              <span className="font-bold uppercase">{transaction.method}</span>
            </div>
          </div>
          <div className="space-y-3 mb-8">
            {transaction.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} x {formatCurrency(item.priceAtSale)}
                  </p>
                </div>
                <span className="font-bold">{formatCurrency(item.quantity * item.priceAtSale)}</span>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-black pt-4 mb-8">
            <div className="flex justify-between items-end">
              <span className="text-lg font-black uppercase">Total</span>
              <span className="text-3xl font-black tracking-tighter">{formatCurrency(transaction.total)}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Merci de votre visite !
            </p>
          </div>
        </div>
        <DialogFooter className="p-6 bg-muted/50 gap-2 sm:gap-0 print:hidden">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
            <X className="h-4 w-4 mr-2" /> Fermer
          </Button>
          <Button className="flex-1 rounded-xl btn-gradient" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}