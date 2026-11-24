interface ProductStatusProps {
  isActive: boolean;
}

export default function ProductStatus({
  isActive,
}: ProductStatusProps) {
  return (
    <span
      className={`product-status ${
        isActive ? "active" : "inactive"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}