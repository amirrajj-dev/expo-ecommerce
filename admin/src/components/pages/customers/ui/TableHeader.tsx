import { User, Mail, MapPin, Heart, Calendar } from "lucide-react";

const TableHeader = () => {
  const headers = [
    { icon: <User className="h-4 w-4" />, text: "Customer" },
    { icon: <Mail className="h-4 w-4" />, text: "Email" },
    { icon: <MapPin className="h-4 w-4" />, text: "Addresses" },
    { icon: <Heart className="h-4 w-4" />, text: "Wishlist" },
    { icon: <Calendar className="h-4 w-4" />, text: "Joined" },
  ];

  return (
    <thead className="bg-base-300/50">
      <tr>
        {headers.map((header, index) => (
          <HeaderCell key={index} icon={header.icon} text={header.text} />
        ))}
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