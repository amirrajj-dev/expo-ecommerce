import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

interface ActionBarProps {
    price : number;
    quantity : number;
    inStock : boolean;
    isPendingAddToCart : boolean;
    handleAddToCart : ()=>void;
    getCartItemQuantity: () => number
}

const ActionBar : React.FC<ActionBarProps> = ({handleAddToCart , getCartItemQuantity , inStock , isPendingAddToCart , price , quantity}) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-surface px-6 py-4 pb-8">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-text-secondary text-sm mb-1">
              Total Price
            </Text>
            <Text className="text-primary text-2xl font-bold">
              ${(price * quantity)}
            </Text>
          </View>
          <TouchableOpacity
            className={`rounded-2xl px-8 py-4 flex-row items-center ${
              !inStock ? "bg-surface" : "bg-primary"
            }`}
            activeOpacity={0.8}
            onPress={handleAddToCart}
            disabled={!inStock || isPendingAddToCart}
          >
            {isPendingAddToCart ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : getCartItemQuantity() > 0 ? (
              <Text
                className={`font-bold text-lg ${
                  !inStock ? "text-text-secondary" : "text-background"
                }`}
              >
                Already In Cart
              </Text>
            ) : (
              <>
                <Ionicons
                  name="cart"
                  size={24}
                  color={!inStock ? "#666" : "#121212"}
                />
                <Text
                  className={`font-bold text-lg ml-2 ${
                    !inStock ? "text-text-secondary" : "text-background"
                  }`}
                >
                  {!inStock ? "Out of Stock" : "Add to Cart"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
  )
}

export default ActionBar