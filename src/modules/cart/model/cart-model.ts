import { z } from "zod";


export const CartProductDTOSchema = z.object({
    id: z.string(),
    name: z.string(),
    images: z.array(z.string()),
    price: z.number(),
    salePrice: z.number(),
    quantity: z.number(),

});


export const CartItemDTOSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number().min(1).default(1),
    attribute: z.string().nullable().optional().default(''),
    product: CartProductDTOSchema.optional()
})


export type CartProductDTO = z.infer<typeof CartProductDTOSchema>;
export type CartItemDTO = z.infer<typeof CartItemDTOSchema>;