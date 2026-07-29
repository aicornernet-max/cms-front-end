import { useEffect, useMemo, useState } from "react"
import axios from "../../api/axios"
import { useNavigate } from "react-router-dom"
import { LoginActivityPagination } from "../../modules/login-activity/components/LoginActivityPagination";

interface Tool {
  _id: string
  name: string
  slug?: string
  brand: string
  toolImage?:string
  createdAt?: string
  updatedAt?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/* -------------------------------------------------------------------------- */
/*  Design tokens (kept local so this file is drop-in — no tailwind.config
    changes required). Teal accent + cool neutrals + Sora/Inter type pairing.  */
/* -------------------------------------------------------------------------- */

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&display=swap');
  .tl-display { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }
  .tl-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
`

// Deterministic hue from a string so every brand gets a stable, distinct
// duotone identity — used for the fallback avatar and the loading skeleton.
function brandHue(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return ""
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 0) return "Updated today"
  if (days === 1) return "Updated yesterday"
  if (days < 30) return `Updated ${days}d ago`
  const months = Math.floor(days / 30)
  return `Updated ${months}mo ago`
}

/* -------------------------------------------------------------------------- */
/*  Icons — inline SVG, no external icon dependency required                  */
/* -------------------------------------------------------------------------- */

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const EmptyIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
)

/* -------------------------------------------------------------------------- */
/*  Tool avatar — real image with graceful fallback to a duotone initial tile */
/* -------------------------------------------------------------------------- */

function ToolAvatar({ tool, size = 48, radius = 14 }: { tool: Tool; size?: number; radius?: number }) {
  const [errored, setErrored] = useState(false)
  const hasImage = !!tool.toolImage&& !errored
  const hue = useMemo(() => brandHue(tool.brand || tool.name || "?"), [tool.brand, tool.name])

  if (hasImage) {
    return (
      <img
        src={tool.toolImage}
        alt={tool.name}
        onError={() => setErrored(true)}
        style={{ width: size, height: size, borderRadius: radius }}
        className="object-cover border border-[#E4E7EC] shrink-0 bg-white"
        loading="lazy"
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, hsl(${hue} 70% 94%), hsl(${hue} 60% 86%))`,
        color: `hsl(${hue} 45% 30%)`,
      }}
      className="tl-display flex items-center justify-center font-semibold shrink-0 text-lg border border-black/5"
    >
      {(tool.name?.charAt(0) || "?").toUpperCase()}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Skeleton card shown while loading                                         */
/* -------------------------------------------------------------------------- */

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] p-4 animate-pulse">
      <div className="w-full aspect-[4/3] rounded-xl bg-[#EEF0F3] mb-4" />
      <div className="h-4 w-3/5 bg-[#EEF0F3] rounded mb-2" />
      <div className="h-3 w-2/5 bg-[#EEF0F3] rounded" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function ToolsList() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState<string>("")
  const [search, setSearch] = useState("")

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  const navigate = useNavigate()

  const fetchTools = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/tools", { params: { search, page, limit } })

      // Safe against either a wrapped { data: { tools, pagination } } payload
      // or an already-unwrapped { tools, pagination } payload.
      const payload = res?.data?.data ?? res?.data ?? {}
      const nextTools = Array.isArray(payload.tools) ? payload.tools : []
      const nextPagination = payload.pagination ?? pagination

      setTools(nextTools)
      setPagination(nextPagination)
    } catch (err) {
      console.error(err)
      setTools([])
      setMessage("Couldn't load tools. Check your connection and try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTools()
    }, 400)
    return () => clearTimeout(delay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, limit])

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      const res = await axios.delete(`/tools/${deleteId}`)
      setMessage(res?.data?.message || "Tool deleted.")
      setMessageType("success")
      fetchTools()
    } catch (err: any) {
      console.error(err)
      setMessage(err?.response?.data?.message || "Couldn't delete this tool.")
      setMessageType("error")
    }

    setDeleteId(null)
    setDeleteName("")

    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 5000)
  }

  return (
    <div className="tl-body min-h-full bg-[#F7F8FA] px-4 sm:px-6 py-6">
      <style>{fontImport}</style>

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="tl-display text-2xl sm:text-[28px] font-bold text-[#111827] tracking-tight">
            Tool directory
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            {pagination.total > 0
              ? `${pagination.total.toLocaleString()} tool${pagination.total === 1 ? "" : "s"} in the catalog`
              : "Manage every tool in your catalog"}
          </p>
        </div>

        <button
          onClick={() => navigate("/tools/new")}
          className="tl-body inline-flex items-center justify-center gap-2 bg-[#146457] hover:bg-[#0E4F45] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors w-full sm:w-auto shadow-sm"
        >
          <PlusIcon />
          New tool
        </button>
      </div>

      {/* ALERT MESSAGE */}
      {message && (
        <div
          className={`mb-5 px-4 py-3 rounded-xl border text-sm flex items-start gap-2 ${
            messageType === "success"
              ? "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]"
              : "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
          }`}
        >
          {message}
        </div>
      )}

      {/* TOOLBAR */}
      <div className="sticky top-0 z-10 bg-[#F7F8FA]/90 backdrop-blur-sm py-3 mb-2 -mx-1 px-1">
        <div className="relative max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full bg-white border border-[#E4E7EC] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#146457]/30 focus:border-[#146457] transition-shadow"
          />
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: limit > 12 ? 12 : limit }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : tools.length === 0 ? (
        <div className="bg-white border border-[#E4E7EC] rounded-2xl py-16 px-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F0FBF9] text-[#146457] flex items-center justify-center mb-4">
            <EmptyIcon />
          </div>
          <h3 className="tl-display font-semibold text-[#111827] mb-1">
            {search ? "No tools match your search" : "No tools yet"}
          </h3>
          <p className="text-sm text-[#667085] mb-5 max-w-sm">
            {search
              ? `Nothing found for "${search}". Try a different name or brand.`
              : "Add your first tool to start building the catalog."}
          </p>
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="text-sm font-medium text-[#146457] hover:underline"
            >
              Clear search
            </button>
          ) : (
            <button
              onClick={() => navigate("/tools/new")}
              className="inline-flex items-center gap-2 bg-[#146457] hover:bg-[#0E4F45] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <PlusIcon />
              Add a tool
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => {
            const hue = brandHue(tool.brand || tool.name || "?")
            return (
              <div
                key={tool._id}
                className="group relative bg-white rounded-2xl border border-[#E4E7EC] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
              >
                {/* IMAGE / COVER */}
                <div
                  className="w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, hsl(${hue} 60% 96%), hsl(${hue} 45% 90%))` }}
                >
                  {tool.toolImage? (
                    <img
                      src={tool.toolImage}
                      alt={tool.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none"
                      }}
                    />
                  ) : (
                    <span
                      className="tl-display text-4xl font-bold"
                      style={{ color: `hsl(${hue} 45% 32%)` }}
                    >
                      {(tool.name?.charAt(0) || "?").toUpperCase()}
                    </span>
                  )}

                  {/* HOVER ACTIONS */}
                  <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/tools/edit/${tool._id}`)}
                      title="Edit tool"
                      className="w-8 h-8 rounded-lg bg-white/95 border border-[#E4E7EC] text-[#344054] hover:text-[#146457] flex items-center justify-center shadow-sm"
                    >
                      <PencilIcon />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(tool._id)
                        setDeleteName(tool.name)
                      }}
                      title="Delete tool"
                      className="w-8 h-8 rounded-lg bg-white/95 border border-[#E4E7EC] text-[#344054] hover:text-[#DC2626] flex items-center justify-center shadow-sm"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <p className="tl-display font-semibold text-[#111827] text-[15px] truncate">
                    {tool.name}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span
                      className="tl-body text-xs font-medium px-2 py-0.5 rounded-md truncate max-w-[65%]"
                      style={{
                        background: `hsl(${hue} 60% 95%)`,
                        color: `hsl(${hue} 45% 32%)`,
                      }}
                    >
                      {tool.brand}
                    </span>
                    <span className="text-[11px] text-[#98A2B3] shrink-0">
                      {timeAgo(tool.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* PAGINATION */}
      <div className="mt-6 bg-white border border-[#E4E7EC] rounded-2xl px-4 py-3">
        <LoginActivityPagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={(newLimit: number) => {
            setLimit(newLimit)
            setPage(1)
          }}
        />
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-[#101828]/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mb-4">
              <TrashIcon />
            </div>

            <h2 className="tl-display text-lg font-semibold text-[#111827] mb-1.5">
              Delete "{deleteName}"?
            </h2>

            <p className="text-[#667085] mb-6 text-sm">
              This removes the tool from the catalog for everyone. This can't be undone.
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteId(null)
                  setDeleteName("")
                }}
                className="px-4 py-2.5 rounded-xl border border-[#E4E7EC] text-sm font-medium text-[#344054] hover:bg-[#F7F8FA] w-full sm:w-auto transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-medium w-full sm:w-auto transition-colors"
              >
                Delete tool
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
