import { BrandStatus } from "./brand-enum";
import { z } from "zod";
import { BrandNameTooShortError } from "./brand-error";

export const BrandCreateDTOSchema = z.object({
    name: z.string().min(2, new BrandNameTooShortError()),
    image: z.string().url().optional().nullable(),
    description: z.string().optional().nullable(),
    tagLine: z.string().optional().nullable()
});

export type BrandCreateDTO = z.infer<typeof BrandCreateDTOSchema>;

export const BrandUpdateDTOSchema = z.object({
    name: z.string().min(2, new BrandNameTooShortError()).optional(),
    image: z.string().url().optional(),
    description: z.string().optional(),
    tagLine: z.string().optional(),
    status: z.nativeEnum(BrandStatus).optional()
});

export type BrandUpdateDTO = z.infer<typeof BrandUpdateDTOSchema>;

export const BrandConditionDTOSchema = z.object({
    name: z.string().min(2, new BrandNameTooShortError()).optional(),
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
