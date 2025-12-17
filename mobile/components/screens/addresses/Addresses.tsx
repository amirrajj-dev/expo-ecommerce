import AddressCard from "./ui/AddressCard";
import AddressesHeader from "./ui/AddressFormHeader";
import AddressFormModal from "./ui/AddressFormModal";
import SafeScreen from "@/components/SafeScreen";
import { useAddresses } from "@/hooks/queries/addresses";
import { Address } from "@/types/interfaces/user.interface";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAddAddress } from "@/hooks/mutations/add-address";
import { useDeleteAddress } from "@/hooks/mutations/delete-address";
import { useUpdateAddress } from "@/hooks/mutations/update-address";
import ErrorState from "./ui/ErrorState";
import LoadingState from "@/components/shared/LoadingState";

const Addresses = () => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const { data: addressesData, isError, isLoading } = useAddresses();
  const { mutate: addAddress, isPending: isPendingAddAddress } =
    useAddAddress();
  const { mutate: deleteAddress, isPending: isPendingDeleteAddress } =
    useDeleteAddress();
  const { mutate: updateAddress, isPending: isPendingUpdateAddress } =
    useUpdateAddress(editingAddressId as string);
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    isDefault: false,
  });
  const addresses = addressesData?.data || [];
  const handleAddAddress = () => {
    setShowAddressForm(true);
    setEditingAddressId(null);
    setAddressForm({
      label: "",
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      isDefault: false,
    });
  };

  const handleEditAddress = (address: Address) => {
    setShowAddressForm(true);
    setEditingAddressId(address._id as string);
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phoneNumber: address.phoneNumber,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = (addressId: string, label: string) => {
    Alert.alert("Delete Address", `Are you sure you want to delete ${label}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteAddress(addressId),
      },
    ]);
  };
  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  const handleSaveAddress = () => {
    if (
      !addressForm.label ||
      !addressForm.fullName ||
      !addressForm.streetAddress ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.zipCode ||
      !addressForm.phoneNumber
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (editingAddressId) {
      updateAddress(addressForm, {
        onSuccess: () => {
          handleCloseAddressForm();
        },
        onError: () => {
          handleCloseAddressForm();
        },
      });
    } else {
      addAddress(addressForm, {
        onSuccess: () => {
          handleCloseAddressForm();
        },
        onError: () => {
          handleCloseAddressForm();
        },
      });
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        useSafeScreen
        header={<AddressesHeader />}
        text="Loading addresses..."
        containerClassName="flex-1 items-center justify-center px-6"
      />
    );
  }
  if (isError) {
    return <ErrorState />;
  }

  return (
    <SafeScreen>
      <AddressesHeader />

      {addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location-outline" size={80} color="#666" />
          <Text className="text-text-primary font-semibold text-xl mt-4">
            No addresses yet
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Add your first delivery address
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.8}
            onPress={handleAddAddress}
          >
            <Text className="text-background font-bold text-base">
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                isUpdatingAddress={isPendingUpdateAddress}
                isDeletingAddress={isPendingDeleteAddress}
              />
            ))}

            <TouchableOpacity
              className="bg-primary rounded-2xl py-4 items-center mt-2"
              activeOpacity={0.8}
              onPress={handleAddAddress}
            >
              <View className="flex-row items-center">
                <Ionicons name="add-circle-outline" size={24} color="#121212" />
                <Text className="text-background font-bold text-base ml-2">
                  Add New Address
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <AddressFormModal
        visible={showAddressForm}
        isEditing={!!editingAddressId}
        addressForm={addressForm}
        isAddingAddress={isPendingAddAddress}
        isUpdatingAddress={isPendingUpdateAddress}
        onClose={handleCloseAddressForm}
        onSave={handleSaveAddress}
        onFormChange={setAddressForm}
      />
    </SafeScreen>
  );
};
export default Addresses;
