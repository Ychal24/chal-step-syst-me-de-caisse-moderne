import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const applicationTables = {
  products: defineTable({
    name: v.string(),
    emoji: v.string(),
    category: v.string(),
    price: v.number(), // En centimes
    stock: v.number(),
    minStockThreshold: v.number(),
  }).index("by_category", ["category"]),
  sellers: defineTable({
    name: v.string(),
    active: v.boolean(),
    pin: v.string(), // Code PIN à 4 chiffres
  }).index("by_active", ["active"]).index("by_pin", ["pin"]),
  transactions: defineTable({
    total: v.number(), // En centimes
    method: v.union(v.literal("Espèces"), v.literal("Carte")),
    sellerId: v.id("sellers"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        quantity: v.number(),
        priceAtSale: v.number(),
      })
    ),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]).index("by_sellerId", ["sellerId"]),
  stock_adjustments: defineTable({
    productId: v.id("products"),
    quantity: v.number(), // positif pour ajout, négatif pour retrait
    reason: v.string(),
    timestamp: v.number(),
  }).index("by_productId", ["productId"]),
  settings: defineTable({
    key: v.string(), // e.g., "admin_config"
    adminPin: v.string(),
  }).index("by_key", ["key"]),
  files: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    description: v.optional(v.string()),
    uploadedAt: v.number(),
  })
    .index("by_userId_uploadedAt", ["userId", "uploadedAt"])
    .index("by_userId_storageId", ["userId", "storageId"]),
};
export default defineSchema({
  ...authTables,
  ...applicationTables,
});