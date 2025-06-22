import { z } from "zod";
import { Gender } from "./user.enum";

export const UserProfileDTOSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    birthday: z.date().nullable().optional(),
    gender: z.nativeEnum(Gender)
});

export type UserProfileDTO = z.infer<typeof UserProfileDTOSchema>