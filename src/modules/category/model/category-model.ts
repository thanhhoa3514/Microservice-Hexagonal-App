import { CategoryStatus } from "./category-enum";

import { z } from "zod";

export const CategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    image: z.string().url().optional(),
    description: z.string().optional(),
    parent_id: z.string().uuid().optional(),
    position: z.number().int().positive().default(0),
    status: z.nativeEnum(CategoryStatus).default(CategoryStatus.ACTIVE),
    created_at: z.date().optional(),
    updated_at: z.date().optional()
});

export type Category = z.infer<typeof CategorySchema>;
