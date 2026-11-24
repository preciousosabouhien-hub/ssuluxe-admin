import type { Product } from "../../types/product";
import ProductStatus from "./ProductStatus";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="products-empty">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="products-table-wrapper">
      <table className="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Hair Type</th>
            <th>Variants</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-name-cell">
                  <strong>{product.name}</strong>
                  <small>{product.slug}</small>
                </div>
              </td>

              <td>{product.category?.name ?? "Uncategorised"}</td>

              <td>{product.hair_type ?? "—"}</td>

              <td>{product.product_variants?.length ?? 0}</td>

              <td>
               <ProductStatus isActive={product.is_active} />
              </td>

              <td>
                <div className="product-actions">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => onDelete(product)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}