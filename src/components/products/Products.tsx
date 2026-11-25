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
    updateProduct,
    deactivateProduct,
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  // Add or update a product
  const handleSaveProduct = async (form: ProductFormData) => {
    try {
      if (selectedProduct) {
        console.log("Updating product:", selectedProduct.id);
        
        await updateProduct(selectedProduct.id, form);

        alert("Product updated successfully!");
      } else {
        await addProduct(form);

        alert("Product added successfully!");
      }

      setIsModalOpen(false);
      setSelectedProduct(null);

    } catch (error) {
      console.error("Product save error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to save product."
      );
    }
  };

  // Open edit modal
  const handleEdit = (product: Product) => {
    console.log("Product selected:", product);

    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Deactivate product
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
          title={
            selectedProduct
              ? "Edit Product"
              : "Add New Product"
          }
          onClose={handleCloseModal}
        >
          <ProductForm
            categories={categories}
            saving={saving}
            initialData={selectedProduct}
            onSubmit={handleSaveProduct}
            onCancel={handleCloseModal}
          />
        </ProductModal>
      )}

    </div>
  );
}