import { z } from "zod";

export const AddCartItemDTOSchema = z.object({
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    attribute: z.string().nullable().optional().default(''),
    quantity: z.number().min(1).default(1),
})

export const UpdateCartItemDTOSchema = z.object({
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    attribute: z.string().nullable().optional().default(''),
    quantity: z.number().min(1).default(1),
})
export const CartItemConditionDTOSchema = z.object({
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    attribute: z.string().nullable().optional().default(''),
})




export const DeleteCartItemDTOSchema = z.object({
    userId: z.string().uuid(),
    productId: z.string().uuid(),
})


export type AddCartItemDTO = z.infer<typeof AddCartItemDTOSchema>;
export type UpdateCartItemDTO = z.infer<typeof UpdateCartItemDTOSchema>;
export type CartItemConditionDTO = z.infer<typeof CartItemConditionDTOSchema>;
export type DeleteCartItemDTO = z.infer<typeof DeleteCartItemDTOSchema>;