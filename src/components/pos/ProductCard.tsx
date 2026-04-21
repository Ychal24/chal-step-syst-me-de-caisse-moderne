import React from "react";
import { Doc } from "@convex/_generated/dataModel";
import { useCartStore } from "@/store/useCartStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
interface ProductCardProps {
  product: Doc<"products">;
}
export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isOutOfStock = product.stock <= 0;
  return (
    <motion.div
      whileHover={!isOutOfStock ? { scale: 1.02, y: -4 } : {}}
      whileTap={!isOutOfStock ? { scale: 0.94 } : {}}
      className="h-full"
    >
      <Card
        onClick={() => !isOutOfStock && addItem(product)}
        className={cn(
          "h-full cursor-pointer transition-all border-2 select-none",
          isOutOfStock 
            ? "opacity-50 grayscale cursor-not-allowed bg-muted/50 border-transparent" 
            : "hover:shadow-xl hover:border-primary/20 active:bg-accent/50"
        )}
      >
        <CardContent className="p-5 flex flex-col items-center text-center gap-3">
          <span className="text-5xl mb-2">{product.emoji}</span>
          <h3 className="font-bold text-lg line-clamp-1 text-foreground">{product.name}</h3>
          <p className="text-2xl font-black text-primary">
            {formatCurrency(product.price)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="destructive">Rupture</Badge>
            ) : (
              <Badge
                variant="outline"
                className={cn(
                  "font-bold",
                  product.stock <= product.minStockThreshold 
                    ? "bg-amber-500 text-white border-amber-600" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                )}
              >
                Stock: {product.stock}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}