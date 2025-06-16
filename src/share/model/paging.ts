import z from "zod";

export const PaginationSchema = z.object({
    page: z.coerce.number().int().positive().min(1).default(1),
    limit: z.coerce.number().int().positive().min(1).max(100).default(10)
})

export type Pagination = z.infer<typeof PaginationSchema>;

export const Paging = (data: Pagination) => {
    const { page, limit } = data;
    const offset = (Number(page) - 1) * Number(limit);
    return { offset, limit };
}

