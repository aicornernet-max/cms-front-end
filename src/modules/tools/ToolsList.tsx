import { useEffect, useState } from "react"
import axios from "../../api/axios"
import { useNavigate } from "react-router-dom"

export default function ToolsList() {
  const [tools, setTools] = useState<any[]>([])

  // ALERT MESSAGE
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("")

  // DELETE MODAL
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const navigate = useNavigate()

  const fetchTools = async () => {
    try {
      const res = await axios.get(
        `/tools?search=${search}`
      )

      setTools(res.data.data || [])

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTools()
  }, [])

  useEffect(() => {

    const delay = setTimeout(() => {
      fetchTools()
    }, 400)

    return () => clearTimeout(delay)

  }, [search])

  // FINAL DELETE
  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      const res = await axios.delete(`/tools/${deleteId}`)

      setMessage(res.data.message)
      setMessageType("success")

      fetchTools()
    } catch (err: any) {
      console.error(err)

      setMessage(
        err?.response?.data?.message ||
        "Failed to delete tool"
      )

      setMessageType("error")
    }

    setDeleteId(null)

    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 5000)
  }

  return (
    <div className="px-4 sm:px-6">

      {/* SUCCESS / ERROR MESSAGE */}
      {message && (
        <div
          className={`mb-4 p-3 sm:p-4 rounded-xl border text-sm ${messageType === "success"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-700 border-red-200"
            }`}
        >
          {message}
        </div>
      )}

      {/* HEADER */}

      {/* SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={fetchTools}
          className="bg-black text-white px-5 py-2 rounded-xl w-full sm:w-auto"
        >
          Search
        </button>

      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          Tools
        </h1>

        <button
          onClick={() => navigate("/tools/new")}
          className="bg-black text-white px-4 py-2 rounded-xl w-full sm:w-auto"
        >
          + Create Tool
        </button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tools.map((tool) => (
              <tr key={tool._id} className="border-t">
                <td className="p-4">{tool.name}</td>

                <td className="p-4 text-gray-500">
                  {tool.brand}
                </td>

                <td className="p-4 space-x-4">
                  <button
                    onClick={() =>
                      navigate(`/tools/edit/${tool._id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteId(tool._id)
                    }
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {tools.map((tool) => (
          <div
            key={tool._id}
            className="bg-white p-4 rounded-xl shadow border"
          >
            <p className="font-semibold text-sm">
              {tool.name}
            </p>

            <p className="text-gray-500 text-sm">
              {tool.brand}
            </p>

            <div className="flex gap-4 mt-3">
              <button
                onClick={() =>
                  navigate(`/tools/edit/${tool._id}`)
                }
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  setDeleteId(tool._id)
                }
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl">

            <h2 className="text-lg sm:text-xl font-semibold mb-3">
              Delete Tool
            </h2>

            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Are you sure you want to delete this tool?
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white w-full sm:w-auto"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}