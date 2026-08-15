import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    FileText,
    Wrench,
    FolderTree,
    Mail,
    Sparkles,
    X,
    ChevronDown,
    ChevronRight,
    History,
    UserRoundPen,
} from "lucide-react";

type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

const menu = [
    {
        title: "MAIN",
        items: [
            {
                name: "Dashboard",
                path: "/",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "CONTENT",
        items: [
            {
                name: "Pages",
                path: "/pages",
                icon: FileText,
            },
            {
                name: "Tools",
                path: "/tools",
                icon: Wrench,
            },
            {
                name: "Categories",
                path: "/categories",
                icon: FolderTree,
            },
            {
                name: "Author Profiles",
                path: "/admin/authors",
                icon: UserRoundPen,
            },
        ],
    },
    {
        title: "USERS",
        items: [
            {
                name: "Users",
                path: "/users",
                icon: Users,
            },
            {
                name: "Subscribers",
                path: "/subscribers",
                icon: Mail,
            },
            {
                name: "LoginActivityList",
                path: "/LoginActivityList",
                icon: History,
            },
        ],
    },
    {
        title: "SEO",
        items: [
            {
                name: "Alternative List",
                path: "/AlternativeList",
                icon: Sparkles,
            },
        ],
    },
];

export default function Sidebar({
    open,
    onClose,
}: SidebarProps) {
    const [pinnedSections, setPinnedSections] = useState<
        Record<string, boolean>
    >({
        MAIN: true,
        CONTENT: true,
        USERS: false,
        SEO: false,
    });

    const [hoverSection, setHoverSection] = useState<string | null>(null);

    const toggleSection = (title: string) => {
        setPinnedSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const isOpen = (title: string) =>
        pinnedSections[title] || hoverSection === title;

    return (
        <>
            {/* Mobile Overlay */}

            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
    fixed left-0 top-0 z-50
    flex h-full w-64 flex-col
    bg-white
    border-r border-slate-200
    text-slate-900
    shadow-sm
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:static md:translate-x-0
  `}
            >
                {/* Logo */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            AI Corner
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                            Content Management
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}

                <div className="flex-1 overflow-y-auto px-4 py-5">
                    {menu.map((section) => (
                        <div
                            key={section.title}
                            className="mb-5"
                            onMouseEnter={() =>
                                setHoverSection(section.title)
                            }
                            onMouseLeave={() =>
                                setHoverSection(null)
                            }
                        >
                            {/* Section Header */}

                            <button
                                onClick={() =>
                                    toggleSection(section.title)
                                }
                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                <span>{section.title}</span>

                                {isOpen(section.title) ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>

                            {/* Section Items */}

                            <div
                                className={`overflow-hidden transition-all duration-300 ${isOpen(section.title)
                                    ? "mt-2 max-h-96 opacity-100"
                                    : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                onClick={onClose}
                                            >
                                                {({ isActive }) => (
                                                    <div
                                                        className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 ${isActive
                                                            ? "bg-slate-900 text-white"
                                                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                                            }`}
                                                    >
                                                        <Icon
                                                            size={18}
                                                            className={`transition-colors duration-200 ${isActive
                                                                ? "text-white"
                                                                : "text-slate-500 group-hover:text-slate-900"
                                                                }`}
                                                        />

                                                        <span className="font-medium">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                )}
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}

                <div className="border-t border-slate-200 p-5">
                    <p className="font-semibold text-slate-900">
                        AI Corner CMS
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Content Management System
                    </p>
                </div>
            </aside>
        </>
    );
}