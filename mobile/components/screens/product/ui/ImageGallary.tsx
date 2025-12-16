import { View, ScrollView, Dimensions } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { ProductImage } from "@/types/interfaces/product.interface";

interface ImageGallaryProps {
    selectedImageIndex: number;
    setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
    images : ProductImage[];

}

const ImageGallary : React.FC<ImageGallaryProps> = ({images , selectedImageIndex , setSelectedImageIndex}) => {
    const {width} = Dimensions.get('window')
  return (
    <View className="relative">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setSelectedImageIndex(index);
        }}
      >
        {images.map((productImg: ProductImage, index: number) => (
          <View key={index} style={{ width }}>
            <Image
              source={{ uri: productImg.imageUrl }}
              style={{ width, height: 400 }}
              contentFit="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Image Indicators */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
        {images.length > 1 &&
          images.map((_: any, index: number) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === selectedImageIndex
                  ? "bg-primary w-6"
                  : "bg-white/50 w-2"
              }`}
            />
          ))}
      </View>
    </View>
  );
};

export default ImageGallary;
