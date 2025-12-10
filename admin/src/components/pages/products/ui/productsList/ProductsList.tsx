import { useProducts } from "../../../../../hooks/queries/products";
import { Loader2, AlertCircle } from "lucide-react";
import ProductCard from "./ui/ProductCard";
import { useState } from "react";
import EditProductForm from "./ui/EditProductForm/EditProductForm";
import type { Product } from "../../../../../types/interfaces/product.interface";
import DeleteProductForm from "./ui/deleteProductForm/DeleteProductForm";

const ProductsList = () => {
  const { data: products, isLoading, isError } = useProducts();
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add this state
  const [product, setProduct] = useState<Product | null>(null);

  const openModal = (product: Product, type: "edit" | "delete") => {
    setProduct(product);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
      setProduct(null);
      setModalType(null);
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-accent h-12 w-12" />
        <p className="text-base-content/70 text-lg font-medium">
          Loading products...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-8">
        <AlertCircle className="h-16 w-16 text-error" />
        <h3 className="text-2xl font-bold text-error">
          Failed to load products
        </h3>
        <p className="text-base-content/70 max-w-md">
          There was an issue loading the product catalog. Please try again
          later.
        </p>
      </div>
    );

  return (
    <div>
      <div className="flex flex-col gap-6">
        {products?.data?.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            openModal={openModal}
            setProduct={setProduct}
          />
        ))}
      </div>

      {isModalOpen && product && modalType === "edit" && (
        <EditProductForm
          product={product as Product}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
      {isModalOpen && product && modalType === "delete" && (
        <DeleteProductForm
          product={product}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ProductsList;
