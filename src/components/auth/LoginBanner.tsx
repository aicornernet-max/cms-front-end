import {
  ShieldCheck,
  FileText,
  FolderTree,
  Wrench,
} from "lucide-react";

export default function LoginBanner() {
  return (
    <div
      className="
      hidden
      lg:flex
      w-1/2
      flex-col
      justify-between
      rounded-l-3xl
      bg-gradient-to-br
      from-blue-600
      to-indigo-700
      p-12
      text-white
      "
    >
      <div>
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
          <ShieldCheck size={34} />
        </div>

        <h1 className="text-4xl font-bold">
           CMS
        </h1>

        <p className="mt-3 text-blue-100 text-lg">
          Content Management System
        </p>

        <p className="mt-8 leading-8 text-blue-100">
          Manage your Pages, Categories, Tools,
          Users and SEO from one professional
          dashboard.
        </p>
      </div>

      <div className="space-y-5">

        <div className="flex items-center gap-4">
          <FileText size={22} />
          <span>Manage Pages</span>
        </div>

        <div className="flex items-center gap-4">
          <FolderTree size={22} />
          <span>Manage Categories</span>
        </div>

        <div className="flex items-center gap-4">
          <Wrench size={22} />
          <span>Manage AI Tools</span>
        </div>

      </div>
    </div>
  );
}