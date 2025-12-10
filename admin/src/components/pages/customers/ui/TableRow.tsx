import type { User } from "../../../../types/interfaces/user.interface";
import { formatDate, getTimeSince } from "../utils/formatters";

interface TableRowProps {
  customer: User;
}

const TableRow = ({ customer }: TableRowProps) => {
  return (
    <tr className="hover:bg-base-300/30 transition-colors border-b border-base-300 last:border-b-0">
      <CustomerCell customer={customer} />
      <EmailCell email={customer.email} />
      <AddressesCell addresses={customer.addresses} />
      <WishlistCell wishlist={customer.wishlist} />
      <JoinedDateCell createdAt={customer.createdAt} />
    </tr>
  );
};

// Sub-components for each cell

interface CustomerCellProps {
  customer: User;
}

const CustomerCell = ({ customer }: CustomerCellProps) => (
  <td>
    <div className="flex items-center gap-3">
      <div className="avatar">
        <div className="w-10 h-10 rounded-full border-2 border-base-300">
          <img
            src={customer.imageUrl}
            alt={customer.name}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{customer.name}</span>
      </div>
    </div>
  </td>
);

interface EmailCellProps {
  email: string;
}

const EmailCell = ({ email }: EmailCellProps) => (
  <td>
    <div className="flex flex-col">
      <span className="font-medium">{email}</span>
    </div>
  </td>
);

interface AddressesCellProps {
  addresses: any[];
}

const AddressesCell = ({ addresses }: AddressesCellProps) => {
  const hasAddresses = addresses.length > 0;
  
  return (
    <td>
      <div className="flex items-center gap-2">
        <div className={`badge ${hasAddresses ? "badge-info" : "badge-neutral"}`}>
          {addresses.length} {addresses.length === 1 ? "address" : "addresses"}
        </div>
        {!hasAddresses && (
          <span className="text-xs text-base-content/50">No addresses saved</span>
        )}
      </div>
    </td>
  );
};

interface WishlistCellProps {
  wishlist: any[];
}

const WishlistCell = ({ wishlist }: WishlistCellProps) => {
  const hasWishlist = wishlist.length > 0;
  
  return (
    <td>
      <div className="flex items-center gap-2">
        <div className={`badge ${hasWishlist ? "badge-accent" : "badge-neutral"}`}>
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </div>
        {!hasWishlist && (
          <span className="text-xs text-base-content/50">Empty wishlist</span>
        )}
      </div>
    </td>
  );
};

interface JoinedDateCellProps {
  createdAt: string;
}

const JoinedDateCell = ({ createdAt }: JoinedDateCellProps) => (
  <td>
    <div className="flex flex-col">
      <span className="font-medium">{formatDate(createdAt)}</span>
      <span className="text-xs text-base-content/60">
        {getTimeSince(createdAt)}
      </span>
    </div>
  </td>
);

export default TableRow;