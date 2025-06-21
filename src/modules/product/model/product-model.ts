import { ProductStatus } from "./product-enum";
import { z } from "zod";

export const modelName = "products";

export const ProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    images: z.array(z.string().url()).optional().nullable(), // JSON array of image URLs
    colors: z.string().optional().nullable(),
    price: z.number().min(0, { message: "Price must be greater than 0" }),
    salePrice: z.number().min(0).optional().nullable(),
    quantity: z.number().int().min(0, { message: "Quantity must be non-negative" }),
    content: z.string().optional().nullable(), // Long text content
    description: z.string().optional().nullable(),
    rating: z.number().min(0).max(5).optional().nullable(),
    saleCount: z.number().int().min(0).optional().nullable(),
    brandId: z.string().uuid().optional().nullable(),
    categoryId: z.string().uuid(),
    status: z.nativeEnum(ProductStatus).default(ProductStatus.ACTIVE),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type Product = z.infer<typeof ProductSchema>;