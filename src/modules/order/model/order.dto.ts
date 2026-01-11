import { z } from "zod";
import { orderSchema } from "./order.model";


export const orderConditionSchema = orderSchema.pick({
    shippingMethod: true,
    paymentMethod: true,
    paymentStatus: true,
    trackingNumber: true,
    status: true,

}).partial();
export type OrderCondition = z.infer<typeof orderConditionSchema>;

export const orderCreateSchema = orderSchema.pick({

    shippingAddress: true,
    shippingCity: true,
    shippingMethod: true,
    paymentMethod: true,
    paymentStatus: true,
    recipientFirstName: true,
    recipientLastName: true,
    recipientPhone: true,
    recipientEmail: true,
});
export type OrderCreate = z.infer<typeof orderCreateSchema>;
