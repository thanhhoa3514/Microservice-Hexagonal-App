import { z } from "zod";
import { OrderPaymentMethod, OrderPaymentStatus, OrderStatus, ShippingMethod } from "./order.enum";



export const orderItemSchema = z.object({
    id: z.string().uuid(),
    orderId: z.string().uuid(),
    productId: z.string().uuid(),
    name: z.string(),
    attributes: z.array(z.string()),
    price: z.number(),
    quantity: z.number()
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    shippingAddress: z.string().min(5).optional(),
    shippingCity: z.string().optional(),
    recipientFirstName: z.string().min(5).optional(),
    recipientLastName: z.string().min(5).optional(),
    recipientPhone: z.string().min(10).optional(),
    recipientEmail: z.string().email().optional(),
    recipientNote: z.string().optional(),
    shippingMethod: z.nativeEnum(ShippingMethod),
    paymentMethod: z.nativeEnum(OrderPaymentMethod),
    paymentStatus: z.nativeEnum(OrderPaymentStatus),
    trackingNumber: z.string(),
    status: z.nativeEnum(OrderStatus),
    items: z.array(orderItemSchema),
    createdAt: z.date(),
    updatedAt: z.date(),

});
export type Order = z.infer<typeof orderSchema>;

export const orderUpdateSchema = orderSchema.pick({
    paymentMethod: true,
    paymentStatus: true,
    status: true,
    shippingAddress: true,
    shippingCity: true,
    recipientFirstName: true,
    recipientLastName: true,
    recipientPhone: true,
    recipientEmail: true,
    shippingMethod: true,
    trackingNumber: true,
    items: true,
}).partial();
export type OrderUpdate = z.infer<typeof orderUpdateSchema>;


export type Customer = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
}

export type Product = {
    id: string,
    name: string,
    salePrice: number,
    image: string | null,
    quantity: number,
}
export type CartItem = {
    id: string,
    productId: string,
    userId: string,
    productName: string,
    attribute: string | null,
    quantity: number,
    price: number,

}
