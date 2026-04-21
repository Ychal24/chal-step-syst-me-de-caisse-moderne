import { mutation } from "./_generated/server";
export const initData = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Manage Admin Settings (admin_config)
    // Updated PIN to '2026' for Phase 14 specifications
    const adminSettings = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "admin_config"))
      .unique();
    if (!adminSettings) {
      await ctx.db.insert("settings", { key: "admin_config", adminPin: "2026" });
    } else if (adminSettings.adminPin !== "2026") {
      await ctx.db.patch(adminSettings._id, { adminPin: "2026" });
    }
    // 2. Manage Sellers
    const existingSellers = await ctx.db.query("sellers").collect();
    if (existingSellers.length === 0) {
      // Create default sellers with empty PINs for quick demo access
      const sellers = [
        { name: "Amine", pin: "" },
        { name: "Sara", pin: "" },
        { name: "Youssef", pin: "" },
        { name: "Fatima", pin: "" },
        { name: "Hassan", pin: "" }
      ];
      for (const s of sellers) {
        await ctx.db.insert("sellers", { name: s.name, active: true, pin: s.pin });
      }
    } else {
      // Patch existing sellers to "" for standardization
      for (const s of existingSellers) {
        if (s.pin !== "") {
          await ctx.db.patch(s._id, { pin: "" });
        }
      }
    }
    // 3. Manage Products
    const existingProducts = await ctx.db.query("products").first();
    if (!existingProducts) {
      const defaultProducts = [
        { name: "Cheese Burger", emoji: "🍔", category: "Burgers", price: 850, stock: 50, minStockThreshold: 10 },
        { name: "Double Cheese", emoji: "🍔", category: "Burgers", price: 1150, stock: 40, minStockThreshold: 10 },
        { name: "Chicken Burger", emoji: "🍗", category: "Burgers", price: 950, stock: 45, minStockThreshold: 10 },
        { name: "Veggie Burger", emoji: "🥬", category: "Burgers", price: 850, stock: 30, minStockThreshold: 5 },
        { name: "Margherita", emoji: "🍕", category: "Pizzas", price: 750, stock: 25, minStockThreshold: 5 },
        { name: "Regina", emoji: "🍕", category: "Pizzas", price: 950, stock: 20, minStockThreshold: 5 },
        { name: "Expresso", emoji: "☕", category: "Caféteria", price: 180, stock: 500, minStockThreshold: 50 },
        { name: "Coca-Cola", emoji: "🥤", category: "Sodas", price: 350, stock: 200, minStockThreshold: 50 },
        { name: "Jus d'Orange", emoji: "🍊", category: "Jus", price: 450, stock: 100, minStockThreshold: 20 },
        { name: "Eau 50cl", emoji: "💧", category: "Eaux", price: 200, stock: 500, minStockThreshold: 100 },
        { name: "Tiramisu", emoji: "🍰", category: "Desserts", price: 450, stock: 40, minStockThreshold: 10 },
        { name: "Frites XL", emoji: "🍟", category: "Snacks", price: 400, stock: 200, minStockThreshold: 50 }
      ];
      for (const p of defaultProducts) {
        await ctx.db.insert("products", p);
      }
    }
    return "Security standardization and seed successful";
  },
});