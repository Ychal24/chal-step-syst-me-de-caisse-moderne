import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import { Plus, Minus, Search, PackageSearch } from "lucide-react";
import { toast } from "sonner";
export function StockPage() {
  const products = useQuery(api.pos.getProducts);
  const adjustStock = useMutation(api.pos.adjustStock);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustValue, setAdjustValue] = useState("1");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const filtered = products?.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ?? [];
  const handleAdjust = async (isAdding: boolean) => {
    if (!selectedProduct) return;
    const qty = parseInt(adjustValue);
    if (isNaN(qty)) return toast.error("Quantité invalide");
    try {
      await adjustStock({
        productId: selectedProduct._id,
        quantity: isAdding ? qty : -qty,
        reason: "Réapprovisionnement manuel"
      });
      toast.success("Stock mis à jour !");
      setIsDialogOpen(false);
      setAdjustValue("1");
    } catch (e) {
      toast.error("Erreur de mise à jour");
    }
  };
  if (!products) return <div className="p-8">Chargement...</div>;
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-black tracking-tight">Inventaire</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un produit..." 
            className="pl-10 h-11 bg-secondary border-none rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-card border-2 rounded-3xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16 text-center font-bold">Icon</TableHead>
              <TableHead className="font-bold">Désignation</TableHead>
              <TableHead className="font-bold">Catégorie</TableHead>
              <TableHead className="font-bold text-right">Prix</TableHead>
              <TableHead className="font-bold text-center">Stock Actuel</TableHead>
              <TableHead className="font-bold text-center">État</TableHead>
              <TableHead className="font-bold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => {
              const status = product.stock === 0 ? "Rupture" : product.stock <= product.minStockThreshold ? "Faible" : "OK";
              return (
                <TableRow key={product._id} className="group hover:bg-muted/30 h-16">
                  <TableCell className="text-3xl text-center">{product.emoji}</TableCell>
                  <TableCell className="font-bold">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-background">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-center font-bold text-lg">{product.stock}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "font-semibold",
                      status === "Rupture" ? "bg-rose-500 text-white" : 
                      status === "Faible" ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                    )}>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg font-bold"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsDialogOpen(true);
                      }}
                    >
                      Ajuster
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <PackageSearch className="h-12 w-12 mb-4" />
            <p className="text-lg">Aucun produit trouvé</p>
          </div>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">{selectedProduct?.emoji}</span>
              Ajuster {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="qty">Quantité à ajouter/retirer</Label>
              <Input 
                id="qty" 
                type="number" 
                value={adjustValue} 
                onChange={(e) => setAdjustValue(e.target.value)}
                className="h-12 text-lg font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" className="h-12 border-rose-500 text-rose-500 hover:bg-rose-50" onClick={() => handleAdjust(false)}>
                <Minus className="mr-2 h-4 w-4" /> Retirer
              </Button>
              <Button className="h-12 bg-emerald-500 hover:bg-emerald-600" onClick={() => handleAdjust(true)}>
                <Plus className="mr-2 h-4 w-4" /> Ajouter
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}