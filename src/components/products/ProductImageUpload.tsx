import { useRef } from "react";

interface ProductImageUploadProps {
preview: string;
onImageChange: (file: File | null, preview: string) => void;
}

export default function ProductImageUpload({
preview,
onImageChange,
}: ProductImageUploadProps) {
const inputRef = useRef<HTMLInputElement | null>(null);
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Please select a JPG, PNG, or WebP image.");
    input.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image size must not exceed 5MB.");
    input.value = "";
    return;
  }

  const imagePreview = URL.createObjectURL(file);

  onImageChange(file, imagePreview);
};

const handleRemove = () => {
onImageChange(null, "");

if (inputRef.current) {
  inputRef.current.value = "";
}

};

return (
  <div className="product-image-upload">
<label>
Variant Image

    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={handleChange}
    />
  </label>
  {preview && (
    <div className="product-image-preview">
      <img
        src={preview}
        alt="Selected product"
        style={{
          width: "150px",
          height: "150px",
          objectFit: "cover",
          display: "block",
        }}
      />
      <button
        type="button"
        onClick={handleRemove}
        className="delete-button"
      >
        Remove Image
      </button>
    </div>
  )}
</div>

);
}