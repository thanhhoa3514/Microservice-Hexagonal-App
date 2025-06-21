export class ProductNotFoundError extends Error {
    constructor(productId?: string) {
        super(productId ? `Product with ID ${productId} not found` : "Product not found");
        this.name = "ProductNotFoundError";
    }
}

export class ProductAlreadyExistsError extends Error {
    constructor(productName: string) {
        super(`Product with name '${productName}' already exists`);
        this.name = "ProductAlreadyExistsError";
    }
}

export class ProductOutOfStockError extends Error {
    constructor(productId: string, requested: number, available: number) {
        super(`Product ${productId} out of stock. Requested: ${requested}, Available: ${available}`);
        this.name = "ProductOutOfStockError";
    }
}

export class ProductInvalidPriceError extends Error {
    constructor(price: number) {
        super(`Invalid product price: ${price}. Price must be greater than 0`);
        this.name = "ProductInvalidPriceError";
    }
}

export class ProductInvalidSalePriceError extends Error {
    constructor(price: number, salePrice: number) {
        super(`Invalid sale price: ${salePrice}. Sale price must be less than regular price: ${price}`);
        this.name = "ProductInvalidSalePriceError";
    }
}

export class ProductCategoryNotExistsError extends Error {
    constructor(categoryId: string) {
        super(`Category with ID ${categoryId} does not exist`);
        this.name = "ProductCategoryNotExistsError";
    }
}

export class ProductBrandNotExistsError extends Error {
    constructor(brandId: string) {
        super(`Brand with ID ${brandId} does not exist`);
        this.name = "ProductBrandNotExistsError";
    }
}

export class ProductStatusTransitionError extends Error {
    constructor(currentStatus: string, targetStatus: string) {
        super(`Cannot transition product status from ${currentStatus} to ${targetStatus}`);
        this.name = "ProductStatusTransitionError";
    }
}

export class ProductValidationError extends Error {
    constructor(field: string, value: any, reason: string) {
        super(`Validation failed for field '${field}' with value '${value}': ${reason}`);
        this.name = "ProductValidationError";
    }
}

export class ProductUpdateForbiddenError extends Error {
    constructor(reason: string) {
        super(`Product update forbidden: ${reason}`);
        this.name = "ProductUpdateForbiddenError";
    }
}

export class ProductDeleteForbiddenError extends Error {
    constructor(productId: string, reason: string) {
        super(`Cannot delete product ${productId}: ${reason}`);
        this.name = "ProductDeleteForbiddenError";
    }
}

export class ProductInactiveError extends Error {
    constructor(productId: string) {
        super(`Product ${productId} is inactive and cannot be used`);
        this.name = "ProductInactiveError";
    }
}

export class ProductBannedError extends Error {
    constructor(productId: string) {
        super(`Product ${productId} is banned and cannot be accessed`);
        this.name = "ProductBannedError";
    }
} 