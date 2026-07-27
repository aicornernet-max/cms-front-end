import {
  FileText,
  Wrench,
  Users,
  Mail,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader";
import StatCard from "../components/dashboard/StatCard";

import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome to AI Corner CMS"
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Pages"
          value={236}
          icon={FileText}
          change="+8 this week"
        />

        <StatCard
          title="Tools"
          value={1346}
          icon={Wrench}
          change="+14 this week"
        />

        <StatCard
          title="Users"
          value={18}
          icon={Users}
          change="+2 today"
        />

        <StatCard
          title="Subscribers"
          value={2450}
          icon={Mail}
          change="+48 today"
        />

      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <RecentActivity />

        <QuickActions />

      </div>
    </>
  );
}