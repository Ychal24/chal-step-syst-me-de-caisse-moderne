import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { ProductCard } from "@/components/pos/ProductCard";
import { CartPanel } from "@/components/pos/CartPanel";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RefreshCcw, PackageSearch, Search, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Id } from "@convex/_generated/dataModel";
export function CaissePage() {
  const products = useQuery(api.pos.getProducts, {});
  const sellers = useQuery(api.pos.getSellers, { activeOnly: true });
  const initData = useMutation(api.seed.initData);
  const selectedSellerId = useCartStore(s => s.selectedSellerId);
  const setSellerId = useCartStore(s => s.setSellerId);
  const sessionSellerId = useAuthStore(s => s.sessionSellerId);
  const [activeTab, setActiveTab] = useState<string>("Tous");
  const [productSearch, setProductSearch] = useState<string>("");
  useEffect(() => {
    if (sessionSellerId && !selectedSellerId) {
      setSellerId(sessionSellerId);
    }
  }, [sessionSellerId, selectedSellerId, setSellerId]);
  const categories = useMemo(() => {
    if (!products) return ["Tous"];
    const unique = Array.from(new Set(products.map(p => p.category))).sort();
    return ["Tous", ...unique];
  }, [products]);
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      const matchesCat = activeTab === "Tous" || p.category === activeTab;
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, activeTab, productSearch]);
  const handleInit = async () => {
    try {
      await initData();
      toast.success("Données initialisées !");
    } catch (e) {
      toast.error("Erreur d'initialisation");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen max-h-screen overflow-hidden flex flex-col py-6 md:py-8 lg:py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-1 overflow-hidden min-h-0">
        <div className="md:col-span-8 flex flex-col h-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 shrink-0">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase">Ventes Directes</h1>
              <div className="flex items-center gap-2 mt-1">
                <UserCircle className="h-4 w-4 text-primary" />
                <Select value={selectedSellerId || ""} onValueChange={(v) => setSellerId(v as Id<"sellers">)}>
                  <SelectTrigger className="h-8 w-[180px] bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-muted-foreground">
                    <SelectValue placeholder="Choisir Vendeur" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {sellers?.map(s => (
                      <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Chercher produit..."
                  className="pl-9 h-11 bg-muted/50 border-none rounded-xl"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
              {products && products.length === 0 && (
                <Button onClick={handleInit} className="btn-gradient px-4 h-11 rounded-xl whitespace-nowrap">
                  <RefreshCcw className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Charger démo</span>
                </Button>
              )}
            </div>
          </div>
          <div className="mb-6 relative shrink-0">
             <ScrollArea className="w-full whitespace-nowrap bg-muted/50 p-1.5 rounded-2xl border">
                <div className="flex w-max gap-2 p-0.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        activeTab === cat
                          ? "bg-background text-primary shadow-soft"
                          : "text-muted-foreground hover:bg-background/50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
             </ScrollArea>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 pb-6">
            {!products ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-64 rounded-3xl border animate-pulse bg-muted" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-4 border-dashed rounded-[3rem] p-12 bg-secondary/20">
                <PackageSearch className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-2xl font-black tracking-tight uppercase opacity-50">Aucun produit</p>
                <p className="text-sm font-medium mt-2">Affinez votre recherche ou changez de catégorie.</p>
              </div>
            )}
          </div>
        </div>
        <div className="md:col-span-4 h-full min-h-0">
          <CartPanel />
        </div>
      </div>
    </div>
  );
}