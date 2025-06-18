export class BrandNotFoundError extends Error {
    constructor(brandId?: string) {
        super(brandId ? `Brand with ID ${brandId} not found` : "Brand not found");
        this.name = "BrandNotFoundError";
    }
}

export class BrandAlreadyExistsError extends Error {
    constructor(brandName: string) {
        super(`Brand with name '${brandName}' already exists`);
        this.name = "BrandAlreadyExistsError";
    }
}

export class BrandAlreadyDeletedError extends Error {
    constructor(brandId: string) {
        super(`Brand with ID ${brandId} is already deleted`);
        this.name = "BrandAlreadyDeletedError";
    }
}

export class BrandNameTooShortError extends Error {
    constructor(minLength: number = 2) {
        super(`Brand name must be at least ${minLength} characters long`);
        this.name = "BrandNameTooShortError";
    }
}

export class BrandInvalidImageUrlError extends Error {
    constructor(url: string) {
        super(`Invalid image URL provided: ${url}`);
        this.name = "BrandInvalidImageUrlError";
    }
}

export class BrandStatusTransitionError extends Error {
    constructor(currentStatus: string, targetStatus: string) {
        super(`Cannot transition brand status from ${currentStatus} to ${targetStatus}`);
        this.name = "BrandStatusTransitionError";
    }
}

export class BrandHasActiveProductsError extends Error {
    constructor(brandId: string) {
        super(`Cannot delete brand ${brandId} because it has active products`);
        this.name = "BrandHasActiveProductsError";
    }
}

export class BrandUpdateForbiddenError extends Error {
    constructor(reason: string) {
        super(`Brand update forbidden: ${reason}`);
        this.name = "BrandUpdateForbiddenError";
    }
}

export class BrandInactiveError extends Error {
    constructor(brandId: string) {
        super(`Brand ${brandId} is inactive and cannot be used`);
        this.name = "BrandInactiveError";
    }
}

export class BrandCreationFailedError extends Error {
    constructor(reason: string) {
        super(`Failed to create brand: ${reason}`);
        this.name = "BrandCreationFailedError";
    }
}

export class BrandValidationError extends Error {
    constructor(field: string, value: any, reason: string) {
        super(`Validation failed for field '${field}' with value '${value}': ${reason}`);
        this.name = "BrandValidationError";
    }
}

export class BrandPermissionError extends Error {
    constructor(action: string) {
        super(`Insufficient permissions to ${action} brand`);
        this.name = "BrandPermissionError";
    }
}
