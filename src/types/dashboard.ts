export type OrderStatus = "Success" | "Pending" | "Cancelled";
export interface Order { id: string; item: string; customer: string; date: string; amount: number; status: OrderStatus; }
export interface WishlistItem { id: number; item: string; status: OrderStatus; price: number; emoji: string; }
