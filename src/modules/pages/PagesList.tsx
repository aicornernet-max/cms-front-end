import { useEffect, useState } from "react"
import axios from "../../api/axios"
import StatusBadge from "../../components/ui/StatusBadge"
import { useNavigate } from "react-router-dom"
import {
  Pencil,
  Eye,
  Trash2,
  Globe,
  GlobeLock,
  X,
} from "lucide-react"

type Page = {
  _id: string
  title: string
  slug: string
  categoryId?: {
    slug: string
  }
  status: "draft" | "published" | "unpublished"
}

export default function PagesList() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean
    id: string | null
    title: string
  }>({
    open: false,
    id: null,
    title: "",
  })

  const navigate = useNavigate()

  // FETCH
  const fetchPages = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
  `/pages?search=${search}`
)
      setPages(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  useEffect(() => {

  const delay = setTimeout(() => {
    fetchPages()
  }, 400)

  return () => clearTimeout(delay)

}, [search])

  // STATUS TOGGLE
  const toggleStatus = async (page: Page) => {
    try {
      const newStatus =
        page.status === "published" ? "unpublished" : "published"

      await axios.patch(`/pages/${page._id}/status`, {
        status: newStatus,
      })

      fetchPages()
    } catch (err) {
      console.error(err)
    }
  }

  // DELETE
  const openDeleteModal = (id: string, title: string) => {
    setDeleteModal({ open: true, id, title })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, id: null, title: "" })
  }

  const confirmDelete = async () => {
    try {
      if (!deleteModal.id) return
      await axios.delete(`/pages/${deleteModal.id}`)
      fetchPages()
      closeDeleteModal()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Pages
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and organize all your pages
          </p>
        </div>

        <button
          onClick={() => navigate("/pages/new")}
          className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl w-full sm:w-auto text-sm font-medium"
        >
          + Create Page
        </button>
      </div>

      {/* LOADING */}

      {/* SEARCH */}
<div className="flex flex-col sm:flex-row gap-3">

  <input
    type="text"
    placeholder="Search pages..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
  />

  <button
    onClick={fetchPages}
    className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl w-full sm:w-auto text-sm font-medium"
  >
    Search
  </button>

</div>
      {loading ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
          <p className="text-gray-500">Loading pages...</p>
        </div>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-5 text-left text-sm font-semibold text-gray-600">Title</th>
                  <th className="p-5 text-left text-sm font-semibold text-gray-600">URL</th>
                  <th className="p-5 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-5 text-right text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>

              <tbody>
                {pages.map((page) => (
                  <tr key={page._id} className="border-t hover:bg-gray-50">
                    <td className="p-5">
                      <h2 className="font-semibold text-gray-900">{page.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">Page Content</p>
                    </td>

                    <td className="p-5">
                      <div className="bg-gray-100 inline-block px-3 py-1 rounded-lg text-sm text-gray-700 break-all max-w-xs">
                        /{page.categoryId?.slug}/{page.slug}
                      </div>
                    </td>

                    <td className="p-5">
                      <StatusBadge status={page.status} />
                    </td>

                    <td className="p-5">
                      <div className="flex justify-end gap-2 flex-wrap">

                        <button
                          onClick={() => navigate(`/pages/edit/${page._id}`)}
                          className="h-10 w-10 rounded-xl border bg-white hover:bg-blue-50 flex items-center justify-center text-blue-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            window.open(`/preview/${page.slug}`, "_blank")
                          }
                          className="h-10 w-10 rounded-xl border bg-white hover:bg-purple-50 flex items-center justify-center text-purple-600"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => toggleStatus(page)}
                          className={`px-4 h-10 rounded-xl text-sm font-medium flex items-center gap-2
                          ${
                            page.status === "published"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {page.status === "published" ? (
                            <>
                              <GlobeLock size={16} />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Globe size={16} />
                              Publish
                            </>
                          )}
                        </button>

                        <button
                          onClick={() =>
                            openDeleteModal(page._id, page.title)
                          }
                          className="h-10 w-10 rounded-xl border bg-white hover:bg-red-50 flex items-center justify-center text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}

                {pages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-gray-500">
                      No pages found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="lg:hidden space-y-4">
            {pages.map((page) => (
              <div
                key={page._id}
                className="bg-white rounded-2xl border shadow-sm p-4 space-y-4"
              >
                <div>
                  <h2 className="font-semibold text-gray-900 text-base">
                    {page.title}
                  </h2>
                  <p className="text-xs text-gray-500">Page Content</p>
                </div>

                <div className="bg-gray-100 px-3 py-2 rounded-lg text-xs text-gray-700 break-all">
                  /{page.categoryId?.slug}/{page.slug}
                </div>

                <StatusBadge status={page.status} />

                <div className="grid grid-cols-2 gap-2">

                  <button
                    onClick={() => navigate(`/pages/edit/${page._id}`)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium"
                  >
                    <Pencil size={16} /> Edit
                  </button>

                  <button
                    onClick={() =>
                      window.open(`/preview/${page.slug}`, "_blank")
                    }
                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-purple-50 text-purple-600 text-sm font-medium"
                  >
                    <Eye size={16} /> Preview
                  </button>

                  <button
                    onClick={() => toggleStatus(page)}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium
                    ${
                      page.status === "published"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {page.status === "published" ? (
                      <>
                        <GlobeLock size={16} /> Unpublish
                      </>
                    ) : (
                      <>
                        <Globe size={16} /> Publish
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      openDeleteModal(page._id, page.title)
                    }
                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium"
                  >
                    <Trash2 size={16} /> Delete
                  </button>

                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* DELETE MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold">Delete Page</h2>
              <button
                onClick={closeDeleteModal}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-gray-600">
                Delete "{deleteModal.title}"?
              </p>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t bg-gray-50">
              <button onClick={closeDeleteModal} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}