const OrdersHeader = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-3xl text-base-content flex items-center gap-3">
        Orders
      </h2>
      <p className="font-light text-base-content/60">
        Manage customer orders and track their status
      </p>
    </div>
  );
};

export default OrdersHeader;