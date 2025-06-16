import { CategoryStatus } from "./category-enum";
import { z } from "zod";

export const CategoryCreateDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    image: z.string().url().optional(),
    description: z.string().optional(),
    parent_id: z.string().uuid().optional(),
    position: z.number().int().positive().default(0).optional()
});

export type CategoryCreateDTO = z.infer<typeof CategoryCreateDTOSchema>;

export const CategoryUpdateDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
    image: z.string().url().optional(),
    description: z.string().optional(),
    parent_id: z.string().uuid().optional(),
    position: z.number().int().positive().optional(),
    status: z.nativeEnum(CategoryStatus).optional()
});

export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateDTOSchema>;

export const CategoryResponseDTOSchema = z.object({
    id: z.string().uuid(),
    ...CategoryCreateDTOSchema.shape,
    status: z.nativeEnum(CategoryStatus),
    created_at: z.date(),
    updated_at: z.date()
});

export type CategoryResponseDTO = z.infer<typeof CategoryResponseDTOSchema>;