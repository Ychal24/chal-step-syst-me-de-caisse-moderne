import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});
export const createProduct = mutation({
  args: {
    name: v.string(),
    emoji: v.string(),
    category: v.string(),
    price: v.number(), // En centimes
    stock: v.number(),
    minStockThreshold: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    updates: v.object({
      name: v.optional(v.string()),
      emoji: v.optional(v.string()),
      category: v.optional(v.string()),
      price: v.optional(v.number()),
      stock: v.optional(v.number()),
      minStockThreshold: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
export const checkout = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      })
    ),
    method: v.union(v.literal("Espèces"), v.literal("Carte")),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    const saleItems = [];
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product) throw new Error(`Produit ${item.productId} non trouvé`);
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuffisant pour ${product.name}`);
      }
      await ctx.db.patch(item.productId, {
        stock: product.stock - item.quantity,
      });
      await ctx.db.insert("stock_adjustments", {
        productId: item.productId,
        quantity: -item.quantity,
        reason: "Vente",
        timestamp: Date.now(),
      });
      saleItems.push({
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        priceAtSale: product.price,
      });
    }
    const transactionId = await ctx.db.insert("transactions", {
      total: args.total,
      method: args.method,
      items: saleItems,
      timestamp: Date.now(),
    });
    return {
      transactionId,
      items: saleItems,
      method: args.method,
      total: args.total,
      timestamp: Date.now()
    };
  },
});
export const adjustStock = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Produit non trouvé");
    await ctx.db.patch(args.productId, {
      stock: Math.max(0, product.stock + args.quantity),
    });
    await ctx.db.insert("stock_adjustments", {
      productId: args.productId,
      quantity: args.quantity,
      reason: args.reason,
      timestamp: Date.now(),
    });
  },
});
export const getTransactions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .order("desc")
      .take(args.limit ?? 50);
  },
});
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", startOfDay))
      .collect();
    const revenue = todayTransactions.reduce((acc, t) => acc + t.total, 0);
    const count = todayTransactions.length;
    const allRecent = await ctx.db.query("transactions").order("desc").take(100);
    const productCounts: Record<string, { name: string; qty: number }> = {};
    allRecent.forEach(t => {
      t.items.forEach(item => {
        if (!productCounts[item.productId]) {
          productCounts[item.productId] = { name: item.name, qty: 0 };
        }
        productCounts[item.productId].qty += item.quantity;
      });
    });
    const topProducts = Object.values(productCounts)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
    return {
      dailyRevenue: revenue,
      dailyTransactions: count,
      topProducts,
    };
  },
});