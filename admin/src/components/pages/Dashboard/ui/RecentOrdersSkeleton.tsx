const RecentOrdersSkeleton = () => {
  return (
    <div className="overflow-x-auto bg-base-100 shadow-md border border-base-300 rounded-xl">
      <table className="table w-full">
        <thead>
          <tr className="bg-base-200">
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={6} className="text-center p-6">
              <div className="flex items-center justify-center gap-3 text-base-content">
                <span className="text-lg font-medium animate-pulse">
                  Loading orders...
                </span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-base-content/30 border-t-accent" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersSkeleton;