import { Menu, Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import ProfileDropdown from "./ProfileDropdown";

type NavbarProps = {
    onMenuClick: () => void;
};

export default function Navbar({
    onMenuClick,
}: NavbarProps) {
    const { user } = useAuth();
    const [openProfile, setOpenProfile] = useState(false);

    return (
        <header className="sticky top-0 z-30 h-16 border-b bg-white">

            <div className="flex h-full items-center justify-between px-6">

                {/* Left */}

                <div className="flex items-center gap-4">

                    <button
                        onClick={onMenuClick}
                        className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
                    >
                        <Menu size={22} />
                    </button>

                    <div className="relative hidden md:block">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-80 rounded-lg border border-gray-200 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
                        />

                    </div>

                </div>

                {/* Right */}

                <div className="flex items-center gap-4">

                    <button className="relative rounded-lg p-2 hover:bg-gray-100">

                        <Bell size={20} />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

                    </button>

                    {/* Profile Button */}

                    <div className="relative">

                        <button
                            onClick={() => setOpenProfile(!openProfile)}
                            className="flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-gray-100"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">

                                {user?.name?.charAt(0).toUpperCase()}

                            </div>

                            <div className="hidden md:block">

                                <p className="font-semibold text-sm">
                                    {user?.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {user?.role}
                                </p>

                            </div>

                        </button>

                        <ProfileDropdown
                            open={openProfile}
                            onClose={() => setOpenProfile(false)}
                        />

                    </div>

                </div>

            </div>

        </header>
    );
}