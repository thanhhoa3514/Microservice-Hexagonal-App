import { CategoryStatus } from "./category-enum";

import { z } from "zod";

export const CategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    image: z.string().url().optional().nullable(),
    description: z.string().optional().nullable(),
    parent_id: z.string().uuid().optional().nullable(),
    position: z.number().int().min(0).default(0).nullable(),
    status: z.nativeEnum(CategoryStatus).default(CategoryStatus.ACTIVE),
    created_at: z.date().optional(),
    updated_at: z.date().optional()
});

export type Category = z.infer<typeof CategorySchema> & { children?: Category[] };
