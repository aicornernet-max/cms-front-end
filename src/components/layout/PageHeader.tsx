import { useAuth } from "../../context/AuthContext";

type Props = {
  title: string;
  description?: string;
};

export default function PageHeader({
  title,
  description,
}: Props) {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mb-8 flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-1 text-gray-500">
          {description ??
            `Welcome back, ${user?.name} 👋`}
        </p>

      </div>

      <div className="rounded-xl border bg-white px-5 py-3 shadow-sm">

        <p className="text-xs uppercase tracking-wide text-gray-400">
          Today
        </p>

        <p className="font-medium">
          {today}
        </p>

      </div>

    </div>
  );
}