import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface ProductVariant {
id: string;
sku: string;
length: string | null;
lace_type: string | null;
density: string | null;
color: string | null;
price: number;
stock_quantity: number;
is_preorder: boolean;
is_active: boolean;
image_url: string | null;
}

interface Product {
id: string;
name: string;
slug: string;
description: string | null;
hair_type: string | null;
is_active: boolean;
categories: {
name: string;
} | null;
product_variants: ProductVariant[];
}

export default function Products() {
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

async function fetchProducts() {
setLoading(true);
setError("");

const { data, error } = await supabase
  .from("products")
  .select(`
    id,
    name,
    slug,
    description,
    hair_type,
    is_active,
    categories (
      name
    ),
    product_variants (
      id,
      sku,
      length,
      lace_type,
      density,
      color,
      price,
      stock_quantity,
      is_preorder,
      is_active,
      image_url
    )
  `)
  .order("created_at", { ascending: false });
if (error) {
  console.error("Products fetch error:", error);
  setError(error.message);
} else {
  setProducts((data ?? []) as Product[]);
}
setLoading(false);

}

useEffect(() => {
fetchProducts();
}, []);

return (
    <section className="products-page">
Products
Manage your store products and inventory.
    <button className="add-product-btn" disabled>
      + Add Product (coming next)
    </button>
  {loading && <p>Loading products...</p>}
  {error && (
    <div className="products-error">
      <p>Unable to load products.</p>
      <small>{error}</small>
      <button onClick={fetchProducts}>Try again</button>
    </div>
  )}
  {!loading && !error && products.length === 0 && (
    <div className="products-empty">
      <h3>No products found</h3>
      <p>Your Supabase products will appear here once added.</p>
    </div>
  )}
  {!loading && !error && products.length > 0 && (
    <div className="products-table-wrapper">
      <table className="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Hair Type</th>
            <th>Variants</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const variants = product.product_variants ?? [];
            const prices = variants.map((variant) =>
              Number(variant.price)
            );
            const totalStock = variants.reduce(
              (total, variant) =>
                total + Number(variant.stock_quantity),
              0
            );
            return (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                  <small>{product.slug}</small>
                </td>
                <td>{product.categories?.name ?? "Uncategorised"}</td>
                <td>{product.hair_type ?? "—"}</td>
                <td>{variants.length}</td>
                <td>
                  {prices.length > 0
                    ? `$${Math.min(...prices).toFixed(2)} – $${Math.max(
                        ...prices
                      ).toFixed(2)}`
                    : "No variants"}
                </td>
                <td>{totalStock}</td>
                <td>
                  <span
                    className={
                      product.is_active
                        ? "product-status active"
                        : "product-status inactive"
                    }
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</section>

);
}