import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const LoadingState = () => {
  return (
      <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#1DB954" />
      <Text className="text-text-secondary mt-4">Loading cart...</Text>
    </View>
  )
}

export default LoadingState