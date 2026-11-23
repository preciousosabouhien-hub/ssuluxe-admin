import { useState } from "react";
import type {
  Category,
  ProductFormData,
  VariantFormData,
} from "../../types/product";
import { emptyVariant, generateSku } from "../../utils/productHelpers";

interface ProductFormProps {
  categories: Category[];
  saving: boolean;
  onSubmit: (form: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  categories,
  saving,
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

  const updateForm = (
    field: keyof ProductFormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, emptyVariant()],
    }));
  };

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

  const handleImageChange = (
    index: number,
    file: File | undefined
  ) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must not exceed 5MB.");
      return;
    }

    const preview = URL.createObjectURL(file);

    updateVariant(index, "imageFile", file);
    updateVariant(index, "imagePreview", preview);
  };

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
        Number(variant.stock_quantity) < 0
    );

    if (invalidVariant) {
      alert("Please enter a valid price and stock quantity for every variant.");
      return;
    }

    try {
      await onSubmit(form);
    } catch (error) {
      console.error("Product form submission failed:", error);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {/* Product Information */}
      <div className="product-form-section">
        <h3>Product Information</h3>

        <label>
          Product Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
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
              <option key={category.id} value={category.id}>
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
            onChange={(e) => updateForm("hairType", e.target.value)}
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
            onChange={(e) => updateForm("features", e.target.value)}
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
      <div className="product-form-section">
        <div className="variant-heading">
          <h3>Product Variants</h3>

          <button
            type="button"
            onClick={addVariant}
            className="add-variant-button"
          >
            + Add Variant
          </button>
        </div>

        {form.variants.map((variant, index) => (
          <div className="variant-form-card" key={index}>
            <div className="variant-heading">
              <h4>Variant {index + 1}</h4>

              {form.variants.length > 1 && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => removeVariant(index)}
                >
                  Remove
                </button>
              )}
            </div>

            <label>
              SKU
              <div className="sku-input-group">
                <input
                  type="text"
                  value={variant.sku}
                  onChange={(e) =>
                    updateVariant(index, "sku", e.target.value)
                  }
                  placeholder="Product SKU"
                />

                <button
                  type="button"
                  onClick={() =>
                    updateVariant(
                      index,
                      "sku",
                      generateSku(form.name, variant.length)
                    )
                  }
                >
                  Generate
                </button>
              </div>
            </label>

            <label>
              Hair Length
              <input
                type="text"
                value={variant.length}
                onChange={(e) =>
                  updateVariant(index, "length", e.target.value)
                }
                placeholder="e.g. 18 inches"
              />
            </label>

            <label>
              Lace Type
              <input
                type="text"
                value={variant.lace_type}
                onChange={(e) =>
                  updateVariant(index, "lace_type", e.target.value)
                }
                placeholder="e.g. 13x4 HD Lace"
              />
            </label>

            <label>
              Density
              <input
                type="text"
                value={variant.density}
                onChange={(e) =>
                  updateVariant(index, "density", e.target.value)
                }
                placeholder="e.g. 180%"
              />
            </label>

            <label>
              Color
              <input
                type="text"
                value={variant.color}
                onChange={(e) =>
                  updateVariant(index, "color", e.target.value)
                }
                placeholder="e.g. Natural Black"
              />
            </label>

            <label>
              Price (USD)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={variant.price}
                onChange={(e) =>
                  updateVariant(index, "price", e.target.value)
                }
                placeholder="e.g. 185.00"
                required
              />
            </label>

            <label>
              Stock Quantity
              <input
                type="number"
                min="0"
                value={variant.stock_quantity}
                onChange={(e) =>
                  updateVariant(
                    index,
                    "stock_quantity",
                    e.target.value
                  )
                }
                required
              />
            </label>

            <label>
              Variant Image
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  handleImageChange(index, e.target.files?.[0])
                }
              />
            </label>

            {variant.imagePreview && (
              <div className="product-image-preview">
                <img
                  src={variant.imagePreview}
                  alt="Variant preview"
                />
              </div>
            )}

            <label className="product-checkbox">
              <input
                type="checkbox"
                checked={variant.is_preorder}
                onChange={(e) =>
                  updateVariant(
                    index,
                    "is_preorder",
                    e.target.checked
                  )
                }
              />
              Available for preorder
            </label>

            <label className="product-checkbox">
              <input
                type="checkbox"
                checked={variant.is_active}
                onChange={(e) =>
                  updateVariant(
                    index,
                    "is_active",
                    e.target.checked
                  )
                }
              />
              Active variant
            </label>
          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="product-form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button type="submit" disabled={saving}>
          {saving ? "Saving Product..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}