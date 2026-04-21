import { mutation } from "./_generated/server";
export const initData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    const existingSellers = await ctx.db.query("sellers").first();
    if (!existingSellers) {
      const sellers = ["Amine", "Sara", "Youssef", "Fatima", "Hassan"];
      for (const name of sellers) {
        await ctx.db.insert("sellers", { name, active: true });
      }
    }
    if (existing) return "Sellers seeded (products already present)";
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
    const fullCatalogue = [...defaultProducts];
    for(let i=0; i < 40; i++) {
        fullCatalogue.push({
            ...defaultProducts[i % defaultProducts.length],
            name: `${defaultProducts[i % defaultProducts.length].name} v${i}`,
            stock: 20 + i
        });
    }
    for (const p of fullCatalogue) {
      await ctx.db.insert("products", p);
    }
    return "Full seed successful";
  },
});