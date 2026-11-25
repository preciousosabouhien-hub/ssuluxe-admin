import { useOrders } from "../hooks/useOrders";

export default function Orders() {
  const {
    orders,
    loading,
    error,
  } = useOrders();

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Orders Management</h1>

      <p>Total Orders: {orders.length}</p>

      {orders.map((order) => (
        <div key={order.id}>
          <h3>{order.order_number}</h3>

          <p>
            Customer: {order.first_name} {order.last_name}
          </p>

          <p>Email: {order.customer_email}</p>

          <p>Total: {order.currency} {order.total}</p>

          <p>Status: {order.order_status}</p>

          <p>Items: {order.order_items?.length ?? 0}</p>
        </div>
      ))}
    </div>
  );
}