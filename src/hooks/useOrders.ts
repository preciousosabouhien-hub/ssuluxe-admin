import { useCallback, useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import type { Order } from "../types/order";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders from Supabase
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          customer_id,
          customer_email,
          first_name,
          last_name,
          phone,
          shipping_address,
          shipping_city,
          shipping_state,
          shipping_country,
          shipping_postal_code,
          shipping_method,
          subtotal,
          shipping_fee,
          total,
          currency,
          payment_status,
          order_status,
          payment_reference,
          created_at,
          updated_at,
          order_items (
            id,
            order_id,
            product_id,
            variant_id,
            product_name,
            variant_sku,
            selected_options,
            image_url,
            unit_price,
            quantity,
            line_total,
            created_at
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders((data ?? []) as unknown as Order[]);
    } catch (err) {
      console.error("Orders fetch error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = async (
    orderId: string,
    status: string
  ) => {
    const { data, error } = await supabase
      .from("orders")
      .update({
        order_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select("id")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error(
        "Order was not updated. Check your Supabase UPDATE policy."
      );
    }

    await fetchOrders();
  };

  // Update payment status
  const updatePaymentStatus = async (
    orderId: string,
    status: string
  ) => {
    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select("id")
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error(
        "Payment status was not updated. Check your Supabase UPDATE policy."
      );
    }

    await fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    updatePaymentStatus,
  };
}