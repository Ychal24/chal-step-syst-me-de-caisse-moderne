import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/pos/ProductCard";
import { CartPanel } from "@/components/pos/CartPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, RefreshCcw, PackageSearch } from "lucide-react";
import { toast } from "sonner";
const CATEGORIES = ["Repas", "Boissons", "Desserts", "Snacks"] as const;
export function CaissePage() {
  const products = useQuery(api.pos.getProducts);
  const initData = useMutation(api.seed.initData);
  const [activeTab, setActiveTab] = useState<string>("Repas");
  const filteredProducts = products?.filter(p => p.category === activeTab) ?? [];
  const handleInit = async () => {
    try {
      await initData();
      toast.success("Données initialisées !");
    } catch (e) {
      toast.error("Erreur d'initialisation");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 h-screen overflow-hidden flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-1 overflow-hidden">
        <div className="md:col-span-8 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase">Ventes Directes</h1>
              <p className="text-muted-foreground font-medium mt-1">Gérez vos encaissements rapidement.</p>
            </div>
            {products && products.length === 0 && (
              <Button onClick={handleInit} className="btn-gradient px-6 rounded-xl">
                <RefreshCcw className="mr-2 h-4 w-4" /> Charger le menu démo
              </Button>
            )}
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-4 w-full mb-8 h-14 bg-muted/50 p-1.5 rounded-2xl">
              {CATEGORIES.map(cat => (
                <TabsTrigger 
                  key={cat} 
                  value={cat} 
                  className="text-sm font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-soft rounded-xl transition-all"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab} className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {!products ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-64 rounded-3xl border animate-pulse bg-muted" />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60%] text-muted-foreground border-4 border-dashed rounded-[3rem] p-12 bg-secondary/20">
                  <PackageSearch className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-2xl font-black tracking-tight uppercase opacity-50">Aucun produit trouvé</p>
                  <p className="text-sm font-medium mt-2">Essayez une autre catégorie ou créez-en un dans le stock.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <div className="md:col-span-4 h-full pb-8 md:pb-0">
          <CartPanel />
        </div>
      </div>
    </div>
  );
}