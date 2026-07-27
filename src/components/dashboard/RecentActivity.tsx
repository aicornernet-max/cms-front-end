import DashboardSection from "./DashboardSection";

const activities = [
  {
    id: 1,
    title: "New page published",
    time: "5 min ago",
  },
  {
    id: 2,
    title: "AI Tool updated",
    time: "20 min ago",
  },
  {
    id: 3,
    title: "New subscriber",
    time: "1 hour ago",
  },
  {
    id: 4,
    title: "Admin logged in",
    time: "Today",
  },
];

export default function RecentActivity() {
  return (
    <DashboardSection title="Recent Activity">

      <div className="space-y-4">

        {activities.map((item) => (

          <div
            key={item.id}
            className="flex justify-between border-b pb-3 last:border-0"
          >

            <p>{item.title}</p>

            <span className="text-sm text-gray-500">
              {item.time}
            </span>

          </div>

        ))}

      </div>

    </DashboardSection>
  );
}