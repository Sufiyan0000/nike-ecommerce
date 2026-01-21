export type CartItem = {
    id: string;
    product_variant: string,
    quantity: number,
    product_variant_detail?: any;
}

export type Cart = {
    id: string,
    items: CartItem[],
    total_items: number,
    total_amount?: number;
}

export type SizeVariant = {
    id: string;
    size: number;
}