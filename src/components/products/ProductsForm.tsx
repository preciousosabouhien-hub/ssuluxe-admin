import { useEffect, useState } from "react";

import type {
  Category,
  Product,
  ProductFormData,
  VariantFormData,
} from "../../types/product";

import { emptyVariant } from "../../utils/productHelpers";
import ProductVariantForm from "./ProductVariantForm";

interface ProductFormProps {
  categories: Category[];
  saving: boolean;
  initialData?: Product | null;
  onSubmit: (form: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  categories,
  saving,
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    categoryId: "",
    description: "",
    hairType: "",
    features: "",
    isActive: true,
    variants: [emptyVariant()],
  });

  // Populate form when editing an existing product
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        categoryId: initialData.category_id ?? "",
        description: initialData.description ?? "",
        hairType: initialData.hair_type ?? "",
        features: initialData.features?.join(", ") ?? "",
        isActive: initialData.is_active ?? true,

        variants:
          initialData.product_variants?.length > 0
            ? initialData.product_variants.map((variant) => ({
                id: variant.id,
                sku: variant.sku ?? "",
                length: variant.length ?? "",
                lace_type: variant.lace_type ?? "",
                density: variant.density ?? "",
                color: variant.color ?? "",
                price: String(variant.price ?? ""),
                stock_quantity: String(
                  variant.stock_quantity ?? 0
                ),
                is_preorder: variant.is_preorder ?? false,
                is_active: variant.is_active ?? true,
                imageFile: null,
                imagePreview: variant.image_url ?? "",
              }))
            : [emptyVariant()],
      });
    } else {
      setForm({
        name: "",
        categoryId: "",
        description: "",
        hairType: "",
        features: "",
        isActive: true,
        variants: [emptyVariant()],
      });
    }
  }, [initialData]);

  // Update product information
  const updateForm = (
    field: keyof ProductFormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update a specific variant
  const updateVariant = (
    index: number,
    field: keyof VariantFormData,
    value: string | boolean | File | null
  ) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index
          ? { ...variant, [field]: value }
          : variant
      ),
    }));
  };

  // Add a new variant
  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, emptyVariant()],
    }));
  };

  // Remove a variant
  const removeVariant = (index: number) => {
    if (form.variants.length === 1) {
      alert("A product must have at least one variant.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!form.categoryId) {
      alert("Please select a category.");
      return;
    }

    const invalidVariant = form.variants.some(
      (variant) =>
        !variant.price ||
        Number(variant.price) <= 0 ||
        variant.stock_quantity === "" ||
        !Number.isFinite(Number(variant.stock_quantity)) ||
        Number(variant.stock_quantity) < 0
    );

    if (invalidVariant) {
      alert(
        "Please enter a valid price and stock quantity for every variant."
      );
      return;
    }

    try {
      await onSubmit(form);
    } catch (error) {
      console.error(
        "Product form submission failed:",
        error
      );
    }
  };

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >
      {/* Product Information */}
      <div className="product-form-section">
        <h3>Product Information</h3>

        <label>
          Product Name
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              updateForm("name", e.target.value)
            }
            placeholder="e.g. Luxury Body Wave Wig"
            required
          />
        </label>

        <label>
          Category
          <select
            value={form.categoryId}
            onChange={(e) =>
              updateForm("categoryId", e.target.value)
            }
            required
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Hair Type
          <input
            type="text"
            value={form.hairType}
            onChange={(e) =>
              updateForm("hairType", e.target.value)
            }
            placeholder="e.g. 100% Human Hair"
          />
        </label>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) =>
              updateForm("description", e.target.value)
            }
            placeholder="Describe this product..."
            rows={4}
          />
        </label>

        <label>
          Features
          <textarea
            value={form.features}
            onChange={(e) =>
              updateForm("features", e.target.value)
            }
            placeholder="Enter features separated by commas"
            rows={3}
          />
        </label>

        <label className="product-checkbox">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              updateForm("isActive", e.target.checked)
            }
          />

          Active product
        </label>
      </div>

      {/* Product Variants */}
      <ProductVariantForm
        variants={form.variants}
        productName={form.name}
        onChange={updateVariant}
        onAdd={addVariant}
        onRemove={removeVariant}
      />

      {/* Form Actions */}
      <div className="product-form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving Product..."
            : initialData
              ? "Update Product"
              : "Save Product"}
        </button>
      </div>
    </form>
  );
}