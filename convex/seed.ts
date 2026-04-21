import { mutation } from "./_generated/server";
import { v } from "convex/values";
export const initData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return "Already seeded";
    const defaultProducts = [
      { name: "Burger Maison", emoji: "🍔", category: "Repas", price: 1250, stock: 50, minStockThreshold: 10 },
      { name: "Pizza Regina", emoji: "🍕", category: "Repas", price: 1400, stock: 30, minStockThreshold: 5 },
      { name: "Salade César", emoji: "🥗", category: "Repas", price: 950, stock: 20, minStockThreshold: 5 },
      { name: "Coca-Cola", emoji: "🥤", category: "Boissons", price: 350, stock: 100, minStockThreshold: 20 },
      { name: "Eau Minérale", emoji: "💧", category: "Boissons", price: 200, stock: 150, minStockThreshold: 30 },
      { name: "Café Expresso", emoji: "☕", category: "Boissons", price: 180, stock: 200, minStockThreshold: 10 },
      { name: "Muffin Choco", emoji: "🧁", category: "Desserts", price: 450, stock: 40, minStockThreshold: 8 },
      { name: "Glace Vanille", emoji: "🍦", category: "Desserts", price: 550, stock: 25, minStockThreshold: 5 },
      { name: "Cookie Géant", emoji: "🍪", category: "Desserts", price: 300, stock: 60, minStockThreshold: 15 },
      { name: "Frites", emoji: "🍟", category: "Snacks", price: 400, stock: 80, minStockThreshold: 20 },
      { name: "Nuggets (x6)", emoji: "🍗", category: "Snacks", price: 650, stock: 45, minStockThreshold: 10 },
      { name: "Nachos", emoji: "🌮", category: "Snacks", price: 700, stock: 30, minStockThreshold: 5 },
      { name: "Pasta Pesto", emoji: "🍝", category: "Repas", price: 1100, stock: 25, minStockThreshold: 5 },
      { name: "Hot Dog", emoji: "🌭", category: "Snacks", price: 550, stock: 40, minStockThreshold: 10 },
      { name: "Donut", emoji: "🍩", category: "Desserts", price: 250, stock: 50, minStockThreshold: 10 },
    ] as const;
    for (const p of defaultProducts) {
      await ctx.db.insert("products", p);
    }
    return "Success";
  },
});