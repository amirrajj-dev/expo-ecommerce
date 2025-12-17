import { useApi } from "@/libs/axios";
import { CreateReviewDto } from "@/types/dtos/create-review.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import type { Product } from "@/types/interfaces/product.interface";
import type { ApiResponse } from "@/types/api/api.interface";
import type { Review } from "@/types/interfaces/review.interface";
import { AxiosError } from "axios";

export const useCreateReview = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewDto) => {
      const res = await api.post<
        ApiResponse<{ review: Review; updatedProduct: Product }>
      >("/reviews", reviewData);
      return res.data;
    },

    onMutate: async (reviewData: CreateReviewDto) => {
      const { productId, orderId, rating } = reviewData;

      await queryClient.cancelQueries({ queryKey: ["product", productId] });
      await queryClient.cancelQueries({ queryKey: ["products"] });
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      const previousProduct = queryClient.getQueryData<ApiResponse<Product>>([
        "products",
        productId,
      ]);
      const previousProducts = queryClient.getQueryData<ApiResponse<Product[]>>(
        ["products"]
      );

      queryClient.setQueryData<ApiResponse<Product>>(
        ["products", productId],
        (old) => {
          if (!old?.data) return old;

          const currentTotalReviews = old.data.totalReviews || 0;
          const currentRatingSum = old.data.ratingSum || 0;
          const newTotalReviews = currentTotalReviews + 1;
          const newRatingSum = currentRatingSum + rating;
          const newAverageRating = newRatingSum / newTotalReviews;

          return {
            ...old,
            data: {
              ...old.data,
              averageRating: parseFloat(newAverageRating.toFixed(1)),
              totalReviews: newTotalReviews,
              ratingSum: newRatingSum,
            },
          };
        }
      );

      // update in products list if cached
      queryClient.setQueryData<ApiResponse<Product[]>>(["products"], (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((product) => {
            if (product._id === productId) {
              const currentTotalReviews = product.totalReviews || 0;
              const currentRatingSum = product.ratingSum || 0;
              const newTotalReviews = currentTotalReviews + 1;
              const newRatingSum = currentRatingSum + rating;
              const newAverageRating = newRatingSum / newTotalReviews;

              return {
                ...product,
                averageRating: parseFloat(newAverageRating.toFixed(1)),
                totalReviews: newTotalReviews,
                ratingSum: newRatingSum,
              };
            }
            return product;
          }),
        };
      });

      // Optimistically mark order item as reviewed
      queryClient.setQueryData<ApiResponse<any>>(["orders", orderId], (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((item: any) => {
              if (
                item.product?._id === productId ||
                item.product === productId
              ) {
                return {
                  ...item,
                  reviewed: true,
                  reviewRating: rating, // Store rating for UI
                };
              }
              return item;
            }),
          },
        };
      });

      return {
        previousProduct,
        previousProducts,
        productId,
        orderId,
      };
    },

    onSuccess: (response, reviewData, context) => {
      console.log(response);
      console.log(reviewData);
      const { productId } = reviewData;
      const { updatedProduct } = response.data!;

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Review added successfully",
      });

      // Update cache with server response
      queryClient.setQueryData<ApiResponse<Product>>(
        ["products", productId],
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: updatedProduct,
          };
        }
      );

      queryClient.setQueryData<ApiResponse<Product[]>>(["products"], (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((product) =>
            product._id === productId ? updatedProduct : product
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onError: (error: AxiosError<{ message: string }>, reviewData, context) => {
      console.log(error.message);
      console.log(error.response?.data.message);
      const { productId } = reviewData;

      // Revert optimistic updates
      if (context?.previousProduct) {
        queryClient.setQueryData(
          ["products", productId],
          context.previousProduct
        );
      }

      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data.message ||
          error.message ||
          "failed to add review",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
