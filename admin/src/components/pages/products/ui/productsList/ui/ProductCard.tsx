import { Package, Pen, Tag, Trash2 } from "lucide-react";
import type { Product } from "../../../../../../types/interfaces/product.interface";

interface ProductCardProps {
  product: Product;
  openModal: (product: Product, type: "edit" | "delete") => void;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const ProductCard = ({ product, openModal }: ProductCardProps) => {
  return (
    <div
      key={product._id}
      className="group bg-linear-to-br from-base-100 to-base-200 border border-base-300 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Card Header with linear */}
      <div className="bg-linear-to-r from-accent/10 via-secondary/10 to-accent/10 p-5 border-b border-base-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Package className="h-5 w-5 text-accent" />
            </div>
            <h2 className="card-title text-xl font-bold text-base-content">
              {product.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-success">
              ${product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Product Image */}
          <div className="md:w-1/4">
            <div className="relative overflow-hidden rounded-xl border-2 border-base-300 group-hover:border-accent/30 transition-colors duration-300">
              <img
                src={product.images[0].imageUrl}
                alt={product.name}
                className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-base-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-3/4">
            <div className="space-y-5">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-base-content/50 mb-2">
                  Description
                </h3>
                <p className="text-base-content/80 text-sm leading-relaxed">
                  {product.description.length > 200
                    ? product.description.slice(0, 200) + "..."
                    : product.description}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Category */}
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Tag className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50">Category</p>
                    <p className="font-medium capitalize text-base-content">
                      {product.category}
                    </p>
                  </div>
                </div>

                {/* Stock */}
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Package className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-base-content/50">Stock</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-base-content">
                        {product.stock} units
                      </p>
                      <div
                        className={`badge ${
                          product.stock <= 5
                            ? "badge-error text-error-content"
                            : product.stock <= 20
                            ? "badge-warning text-warning-content"
                            : "badge-success text-success-content"
                        }`}
                      >
                        {product.stock <= 5
                          ? "Low"
                          : product.stock <= 20
                          ? "Medium"
                          : "High"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Progress Bar */}
                <div className="sm:col-span-2 lg:col-span-1 p-3 bg-base-200 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Stock Level</span>
                      <span className="font-medium">{product.stock} / 100</span>
                    </div>
                    <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          product.stock <= 5
                            ? "bg-error"
                            : product.stock <= 20
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        style={{
                          width: `${Math.min(
                            (product.stock / 100) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-5 border-t border-base-300 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-base-content/70">
                Product ID:{" "}
                <span className="font-mono text-xs bg-base-300 px-2 py-1 rounded">
                  {product._id.slice(-8)}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openModal(product, "edit")}
                  className="group relative btn btn-info btn-sm btn-soft"
                >
                  <Pen size={18} className="relative z-10" />
                </button>
                <button
                  onClick={() => openModal(product, "delete")}
                  className="btn btn-sm btn-error btn-soft"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
