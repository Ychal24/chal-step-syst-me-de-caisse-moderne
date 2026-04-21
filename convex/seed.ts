import { mutation } from "./_generated/server";
export const initData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return "Already seeded";
    const defaultProducts = [
      // BURGERS
      { name: "Cheese Burger", emoji: "🍔", category: "Burgers", price: 850, stock: 50, minStockThreshold: 10 },
      { name: "Double Cheese", emoji: "🍔", category: "Burgers", price: 1150, stock: 40, minStockThreshold: 10 },
      { name: "Chicken Burger", emoji: "🍗", category: "Burgers", price: 950, stock: 45, minStockThreshold: 10 },
      { name: "Veggie Burger", emoji: "🥬", category: "Burgers", price: 850, stock: 30, minStockThreshold: 5 },
      // PIZZAS
      { name: "Margherita", emoji: "🍕", category: "Pizzas", price: 750, stock: 25, minStockThreshold: 5 },
      { name: "Regina", emoji: "🍕", category: "Pizzas", price: 950, stock: 20, minStockThreshold: 5 },
      { name: "4 Fromages", emoji: "🧀", category: "Pizzas", price: 1050, stock: 20, minStockThreshold: 5 },
      { name: "Végétarienne", emoji: "🥗", category: "Pizzas", price: 850, stock: 15, minStockThreshold: 5 },
      // TACOS
      { name: "Tacos Poulet", emoji: "🌮", category: "Tacos", price: 650, stock: 60, minStockThreshold: 15 },
      { name: "Tacos Boeuf", emoji: "🌮", category: "Tacos", price: 750, stock: 50, minStockThreshold: 15 },
      { name: "Tacos Mixte", emoji: "🌮", category: "Tacos", price: 850, stock: 40, minStockThreshold: 10 },
      // SUSHI
      { name: "Sushi Saumon", emoji: "🍣", category: "Sushi", price: 1250, stock: 30, minStockThreshold: 8 },
      { name: "Sushi Thon", emoji: "🍣", category: "Sushi", price: 1350, stock: 25, minStockThreshold: 8 },
      { name: "Maki Avocat", emoji: "🥑", category: "Sushi", price: 950, stock: 40, minStockThreshold: 10 },
      // PASTA
      { name: "Penne Pesto", emoji: "🍝", category: "Pâtes", price: 850, stock: 30, minStockThreshold: 5 },
      { name: "Spaghetti Bolo", emoji: "🍝", category: "Pâtes", price: 950, stock: 30, minStockThreshold: 5 },
      { name: "Lasagnes", emoji: "🥘", category: "Pâtes", price: 1100, stock: 20, minStockThreshold: 5 },
      // GRILLADES
      { name: "Brochettes Poulet", emoji: "🍢", category: "Grillades", price: 1200, stock: 50, minStockThreshold: 10 },
      { name: "Entrecôte", emoji: "🥩", category: "Grillades", price: 1800, stock: 20, minStockThreshold: 5 },
      { name: "Cotelettes", emoji: "🍖", category: "Grillades", price: 1500, stock: 25, minStockThreshold: 5 },
      // SOUPES
      { name: "Harira", emoji: "🥣", category: "Soupes", price: 350, stock: 100, minStockThreshold: 20 },
      { name: "Soupe Légumes", emoji: "🍲", category: "Soupes", price: 300, stock: 80, minStockThreshold: 15 },
      // SALADES
      { name: "Salade César", emoji: "🥗", category: "Salades", price: 750, stock: 40, minStockThreshold: 10 },
      { name: "Salade Niçoise", emoji: "🥗", category: "Salades", price: 650, stock: 35, minStockThreshold: 10 },
      // BOISSONS CHAUDES
      { name: "Expresso", emoji: "☕", category: "Caféteria", price: 180, stock: 500, minStockThreshold: 50 },
      { name: "Cappuccino", emoji: "☕", category: "Caféteria", price: 250, stock: 300, minStockThreshold: 30 },
      { name: "Thé à la Menthe", emoji: "🍵", category: "Caféteria", price: 150, stock: 1000, minStockThreshold: 50 },
      // BOISSONS FROIDES
      { name: "Coca-Cola", emoji: "🥤", category: "Sodas", price: 350, stock: 200, minStockThreshold: 50 },
      { name: "Sprite", emoji: "🥤", category: "Sodas", price: 350, stock: 150, minStockThreshold: 40 },
      { name: "Fanta", emoji: "🥤", category: "Sodas", price: 350, stock: 150, minStockThreshold: 40 },
      // JUS
      { name: "Jus d'Orange", emoji: "🍊", category: "Jus", price: 450, stock: 100, minStockThreshold: 20 },
      { name: "Jus d'Avocat", emoji: "🥑", category: "Jus", price: 550, stock: 80, minStockThreshold: 15 },
      { name: "Jus de Fraise", emoji: "🍓", category: "Jus", price: 500, stock: 80, minStockThreshold: 15 },
      // EAUX
      { name: "Eau 50cl", emoji: "💧", category: "Eaux", price: 200, stock: 500, minStockThreshold: 100 },
      { name: "Eau 1.5L", emoji: "💧", category: "Eaux", price: 400, stock: 300, minStockThreshold: 50 },
      { name: "Eau Gazeuse", emoji: "✨", category: "Eaux", price: 500, stock: 200, minStockThreshold: 40 },
      // VIENNOISERIES
      { name: "Croissant", emoji: "🥐", category: "Viennoiseries", price: 250, stock: 100, minStockThreshold: 20 },
      { name: "Pain Choco", emoji: "🥖", category: "Viennoiseries", price: 300, stock: 100, minStockThreshold: 20 },
      // DESSERTS
      { name: "Tiramisu", emoji: "🍰", category: "Desserts", price: 450, stock: 40, minStockThreshold: 10 },
      { name: "Cheesecake", emoji: "🍰", category: "Desserts", price: 500, stock: 30, minStockThreshold: 8 },
      { name: "Fondant Choco", emoji: "🍮", category: "Desserts", price: 400, stock: 35, minStockThreshold: 10 },
      // GLACES
      { name: "Glace Vanille", emoji: "🍦", category: "Glaces", price: 350, stock: 60, minStockThreshold: 15 },
      { name: "Sorbet Citron", emoji: "🍨", category: "Glaces", price: 350, stock: 50, minStockThreshold: 12 },
      // SNACKS
      { name: "Frites XL", emoji: "🍟", category: "Snacks", price: 400, stock: 200, minStockThreshold: 50 },
      { name: "Nuggets x9", emoji: "🍗", category: "Snacks", price: 650, stock: 100, minStockThreshold: 20 },
      // FRUITS
      { name: "Pomme", emoji: "🍎", category: "Fruits", price: 100, stock: 150, minStockThreshold: 30 },
      { name: "Banane", emoji: "🍌", category: "Fruits", price: 150, stock: 150, minStockThreshold: 30 },
      // LAITERIE
      { name: "Lait 1L", emoji: "🥛", category: "Laiterie", price: 700, stock: 200, minStockThreshold: 40 },
      { name: "Yaourt Nature", emoji: "🥣", category: "Laiterie", price: 250, stock: 300, minStockThreshold: 50 },
      // BOULANGERIE
      { name: "Baguette", emoji: "🥖", category: "Boulangerie", price: 150, stock: 300, minStockThreshold: 50 },
      { name: "Pain de Mie", emoji: "🍞", category: "Boulangerie", price: 600, stock: 100, minStockThreshold: 20 },
      // EPICERIE
      { name: "Riz 1kg", emoji: "🍚", category: "Épicerie", price: 1500, stock: 200, minStockThreshold: 40 },
      { name: "Pates 500g", emoji: "🍝", category: "Épicerie", price: 900, stock: 250, minStockThreshold: 50 },
      // CONSERVES
      { name: "Thon", emoji: "🐟", category: "Conserves", price: 1200, stock: 150, minStockThreshold: 30 },
      { name: "Sauce Tomate", emoji: "🥫", category: "Conserves", price: 800, stock: 150, minStockThreshold: 30 },
      // EPICES
      { name: "Poivre", emoji: "🧂", category: "Épices", price: 400, stock: 100, minStockThreshold: 20 },
      { name: "Sel", emoji: "🧂", category: "Épices", price: 200, stock: 200, minStockThreshold: 40 },
      // HYGIENE
      { name: "Savon", emoji: "🧼", category: "Hygiène", price: 500, stock: 200, minStockThreshold: 40 },
      { name: "Dentifrice", emoji: "🪥", category: "Hygiène", price: 1500, stock: 100, minStockThreshold: 20 },
      // ENTRETIEN
      { name: "Liquide Vaisselle", emoji: "🧴", category: "Entretien", price: 1800, stock: 100, minStockThreshold: 20 },
      { name: "Éponge", emoji: "🧽", category: "Entretien", price: 300, stock: 200, minStockThreshold: 40 },
      // PAPETERIE
      { name: "Cahier A4", emoji: "📓", category: "Papeterie", price: 1200, stock: 150, minStockThreshold: 30 },
      { name: "Stylo Bleu", emoji: "🖊️", category: "Papeterie", price: 200, stock: 500, minStockThreshold: 100 },
      // SERVICES
      { name: "Livraison", emoji: "🛵", category: "Services", price: 2500, stock: 9999, minStockThreshold: 0 },
      { name: "Emballage", emoji: "🛍️", category: "Services", price: 200, stock: 9999, minStockThreshold: 0 }
    ];
    // Duplicate some items to reach 100+
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
    return "Success";
  },
});