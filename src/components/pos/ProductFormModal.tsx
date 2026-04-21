import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { Doc } from "@convex/_generated/dataModel";
const CATEGORIES = ["Repas", "Boissons", "Desserts", "Snacks"] as const;
const formSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  emoji: z.string().min(1, "Emoji requis"),
  category: z.enum(CATEGORIES),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Format de prix invalide"),
  stock: z.number().min(0, "Le stock ne peut être négatif"),
  minStockThreshold: z.number().min(0, "Le seuil ne peut être négatif"),
});
interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Doc<"products"> | null;
}
export function ProductFormModal({ open, onOpenChange, product }: ProductFormModalProps) {
  const createProduct = useMutation(api.pos.createProduct);
  const updateProduct = useMutation(api.pos.updateProduct);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      emoji: "🍔",
      category: "Repas",
      price: "0.00",
      stock: 0,
      minStockThreshold: 5,
    },
  });
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        emoji: product.emoji,
        category: product.category,
        price: (product.price / 100).toFixed(2),
        stock: product.stock,
        minStockThreshold: product.minStockThreshold,
      });
    } else {
      form.reset({
        name: "",
        emoji: "🍔",
        category: "Repas",
        price: "0.00",
        stock: 0,
        minStockThreshold: 5,
      });
    }
  }, [product, form]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      price: Math.round(parseFloat(values.price) * 100),
    };
    try {
      if (product) {
        await updateProduct({ id: product._id, updates: data });
        toast.success("Produit mis à jour !");
      } else {
        await createProduct(data);
        toast.success("Produit créé !");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            {product ? "Modifier le produit" : "Ajouter un produit"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Désignation</FormLabel>
                    <FormControl>
                      <Input placeholder="Burger Maison" {...field} className="rounded-xl h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emoji</FormLabel>
                    <FormControl>
                      <Input placeholder="🍔" {...field} className="rounded-xl h-12 text-center text-2xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl h-12">
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Prix Vente (DH)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="12.50" {...field} className="rounded-xl h-12 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Initial</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        className="rounded-xl h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seuil d'Alerte</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        className="rounded-xl h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-4 flex gap-3">
              <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1 h-12 rounded-xl btn-gradient">
                {product ? "Enregistrer" : "Créer le produit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}