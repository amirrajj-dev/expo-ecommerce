import { View, Text } from 'react-native'
import React from 'react'
import SafeScreen from '@/components/SafeScreen'
import AddressesHeader from './AddressFormHeader'
import { Ionicons } from '@expo/vector-icons'

const ErrorState = () => {
  return (
  <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Failed to load addresses
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Please check your connection and try again
        </Text>
      </View>
    </SafeScreen>
  )
}

export default ErrorState