import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/pos/ProductCard";
import { CartPanel } from "@/components/pos/CartPanel";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCcw } from "lucide-react";
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
  if (products === undefined) return <div className="flex items-center justify-center h-96">Chargement...</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[calc(100vh-10rem)] overflow-hidden">
      <div className="md:col-span-8 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-black text-foreground tracking-tight">Ventes</h1>
          {products.length === 0 && (
            <Button onClick={handleInit} className="btn-gradient">
              <RefreshCcw className="mr-2 h-4 w-4" /> Initialiser le Stock
            </Button>
          )}
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-4 w-full mb-6 h-12 bg-muted p-1">
            {CATEGORIES.map(cat => (
              <TabsTrigger key={cat} value={cat} className="text-sm font-semibold uppercase tracking-wider">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={activeTab} className="flex-1 overflow-y-auto pr-2">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-3xl p-12">
                <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-xl font-medium">Aucun produit dans cette catégorie</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="md:col-span-4 h-full">
        <CartPanel />
      </div>
    </div>
  );
}