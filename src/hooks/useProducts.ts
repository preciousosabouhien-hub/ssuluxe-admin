import { useCallback, useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import type {
  Product,
  Category,
  ProductFormData,
} from "../types/product";

import { createSlug, generateSku } from "../utils/productHelpers";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
 const deactivateProduct = async (productId: string) => {
  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  await fetchProducts();
};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          description,
          hair_type,
          is_active,
          category:categories!products_category_id_fkey (
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

      if (error) throw error;

      setProducts((data ?? []) as unknown as Product[]);
    } catch (err) {
      console.error("Products fetch error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Categories fetch error:", error);
      throw error;
    }

    setCategories((data ?? []) as Category[]);
  }, []);

  useEffect(() => {
    fetchProducts();

    fetchCategories().catch((err) => {
      console.error("Category fetch error:", err);
    });
  }, [fetchProducts, fetchCategories]);

  async function uploadProductImage(
    file: File,
    productId: string
  ): Promise<string> {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG and WebP images are allowed.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size must not exceed 5MB.");
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${productId}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function addProduct(form: ProductFormData) {
    setSaving(true);

    try {
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert({
          name: form.name.trim(),
          slug: createSlug(form.name),
          category_id: form.categoryId || null,
          description: form.description.trim() || null,
          hair_type: form.hairType || null,
          features: form.features
            .split(",")
            .map((feature) => feature.trim())
            .filter(Boolean),
          is_active: form.isActive,
        })
        .select("id")
        .single();

      if (productError) throw productError;

      if (!newProduct) {
        throw new Error("Product could not be created.");
      }

      const variantData = await Promise.all(
        form.variants.map(async (variant) => {
          let imageUrl: string | null = null;

          if (variant.imageFile) {
            imageUrl = await uploadProductImage(
              variant.imageFile,
              newProduct.id
            );
          }

          return {
            product_id: newProduct.id,
            sku:
              variant.sku.trim() ||
              generateSku(form.name, variant.length),
            length: variant.length || null,
            lace_type: variant.lace_type || null,
            density: variant.density || null,
            color: variant.color || null,
            price: Number(variant.price),
            stock_quantity: Number(variant.stock_quantity),
            is_preorder: variant.is_preorder,
            is_active: variant.is_active,
            image_url: imageUrl,
          };
        })
      );

      const { error: variantError } = await supabase
        .from("product_variants")
        .insert(variantData);

      if (variantError) throw variantError;

      await fetchProducts();

    } finally {
      setSaving(false);
    }
  }

  return {
    products,
    categories,
    loading,
    error,
    saving,
    fetchProducts,
    fetchCategories,
    addProduct,
    deactivateProduct,
  };
}