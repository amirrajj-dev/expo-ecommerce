interface CustomersHeaderProps {
  customerCount: number;
}

const CustomersHeader = ({ customerCount }: CustomersHeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-3xl text-base-content flex items-center gap-3">
        Customers
      </h2>
      <p className="font-light text-base-content/60">
        {customerCount} customer{customerCount !== 1 ? "s" : ""} registered
      </p>
    </div>
  );
};

export default CustomersHeader;