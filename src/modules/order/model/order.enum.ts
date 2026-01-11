

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    RETURNED = 'returned',
    REFUNDED = 'refunded',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CONFIRMED = 'confirmed',
    SHIPPING = 'shipping',
    DELIVERY = 'delivery',
    DELIVERY_FAILED = 'delivery_failed',
    DELIVERY_COMPLETED = 'delivery_completed',
    DELIVERY_CANCELLED = 'delivery_cancelled',
    DELIVERY_RETURNED = 'delivery_returned',
    DELIVERY_REFUNDED = 'delivery_refunded',
}

export enum OrderPaymentMethod {
    CASH_ON_DELIVERY = 'cash_on_delivery',
    ZALO_PAY = 'zalopay',
    MOMO = 'momo',
    VNPAY = 'vnpay',
    BANK_TRANSFER = 'bank_transfer',
    OTHER = 'other',
}

export enum ShippingMethod {
    EXPRESS = 'express',
    STANDARD = 'standard',
    OTHER = 'other',
}

export enum ShippingStatus {
    PENDING = 'pending',
    SHIPPED = 'shipped',
    FAILED = 'failed',
}

export enum OrderPaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}