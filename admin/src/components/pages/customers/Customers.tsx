import { useCustomers } from "../../../hooks/queries/customers";
import LoadingState from "./ui/LoadingState";
import CustomersHeader from "./ui/CustomerHeader";
import StatsCards from "./ui/StatsCards";
import CustomersTable from "./ui/CustomersTable";
import FooterInfo from "./ui/FooterInfo";

const Customers = () => {
  const { data: customers, isLoading } = useCustomers();

  if (isLoading) {
    return <LoadingState />;
  }

  const customerData = customers?.data || [];

  return (
    <div className="flex flex-col gap-6">
      <CustomersHeader customerCount={customerData.length} />
      <StatsCards customers={customerData} />
      <CustomersTable customers={customerData} />
      <FooterInfo customerCount={customerData.length} />
    </div>
  );
};

export default Customers;