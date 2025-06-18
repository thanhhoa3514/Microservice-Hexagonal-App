import { BrandStatus } from "./brand-enum";
import { z } from "zod";

export const BrandCreateDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    image: z.string().url().optional().nullable(),
    description: z.string().optional().nullable(),
    tagLine: z.string().optional().nullable()
});

export type BrandCreateDTO = z.infer<typeof BrandCreateDTOSchema>;

export const BrandUpdateDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
    image: z.string().url().optional(),
    description: z.string().optional(),
    tagLine: z.string().optional(),
    status: z.nativeEnum(BrandStatus).optional()
});

export type BrandUpdateDTO = z.infer<typeof BrandUpdateDTOSchema>;

export const BrandConditionDTOSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
    status: z.nativeEnum(BrandStatus).optional()
});

export type BrandConditionDTO = z.infer<typeof BrandConditionDTOSchema>;

export const BrandResponseDTOSchema = z.object({
    id: z.string().uuid(),
    ...BrandCreateDTOSchema.shape,
    status: z.nativeEnum(BrandStatus),
    created_at: z.date(),
    updated_at: z.date()
});

export type BrandResponseDTO = z.infer<typeof BrandResponseDTOSchema>;
