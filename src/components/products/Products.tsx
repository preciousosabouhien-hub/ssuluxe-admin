import { useState } from "react";
import ProductsTable from "./ProductsTable";
import ProductModal from "./ProductsModal";
import ProductForm from "./ProductsForm";

import { useProducts } from "../../hooks/useProducts";
import type { Product, ProductFormData } from "../../types/product";

export default function Products() {
  const {
    products,
    categories,
    loading,
    error,
    saving,
    fetchProducts,
    addProduct,
    deactivateProduct,
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const handleAddProduct = async (form: ProductFormData) => {
    try {
      await addProduct(form);
      setIsModalOpen(false);
      alert("Product added successfully!");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to add product."
      );
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    alert("The edit form will be connected in the next step.");
  };

const handleDelete = async (product: Product) => {
  const confirmed = window.confirm(
    `Are you sure you want to deactivate "${product.name}"?`
  );

  if (!confirmed) return;

  try {
    await deactivateProduct(product.id);

    alert("Product deactivated successfully!");
  } catch (error) {
    console.error("Error deactivating product:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to deactivate product."
    );
  }
};

  return (
    <div className="products-page">
      <div className="products-heading">
        <div>
          <h1>Products</h1>
          <p>Manage your store products and variants.</p>
        </div>

        <button
          type="button"
          className="add-product-button"
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
        >
          + Add Product
        </button>
      </div>

      {error && (
        <div className="products-error">
          {error}
          <button type="button" onClick={fetchProducts}>
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="products-loading">
          Loading products...
        </div>
      ) : (
        <ProductsTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <ProductModal
          title="Add New Product"
          onClose={() => setIsModalOpen(false)}
        >
          <ProductForm
            categories={categories}
            saving={saving}
            onSubmit={handleAddProduct}
            onCancel={() => setIsModalOpen(false)}
          />
        </ProductModal>
      )}
    </div>
  );
}