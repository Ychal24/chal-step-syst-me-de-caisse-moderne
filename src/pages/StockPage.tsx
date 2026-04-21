import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/format";
import { Plus, Minus, Search, PackageSearch, MoreVertical, Download, FilePlus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductFormModal } from "@/components/pos/ProductFormModal";
import { cn } from "@/lib/utils";
export function StockPage() {
  const products = useQuery(api.pos.getProducts);
  const adjustStock = useMutation(api.pos.adjustStock);
  const deleteProduct = useMutation(api.pos.deleteProduct);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustValue, setAdjustValue] = useState("1");
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
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
      setIsAdjustOpen(false);
      setAdjustValue("1");
    } catch (e) {
      toast.error("Erreur de mise à jour");
    }
  };
  const handleDelete = async (id: any) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await deleteProduct({ id });
      toast.success("Produit supprimé");
    } catch (e) {
      toast.error("Impossible de supprimer le produit");
    }
  };
  const exportToCSV = () => {
    if (!products) return;
    const headers = ["Emoji", "Nom", "Categorie", "Prix (DH)", "Stock", "Seuil"];
    const rows = products.map(p => [
      p.emoji,
      p.name,
      p.category,
      (p.price / 100).toFixed(2),
      p.stock,
      p.minStockThreshold
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventaire_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (!products) return <div className="max-w-7xl mx-auto px-4 py-12">Chargement...</div>;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Inventaire</h1>
          <p className="text-muted-foreground mt-1">Gérez vos produits et surveillez vos niveaux de stock.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={exportToCSV} className="rounded-xl h-11 px-6">
            <Download className="mr-2 h-4 w-4" /> Exporter CSV
          </Button>
          <Button onClick={() => { setEditProduct(null); setIsFormOpen(true); }} className="rounded-xl h-11 px-6 btn-gradient">
            <FilePlus className="mr-2 h-4 w-4" /> Nouveau Produit
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom..." 
            className="pl-10 h-12 bg-secondary/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-card border shadow-soft rounded-3xl overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent h-14">
              <TableHead className="w-20 text-center font-bold">Visuel</TableHead>
              <TableHead className="font-bold">Produit</TableHead>
              <TableHead className="font-bold">Catégorie</TableHead>
              <TableHead className="font-bold text-right">Prix</TableHead>
              <TableHead className="font-bold text-center">Stock</TableHead>
              <TableHead className="font-bold text-center">État</TableHead>
              <TableHead className="w-20 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => {
              const status = product.stock === 0 ? "Rupture" : product.stock <= product.minStockThreshold ? "Faible" : "Normal";
              return (
                <TableRow key={product._id} className="group hover:bg-muted/30 h-16 border-b transition-colors">
                  <TableCell className="text-3xl text-center select-none">{product.emoji}</TableCell>
                  <TableCell className="font-bold text-foreground">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium bg-secondary text-secondary-foreground">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-primary">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-center font-black text-lg">{product.stock}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "font-bold uppercase text-[10px] tracking-widest px-2",
                      status === "Rupture" ? "bg-rose-500 text-white" : 
                      status === "Faible" ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                    )}>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-accent">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl w-48 shadow-lg">
                        <DropdownMenuItem onClick={() => { setSelectedProduct(product); setIsAdjustOpen(true); }} className="p-3 gap-2">
                          <Plus className="h-4 w-4 text-emerald-500" /> Ajuster Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditProduct(product); setIsFormOpen(true); }} className="p-3 gap-2">
                          <Edit className="h-4 w-4 text-indigo-500" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(product._id)} className="p-3 gap-2 text-rose-500 focus:bg-rose-50">
                          <Trash2 className="h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <PackageSearch className="h-16 w-16 mb-4" />
            <p className="text-xl font-medium tracking-tight">Aucun produit trouvé</p>
          </div>
        )}
      </div>
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent className="rounded-3xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2">
              <span className="text-2xl">{selectedProduct?.emoji}</span>
              Stock : {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="qty" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Quantité d'ajustement</Label>
              <Input 
                id="qty" 
                type="number" 
                value={adjustValue} 
                onChange={(e) => setAdjustValue(e.target.value)}
                className="h-14 text-2xl font-black text-center rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button variant="outline" className="h-14 border-rose-500 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl" onClick={() => handleAdjust(false)}>
                <Minus className="mr-2 h-4 w-4" /> Retirer
              </Button>
              <Button className="h-14 bg-emerald-500 hover:bg-emerald-600 font-bold text-white rounded-2xl" onClick={() => handleAdjust(true)}>
                <Plus className="mr-2 h-4 w-4" /> Ajouter
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="w-full h-12" onClick={() => setIsAdjustOpen(false)}>Annuler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ProductFormModal open={isFormOpen} onOpenChange={setIsFormOpen} product={editProduct} />
    </div>
  );
}