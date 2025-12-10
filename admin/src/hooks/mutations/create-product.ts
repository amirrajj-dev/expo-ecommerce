import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../helpers/api.helper";
import type { Product } from "../../types/interfaces/product.interface";
import type { ApiResponse } from "../../types/api/api.interface";
import { toast } from "sonner";
import type { DashboardStats } from "../../types/interfaces/dashboard.interface";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => adminApi.createProduct(formData),
    onMutate: async (formData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot previous state
      const previousProducts = queryClient.getQueryData<ApiResponse<Product[]>>(
        ["products"]
      );

      // Extract and validate product data from FormData
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const priceStr = formData.get("price") as string;
      const stockStr = formData.get("stock") as string;
      const category = formData.get("category") as string;
      const imageFiles = formData.getAll("images") as File[];
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          // Create object URL for immediate preview
          return URL.createObjectURL(file);
        })
      );

      // Validate required fields
      if (!name || !description || !priceStr || !stockStr || !category) {
        throw new Error("Missing required fields");
      }

      const price = parseFloat(priceStr);
      const stock = parseInt(stockStr);

      if (isNaN(price) || isNaN(stock)) {
        throw new Error("Invalid price or stock value");
      }

      // Create optimistic product
      const tempId = `temp-${Date.now()}`;
      const tempProduct: Product = {
        _id: tempId,
        name,
        description,
        price,
        stock,
        category,
        averageRating: 0,
        totalReviews: 0,
        ratingSum: 0,
        images: imageUrls.map((url) => ({
          imageUrl: url,
          publicId: "temp", // temporary publicId
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically add to cache
      queryClient.setQueryData<ApiResponse<Product[]>>(["products"], (old) => {
        if (!old?.data) {
          return {
            success: true,
            message: "Products fetched successfully",
            data: [tempProduct],
            statusCode: 200,
            timestamp: new Date().toISOString(),
            path: "/admin/products",
          };
        }
        return {
          ...old,
          data: [tempProduct, ...old.data],
        };
      });

      queryClient.setQueryData<ApiResponse<DashboardStats>>(
        ["dashboard"],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              totalProducts: old.data.totalProducts + 1,
            },
          };
        }
      );

      return { previousProducts, tempId };
    },
    onSuccess: (response, _variables, context) => {
      // Clean up object URLs after successful upload
      const previousProducts = context?.previousProducts?.data;
      if (previousProducts) {
        const tempProduct = previousProducts.find(
          (p) => p._id === context.tempId
        );
        tempProduct?.images?.forEach((img) => {
          if (img.publicId === "temp") {
            URL.revokeObjectURL(img.imageUrl);
          }
        });
      }

      toast.success(`Product "${response.data?.name}" created successfully`);
      // Update cache with real product data
      queryClient.setQueryData<ApiResponse<Product[]>>(["products"], (old) => {
        if (!old?.data) {
          return {
            success: true,
            message: "Products fetched successfully",
            data: response.data ? [response.data] : [],
            statusCode: response.statusCode,
            timestamp: response.timestamp,
            path: response.path,
          };
        }

        // Replace temp product with real product using the stored tempId
        return {
          ...old,
          data: old.data.map((p) =>
            p._id === context?.tempId ? response.data! : p
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onError: (error: Error, _variables, context) => {
      console.log(error);
      // Clean up object URLs on error too
      const previousProducts = context?.previousProducts?.data;
      if (previousProducts) {
        const tempProduct = previousProducts.find(
          (p) => p._id === context?.tempId
        );
        tempProduct?.images?.forEach((img) => {
          if (img.publicId === "temp") {
            URL.revokeObjectURL(img.imageUrl);
          }
        });
      }

      // Revert optimistic update
      queryClient.setQueryData(["products"], context?.previousProducts);
      toast.error(error.message || "Failed to create product");
    },
    onSettled: () => {
      // refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
