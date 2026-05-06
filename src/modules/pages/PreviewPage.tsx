import { useEffect, useMemo, useState } from "react"
import axios from "../../api/axios"
import { useParams } from "react-router-dom"

export default function PreviewPage() {
  const { slug } = useParams()

  const [data, setData] = useState<any>(null)

  const fetchPreview = async () => {
    try {
      const res = await axios.get(`/pages/preview/${slug}`)
      setData(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchPreview()
  }, [slug])

  // SEO Preview
  useEffect(() => {
    if (!data) return

    document.title = data.meta?.title || data.title

    const meta = document.createElement("meta")
    meta.name = "robots"
    meta.content = "noindex"

    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [data])

  const sortedTools = useMemo(() => {
    if (!data?.tools) return []

    return [...data.tools].sort(
      (a, b) => (a.position || 0) - (b.position || 0)
    )
  }, [data])

  if (!data) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading preview...
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="border-b border-gray-200 pb-6 mb-8">

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {data.title}
          </h1>

          <p className="text-gray-600 text-lg leading-8">
            {data.pageDescription}
          </p>

        </div>

        {/* SORT HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

          <h2 className="text-xl font-semibold text-gray-800">
            Showing Tools
          </h2>

        </div>

        {/* TOOLS */}
        <div className="space-y-6">

          {sortedTools.map((tool: any, index: number) => (

            <div
              key={index}
              className="bg-white shadow rounded-xl overflow-hidden flex flex-col md:flex-row transition hover:shadow-lg hover:scale-[1.01] duration-200"
            >

              {/* IMAGE */}
              <div className="md:w-64">

                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-56 md:h-full object-cover"
                />

              </div>

              {/* CONTENT */}
              <div className="flex-1 p-5">

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mb-3">

                  {tool.tags?.map((tag: string, i: number) => (

                    <span
                      key={i}
                      className={`text-xs font-semibold px-2 py-1 rounded
                        ${
                          tag === "Free"
                            ? "bg-green-100 text-green-700"
                            : tag === "Freemium"
                            ? "bg-blue-100 text-blue-700"
                            : tag === "Paid"
                            ? "bg-red-100 text-red-700"
                            : tag === "Beginner"
                            ? "bg-yellow-100 text-yellow-700"
                            : tag === "Developer"
                            ? "bg-indigo-100 text-indigo-700"
                            : tag === "Top Rated"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      `}
                    >
                      {tag}
                    </span>

                  ))}

                </div>

                {/* TOOL TITLE */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">

                  {tool.position}. {tool.name}

                </h2>

                {/* DESCRIPTION */}
                <p className="text-gray-600 leading-7">

                  {tool.customDescription}

                </p>

              </div>

              {/* SIDE SECTION */}
              <div className="md:w-48 border-t md:border-l md:border-t-0 p-5 flex flex-col justify-between">

                <div>

                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-semibold text-lg"
                  >
                    Visit Site →
                  </a>

                </div>

                <div className="text-right text-indigo-600 font-medium mt-6">

                  ⭐ {tool.rating} ({tool.reviews} Reviews)

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* FAQ */}
        {data.faq?.length > 0 && (

          <div className="mt-16">

            <div className="border-t pt-12">

              <h2 className="text-3xl font-bold text-center mb-10">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">

                {data.faq.map((item: any, index: number) => (

                  <div
                    key={index}
                    className="bg-white shadow rounded-xl p-6"
                  >

                    <h3 className="font-semibold text-lg text-gray-900 mb-3">

                      {item.question}

                    </h3>

                    <p className="text-gray-600 leading-7">

                      {item.answer}

                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        )}

        {/* CONTENT */}
        {data.content && (

          <div className="mt-16">

            <div className="border-t pt-12">

              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: data.content,
                }}
              />

            </div>

          </div>

        )}

      </div>

    </div>
  )
}