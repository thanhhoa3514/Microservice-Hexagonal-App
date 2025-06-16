import { CategoryStatus } from "./category-enum";
import { z } from "zod";

export const CategoryCreateDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    image: z.string().url().optional().nullable(),
    description: z.string().optional().nullable(),
    parentId: z.string().uuid().optional().nullable(),
    position: z.number().int().min(0).default(0).nullable()
});

export type CategoryCreateDTO = z.infer<typeof CategoryCreateDTOSchema>;

export const CategoryUpdateDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
    image: z.string().url().optional(),
    description: z.string().optional(),
    parentId: z.string().uuid().optional(),
    position: z.number().int().positive().optional(),
    status: z.nativeEnum(CategoryStatus).optional()
});

export type CategoryUpdateDTO = z.infer<typeof CategoryUpdateDTOSchema>;

export const CategoryConditionDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
    parentId: z.string().uuid().optional(),
    status: z.nativeEnum(CategoryStatus).optional()
})

export type CategoryConditionDTO = z.infer<typeof CategoryConditionDTOSchema>;

export const CategoryResponseDTOSchema = z.object({
    id: z.string().uuid(),
    ...CategoryCreateDTOSchema.shape,
    status: z.nativeEnum(CategoryStatus),
    created_at: z.date(),
    updated_at: z.date()
});

export type CategoryResponseDTO = z.infer<typeof CategoryResponseDTOSchema>;