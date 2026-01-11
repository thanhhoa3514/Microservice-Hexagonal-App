export class CartError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Business Logic Errors
export class CartNotFoundError extends CartError {
    constructor(cartId: string) {
        super(`Cart with ID ${cartId} not found`);
    }
}

export class CartNotBelongToUserError extends CartError {
    constructor(cartId: string, userId: string) {
        super(`Cart ${cartId} does not belong to user ${userId}`);
    }
}

export class CartEmptyError extends CartError {
    constructor() {
        super('Cart is empty');
    }
}

export class CartItemNotFoundError extends CartError {
    constructor(productId: string) {
        super(`Product ${productId} not found in cart`);
    }
}

export class CartItemAlreadyExistsError extends CartError {
    constructor(productId: string) {
        super(`Product ${productId} already exists in cart`);
    }
}

export class CartItemInsufficientStockError extends CartError {
    constructor(productId: string, requested: number, available: number) {
        super(`Insufficient stock for product ${productId}. Requested: ${requested}, Available: ${available}`);
    }
}

export class CartItemInvalidQuantityError extends CartError {
    constructor(quantity: number) {
        super(`Invalid quantity: ${quantity}. Quantity must be greater than 0`);
    }
}

export class CartMaxItemsExceededError extends CartError {
    constructor(maxItems: number) {
        super(`Cart cannot exceed ${maxItems} items`);
    }
}

export class CartProductUnavailableError extends CartError {
    constructor(productId: string) {
        super(`Product ${productId} is no longer available`);
    }
}

export class CartProductPriceChangedError extends CartError {
    constructor(productId: string, oldPrice: number, newPrice: number) {
        super(`Product ${productId} price changed from ${oldPrice} to ${newPrice}`);
    }
}

// Data Validation Errors
export class CartInvalidDataError extends CartError {
    constructor(field: string, value: any) {
        super(`Invalid ${field}: ${value}`);
    }
}

export class CartRequiredFieldError extends CartError {
    constructor(field: string) {
        super(`Required field ${field} is missing`);
    }
}

export class CartInvalidProductIdError extends CartError {
    constructor(productId: string) {
        super(`Invalid product ID format: ${productId}`);
    }
}

export class CartInvalidUserIdError extends CartError {
    constructor(userId: string) {
        super(`Invalid user ID format: ${userId}`);
    }
}

export class CartInvalidCartIdError extends CartError {
    constructor(cartId: string) {
        super(`Invalid cart ID format: ${cartId}`);
    }
}

// Permission Errors
export class CartAccessDeniedError extends CartError {
    constructor(operation: string) {
        super(`Access denied for cart ${operation}`);
    }
}

export class CartOperationNotAllowedError extends CartError {
    constructor(operation: string, reason: string) {
        super(`Cart ${operation} not allowed: ${reason}`);
    }
}

// Database/Repository Errors
export class CartDatabaseError extends CartError {
    constructor(operation: string, details?: string) {
        super(`Database error during cart ${operation}${details ? `: ${details}` : ''}`);
    }
}

export class CartConcurrencyError extends CartError {
    constructor() {
        super('Cart was modified by another process. Please retry');
    }
}

export class CartSaveError extends CartError {
    constructor(details?: string) {
        super(`Failed to save cart${details ? `: ${details}` : ''}`);
    }
}

export class CartDeleteError extends CartError {
    constructor(cartId: string, details?: string) {
        super(`Failed to delete cart ${cartId}${details ? `: ${details}` : ''}`);
    }
}

// System/Integration Errors
export class CartServiceUnavailableError extends CartError {
    constructor(service: string) {
        super(`Cart service unavailable: ${service}`);
    }
}

export class CartTimeoutError extends CartError {
    constructor(operation: string) {
        super(`Cart ${operation} timed out`);
    }
}

export class CartExternalServiceError extends CartError {
    constructor(service: string, details?: string) {
        super(`External service error (${service})${details ? `: ${details}` : ''}`);
    }
}

export class CartProductNotFoundError extends CartError {
    constructor(productId: string) {
        super(`Product ${productId} not found`);
    }
}

export class CartProductQuantityNotEnoughError extends CartError {
    constructor(productId: string, requested: number, available: number) {
        super(`Insufficient stock for product ${productId}. Requested: ${requested}, Available: ${available}`);
    }
}

export class CartProductAlreadyInCartError extends CartError {
    constructor(productId: string) {
        super(`Product ${productId} already in cart`);
    }
}