import { ProductStatus } from "./product-enum";
import { z } from "zod";

export const ProductCreateDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    images: z.array(z.string().url()).optional().nullable(),
    colors: z.string().optional().nullable(),
    price: z.number().min(0, { message: "Price must be greater than 0" }),
    salePrice: z.number().min(0).optional().nullable(),
    quantity: z.number().int().min(0, { message: "Quantity must be non-negative" }),
    content: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    brandId: z.string().uuid().optional().nullable(),
    categoryId: z.string().uuid()
});

export type ProductCreateDTO = z.infer<typeof ProductCreateDTOSchema>;

export const ProductUpdateDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
    images: z.array(z.string().url()).optional(),
    colors: z.string().optional(),
    price: z.number().min(0, { message: "Price must be greater than 0" }).optional(),
    salePrice: z.number().min(0).optional(),
    quantity: z.number().int().min(0, { message: "Quantity must be non-negative" }).optional(),
    content: z.string().optional(),
    description: z.string().optional(),
    brandId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    status: z.nativeEnum(ProductStatus).optional()
});

export type ProductUpdateDTO = z.infer<typeof ProductUpdateDTOSchema>;

export const ProductConditionDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
    brandId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    inStock: z.boolean().optional()
});

export type ProductConditionDTO = z.infer<typeof ProductConditionDTOSchema>;

export const ProductResponseDTOSchema = z.object({
    id: z.string().uuid(),
    ...ProductCreateDTOSchema.shape,
    rating: z.number().min(0).max(5).optional().nullable(),
    saleCount: z.number().int().min(0).optional().nullable(),
    status: z.nativeEnum(ProductStatus),
    createdAt: z.date(),
    updatedAt: z.date()
});
export type ProductResponseDTO = z.infer<typeof ProductResponseDTOSchema>;