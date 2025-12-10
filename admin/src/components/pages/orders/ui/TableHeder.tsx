import { Hash, User, ShoppingBag, DollarSign, Package, Calendar } from "lucide-react";

const TableHeader = () => {
  return (
    <thead className="bg-base-300/50">
      <tr>
        <HeaderCell icon={<Hash className="h-4 w-4" />} text="Order ID" />
        <HeaderCell icon={<User className="h-4 w-4" />} text="Customer" />
        <HeaderCell icon={<ShoppingBag className="h-4 w-4" />} text="Items" />
        <HeaderCell icon={<DollarSign className="h-4 w-4" />} text="Total" />
        <HeaderCell icon={<Package className="h-4 w-4" />} text="Status" />
        <HeaderCell icon={<Calendar className="h-4 w-4" />} text="Date" />
      </tr>
    </thead>
  );
};

interface HeaderCellProps {
  icon: React.ReactNode;
  text: string;
}

const HeaderCell = ({ icon, text }: HeaderCellProps) => {
  return (
    <th className="text-base-content/70 font-semibold">
      <div className="flex items-center gap-2">
        {icon}
        {text}
      </div>
    </th>
  );
};

export default TableHeader;