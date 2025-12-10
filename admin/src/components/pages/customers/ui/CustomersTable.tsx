import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import EmptyState from "./EmptyState";
import type { User } from "../../../../types/interfaces/user.interface";

interface CustomersTableProps {
  customers: User[];
}

const CustomersTable = ({ customers }: CustomersTableProps) => {
  return (
    <div className="bg-linear-to-br from-base-100 to-base-200 border border-base-300 rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <TableHeader />
          <tbody>
            {customers.map((customer) => (
              <TableRow key={customer._id} customer={customer} />
            ))}

            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersTable;