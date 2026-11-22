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
  }[] | null;
  product_variants: ProductVariant[];
}

interface Category {
  id: string;
  name: string;
}

interface VariantForm {
  sku: string;
  length: string;
  lace_type: string;
  density: string;
  color: string;
  price: string;
  stock_quantity: string;
  is_preorder: boolean;
  is_active: boolean;
}

const emptyVariant = (): VariantForm => ({
  sku: "",
  length: "",
  lace_type: "",
  density: "",
  color: "",
  price: "",
  stock_quantity: "0",
  is_preorder: false,
  is_active: true,
});

function generateSku(productName: string, length: string) {
  const prefix = productName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);

  const size = length.replace(/\D/g, "") || "STD";
  const uniqueCode = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `${prefix}-${size}-${uniqueCode}`;
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [hairType, setHairType] = useState("");
  const [features, setFeatures] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [variants, setVariants] = useState<VariantForm[]>([
    emptyVariant(),
  ]);

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
      setProducts((data ?? []) as unknown as Product[]);
    }

    setLoading(false);
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Categories fetch error:", error);
      setFormError("Unable to load product categories.");
      return;
    }

    setCategories((data ?? []) as Category[]);
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  function resetForm() {
    setName("");
    setCategoryId("");
    setDescription("");
    setHairType("");
    setFeatures("");
    setIsActive(true);
    setVariants([emptyVariant()]);
    setFormError("");
  }

  function updateVariant(
    index: number,
    field: keyof VariantForm,
    value: string | boolean
  ) {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  }

  function addVariant() {
    setVariants((current) => [...current, emptyVariant()]);
  }

  function removeVariant(index: number) {
    setVariants((current) =>
      current.length > 1
        ? current.filter((_, i) => i !== index)
        : current
    );
  }

  async function handleAddProduct(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setFormError("");

    if (!name.trim()) {
      setFormError("Please enter a product name.");
      setSaving(false);
      return;
    }

    if (variants.length === 0) {
      setFormError("Please add at least one product variant.");
      setSaving(false);
      return;
    }

    const invalidVariant = variants.some(
      (variant) =>
        !variant.price ||
        Number(variant.price) <= 0 ||
        Number(variant.stock_quantity) < 0
    );

    if (invalidVariant) {
      setFormError(
        "Every variant needs a valid price and stock quantity."
      );
      setSaving(false);
      return;
    }

    const productSlug = createSlug(name);

    // Create the main product first.
    const { data: newProduct, error: productError } = await supabase
      .from("products")
      .insert({
        name: name.trim(),
        slug: productSlug,
        category_id: categoryId || null,
        description: description.trim() || null,
        hair_type: hairType || null,
        features: features
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean),
        is_active: isActive,
      })
      .select("id")
      .single();

    if (productError || !newProduct) {
      console.error("Product creation error:", productError);
      setFormError(
        productError?.message || "Unable to create product."
      );
      setSaving(false);
      return;
    }

    // Create the product variants.
      const variantData = variants.map((variant) => 
    ({
      product_id: newProduct.id,
      sku:
      variant.sku.trim() ||
      generateSku(name, variant.length),
      length: variant.length || null,
      lace_type: variant.lace_type || null,
      density: variant.density || null,
      color: variant.color || null,
      price: Number(variant.price),
      stock_quantity: Number(variant.stock_quantity),
      is_preorder: variant.is_preorder,
      is_active: variant.is_active,
    }));

    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(variantData);

    if (variantError) {
      console.error("Variant creation error:", variantError);

      setFormError(
        `Product created, but its variants could not be saved: ${variantError.message}`
      );

      setSaving(false);
      await fetchProducts();
      return;
    }

    await fetchProducts();

    resetForm();
    setShowForm(false);
    setSaving(false);
  }

  return (
    <section className="products-page">
      <div className="products-heading">
        <div>
          <p>Manage your store products and inventory.</p>
        </div>

        <button
          className="add-product-btn"
          onClick={() => {
            setFormError("");
            setShowForm(true);
          }}
        >
          + Add Product
        </button>
      </div>

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

                    <td>
                      {product.categories?.[0]?.name ??
                        "Uncategorised"}
                    </td>

                    <td>{product.hair_type ?? "-"}</td>

                    <td>{variants.length}</td>

                    <td>
                      {prices.length > 0
                        ? `$${Math.min(...prices).toFixed(2)} - $${Math.max(
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

      {/* ADD PRODUCT FORM */}
      {showForm && (
        <div className="product-modal-overlay">
          <div className="product-modal">
            <div className="product-modal-header">
              <div>
                <h2>Add New Product</h2>
                 <p>Enter your product information and variants.</p>
               </div>

            <button type="button" className="close-modal" onClick={() => { resetForm(); setShowForm(false); }}>
                X
              </button>
            </div>

            <form onSubmit={handleAddProduct}>
              <div className="product-form-section">
                <h3>Basic Information</h3>

                <label>Product Name</label>
                <input type="text" value={name}
                  onChange={(e) => setName(e.target.value)} placeholder="e.g. Luxury Body Wave" required  />

                <label>Category</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select category</option>
                 {categories.map((category) => 
                 (
                    <option key={category.id} 
                    value={category.id}>
                    {category.name}
                    </option>
                  ))}
                </select>

                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this product..."
                  rows={4}
                />

                <label>Hair Type</label>
                <input
                  type="text"
                  value={hairType}
                  onChange={(e) => setHairType(e.target.value)}
                  placeholder="e.g. Human Hair"
                />

                <label>Features</label>
                <input
                  type="text"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="e.g. Natural look, Soft texture, Tangle-free"
                />

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  Active product
                </label>
              </div>

              <div className="product-form-section">
                <div className="variant-heading">
                  <h3>Product Variants</h3>

                  <button
                    type="button"
                    className="add-variant-btn"
                    onClick={addVariant}
                  >
                    + Add Variant
                  </button>
                </div>

                {variants.map((variant, index) => (
                  <div className="variant-form-card" key={index}>
                    <div className="variant-card-heading">
                      <h4>Variant {index + 1}</h4>

                      {variants.length > 1 && (
                        <button
                          type="button"
                          className="remove-variant-btn"
                          onClick={() => removeVariant(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <label>SKU</label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(index, "sku", e.target.value)
                      }
                      placeholder="Automatically generated if empty"
                    />

                    <label>Hair Length</label>
                    <input
                      type="text"
                      value={variant.length}
                      onChange={(e) =>
                        updateVariant(index, "length", e.target.value)
                      }
                      placeholder="e.g. 18 inches"
                    />

                    <label>Lace Type</label>
                    <input
                      type="text"
                      value={variant.lace_type}
                      onChange={(e) =>
                        updateVariant(index, "lace_type", e.target.value)
                      }
                      placeholder="e.g. 13x4 Lace Front"
                    />

                    <label>Density</label>
                    <input
                      type="text"
                      value={variant.density}
                      onChange={(e) =>
                        updateVariant(index, "density", e.target.value)
                      }
                      placeholder="e.g. 180%"
                    />

                    <label>Color</label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(index, "color", e.target.value)
                      }
                      placeholder="e.g. Natural Black"
                    />

                    <label>Price (USD)</label>
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

                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
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

                    <label className="checkbox-label">
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

                    <label className="checkbox-label">
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

              {formError && (
                <div className="form-error">{formError}</div>
              )}

              <div className="product-form-actions">
                <button
                  type="button"
                  className="cancel-product-btn"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-product-btn"
                  disabled={saving}
                >
                  {saving ? "Saving Product..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}