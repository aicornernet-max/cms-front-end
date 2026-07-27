import {
  FilePlus2,
  Wrench,
  FolderPlus,
  Users,
} from "lucide-react";

import DashboardSection from "./DashboardSection";

export default function QuickActions() {
  return (
    <DashboardSection title="Quick Actions">

      <div className="grid grid-cols-2 gap-4">

        <button className="rounded-xl border p-4 hover:bg-slate-50 transition">

          <FilePlus2 className="mb-2 text-blue-600" />

          <p>New Page</p>

        </button>

        <button className="rounded-xl border p-4 hover:bg-slate-50 transition">

          <Wrench className="mb-2 text-blue-600" />

          <p>New Tool</p>

        </button>

        <button className="rounded-xl border p-4 hover:bg-slate-50 transition">

          <FolderPlus className="mb-2 text-blue-600" />

          <p>Category</p>

        </button>

        <button className="rounded-xl border p-4 hover:bg-slate-50 transition">

          <Users className="mb-2 text-blue-600" />

          <p>Users</p>

        </button>

      </div>

    </DashboardSection>
  );
}