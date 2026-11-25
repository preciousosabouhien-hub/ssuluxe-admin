export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_sku: string | null;
  selected_options: Record<string, unknown> | null;
  image_url: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_email: string;
  first_name: string;
  last_name: string;
  phone: string | null;

  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_postal_code: string | null;
  shipping_method: string;

  subtotal: number;
  shipping_fee: number;
  total: number;
  currency: string;

  payment_status: string;
  order_status: string;
  payment_reference: string | null;

  created_at: string;
  updated_at: string | null;

  order_items: OrderItem[];
}