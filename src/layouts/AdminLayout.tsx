import { Outlet, Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "../api/axios"

export default function AdminLayout() {

    const user = JSON.parse(localStorage.getItem("user") || "{}")


    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = async () => {
        try {
            const res = await axios.post("/auth/logout")

            if (res.data.success) {
                navigate("/login")
            }
        } catch (err: any) {
            console.error(err.response?.data || err)
        }
    }

    return (
        <div className="flex h-screen overflow-hidden">

            {/* MOBILE OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <div
                className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-md p-4 flex flex-col justify-between transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div>

                    <h2 className="text-xl font-bold mb-6">
                        CMS
                    </h2>

                    <nav className="space-y-3">

                        <Link
                            to="/"
                            className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/users"
                            className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                            Users
                        </Link>

                        <Link
                            to="/pages"
                            className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                            Pages
                        </Link>

                        <Link
                            to="/tools"
                            className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                            Tools
                        </Link>

                        <Link
                            to="/categories"
                            className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                            Categories
                        </Link>
                        <Link
                            to="/AlternativeList"
                            className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                            AlternativeList
                        </Link>

                        <Link
                            to="/subscribers"
                            className="block px-3 py-2 rounded hover:bg-gray-100"
                        >
                            Subscribers
                        </Link>

                    </nav>

                </div>
                <div className="border-t pt-4 mt-4">
                    <p className="font-semibold">
                        {user.name}
                    </p>

                    <p className="text-sm text-gray-500">
                        {user.email}
                    </p>

                    <p className="text-xs bg-blue-100 text-blue-700 inline-block px-2 py-1 rounded mt-2">
                        {user.role}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                >
                    Logout
                </button>
            </div>

            {/* MAIN */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50">

                {/* MOBILE HEADER */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">

                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-xl"
                    >
                        ☰
                    </button>

                    <h1 className="font-bold">
                        CMS
                    </h1>

                </div>

                {/* PAGE CONTENT */}
                <div className="p-4 md:p-6">
                    <Outlet />
                </div>

            </div>

        </div>
    )
}