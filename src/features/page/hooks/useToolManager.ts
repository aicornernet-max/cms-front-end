import { searchToolsApi } from "../services/tool.service"

export function useToolManager(
  form: any,
  setForm: any,
  setToolResults: any,
  setToolSearch: any
) {
  const searchTools = async (query: string) => {
    if (!query.trim()) {
      setToolResults([])
      return
    }

    try {
      const res = await searchToolsApi(query)

      setToolResults(
        res.data.data || []
      )
    } catch (err) {
      console.error("Tool search failed:", err)
      setToolResults([])
    }
  }

  const addTool = (tool: any) => {
    // IMPORTANT:
    // API returns `id`, not `_id`
    const toolId = tool.id

    if (!toolId) {
      console.error("Tool ID is missing:", tool)
      return
    }

    // Prevent duplicate tools
    const alreadySelected = form.tools.some(
      (t: any) => t.toolId === toolId
    )

    if (alreadySelected) {
      return
    }

    setForm({
      ...form,

      tools: [
        ...form.tools,

        {
          toolId: toolId,
          name: tool.name,
          image: tool.image,
          customDescription: "",
        },
      ],
    })

    setToolResults([])
    setToolSearch("")
  }

  const removeTool = (index: number) => {
    const updated = [...form.tools]

    updated.splice(index, 1)

    setForm({
      ...form,
      tools: updated,
    })
  }

  return {
    searchTools,
    addTool,
    removeTool,
  }
}