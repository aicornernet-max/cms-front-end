import type { Deal } from "../types";
import { DealRow } from "./DealRow";

interface DealsTableProps {
  deals: Deal[];
  onDeleteClick: (deal: Deal) => void;
}

const HEADERS = ["Cover", "Deal", "Tool", "Pricing", "Duration", "Status", "Actions"];

export const DealsTable = ({ deals, onDeleteClick }: DealsTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead className="bg-gray-50 text-left">
            <tr>
              {HEADERS.map((header) => (
                <th
                  key={header}
                  className="p-4 text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {deals.map((deal) => (
              <DealRow key={deal.id} deal={deal} onDeleteClick={onDeleteClick} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
