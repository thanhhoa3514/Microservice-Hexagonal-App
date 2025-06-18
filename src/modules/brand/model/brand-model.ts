import { BrandStatus } from "./brand-enum";
import { z } from "zod";

export const modelName = "brands";
export const BrandSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    image: z.string().url().optional().nullable(),
    description: z.string().optional().nullable(),
    tagLine: z.string().optional().nullable(),

    status: z.nativeEnum(BrandStatus).default(BrandStatus.ACTIVE),
    created_at: z.date().optional(),
    updated_at: z.date().optional()
});

export type Brand = z.infer<typeof BrandSchema>;