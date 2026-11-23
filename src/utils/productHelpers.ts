import type { VariantFormData } from "../types/product";

export const emptyVariant = (): VariantFormData => ({
  sku: "",
  length: "",
  lace_type: "",
  density: "",
  color: "",
  price: "",
  stock_quantity: "0",
  is_preorder: false,
  is_active: true,
  imageFile: null,
  imagePreview: "",
});

export function generateSku(
  productName: string,
  length: string
) {
  const prefix = productName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);

  const size = length.replace(/\D/g, "") || "STD";

  const uniqueCode = crypto.randomUUID()
    .replace(/-/g, "")
    .slice(0, 4)
    .toUpperCase();

  return `${prefix}-${size}-${uniqueCode}`;
}

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}