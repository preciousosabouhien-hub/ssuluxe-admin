import type { VariantFormData } from "../../types/product";
import { generateSku } from "../../utils/productHelpers";
import ProductImageUpload from "./ProductImageUpload";

interface ProductVariantFormProps {
variants: VariantFormData[];
productName: string;
onChange: (
index: number,
field: keyof VariantFormData,
value: string | boolean | File | null
) => void;
onAdd: () => void;
onRemove: (index: number) => void;
}

export default function ProductVariantForm({
variants,
productName,
onChange,
onAdd,
onRemove,
}: ProductVariantFormProps) {
return (
    <div className="product-form-section">
        <div className="variant-heading">
            <h3> Product Variants</h3>

    <button
      type="button"
      onClick={onAdd}
      className="add-variant-button"
    >
      + Add Variant
    </button>
  </div>
  {(variants ?? []).map((variant, index) => (
    <div className="variant-form-card" key={index}>
      <div className="variant-heading">
        <h4>Variant {index + 1}</h4>
        {variants.length > 1 && (
          <button
            type="button"
            className="delete-button"
            onClick={() => onRemove(index)}
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
              onChange(index, "sku", e.target.value)
            }
            placeholder="Product SKU"
          />
          <button
            type="button"
            onClick={() =>
              onChange(
                index,
                "sku",
                generateSku(productName, variant.length)
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
            onChange(index, "length", e.target.value)
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
            onChange(index, "lace_type", e.target.value)
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
            onChange(index, "density", e.target.value)
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
            onChange(index, "color", e.target.value)
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
            onChange(index, "price", e.target.value)
          }
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
            onChange(index, "stock_quantity", e.target.value)
          }
          required
        />
      </label>
      <ProductImageUpload
        preview={variant.imagePreview}
        onImageChange={(file, preview) => {
          onChange(index, "imageFile", file);
          onChange(index, "imagePreview", preview);
        }}
      />
      <label className="product-checkbox">
        <input
          type="checkbox"
          checked={variant.is_preorder}
          onChange={(e) =>
            onChange(index, "is_preorder", e.target.checked)
          }
        />
        Available for preorder
      </label>
      <label className="product-checkbox">
        <input
          type="checkbox"
          checked={variant.is_active}
          onChange={(e) =>
            onChange(index, "is_active", e.target.checked)
          }
        />
        Active variant
      </label>
    </div>
  ))}
</div>

);
}