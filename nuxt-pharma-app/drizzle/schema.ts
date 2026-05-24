import { pgTable, serial, text, varchar, integer, real, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

export const customers = pgTable('customers', {
  id: varchar('id', { length: 50 }).primaryKey(),
  alias: text('alias').notNull(),
  ageGroup: text('age_group').notNull(),
  gender: text('gender').notNull(),
  healthConditions: jsonb('health_conditions').notNull(), // jsonb array of strings
  totalOrders: integer('total_orders').notNull(),
  totalSpent: integer('total_spent').notNull(),
  lastOrder: text('last_order').notNull(),
  preferredPayment: text('preferred_payment').notNull(),
  preferredCategories: jsonb('preferred_categories').notNull(), // jsonb array of strings
});

export const products = pgTable('products', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  category: text('category').notNull(),
  type: text('type').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull(),
  unit: text('unit').notNull(),
  expiryDate: text('expiry_date').notNull(),
  description: text('description').notNull(),
  usage: text('usage').notNull(),
  warning: text('warning').notNull(),
  related: jsonb('related').notNull(), // jsonb array of strings
  rating: real('rating').notNull(),
  sold: integer('sold').notNull(),
});

export const orders = pgTable('orders', {
  id: varchar('id', { length: 50 }).primaryKey(),
  customerId: varchar('customer_id', { length: 50 }).references(() => customers.id),
  date: text('date').notNull(),
  status: text('status').notNull(),
  paymentMethod: text('payment_method').notNull(),
  items: jsonb('items').notNull(), // jsonb array of objects: { product_id: string, qty: number, price: number }
  total: integer('total').notNull(),
  shippingFee: integer('shipping_fee').notNull(),
});

export const symptomsFaq = pgTable('symptoms_faq', {
  id: varchar('id', { length: 50 }).primaryKey(),
  symptom: text('symptom').notNull(),
  keywords: jsonb('keywords').notNull(), // jsonb array of strings
  description: text('description').notNull(),
  relatedCategories: jsonb('related_categories').notNull(), // jsonb array of strings
  relatedProducts: jsonb('related_products').notNull(), // jsonb array of strings
  advice: text('advice').notNull(),
  disclaimer: text('disclaimer').notNull(),
});
