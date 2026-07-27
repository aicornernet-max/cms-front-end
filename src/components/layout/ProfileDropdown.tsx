import { useEffect, useRef } from "react";
import {
  User,
  Settings,
  KeyRound,
  Monitor,
  LogOut,
  Globe,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileDropdown({
  open,
  onClose,
}: Props) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [onClose]);

  if (!open) return null;

  async function handleLogout() {
    await logout();
    navigate("/login", {
      replace: true,
    });
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-14 w-72 rounded-2xl border bg-white shadow-xl"
    >
      {/* Header */}

      <div className="border-b p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>

            <h3 className="font-semibold">
              {user?.name}
            </h3>

            <p className="text-sm text-gray-500">
              {user?.email}
            </p>

            <span className="text-xs text-blue-600">
              {user?.role}
            </span>

          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="p-2">

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100">
          <User size={18} />
          View Profile
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100">
          <Settings size={18} />
          Account Settings
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100">
          <KeyRound size={18} />
          Change Password
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100">
          <Monitor size={18} />
          Active Sessions
        </button>

      </div>

      <div className="border-t p-2">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>

        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100"
        >
          <Globe size={18} />
          Logout All Devices
        </button>

      </div>
    </div>
  );
}