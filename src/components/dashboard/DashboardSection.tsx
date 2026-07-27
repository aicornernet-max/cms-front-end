type Props = {
  title: string;
  children: React.ReactNode;
};

export default function DashboardSection({
  title,
  children,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b px-6 py-4">

        <h2 className="text-lg font-semibold">
          {title}
        </h2>

      </div>

      <div className="p-6">

        {children}

      </div>

    </div>
  );
}