import { create } from 'zustand'
import type { Tool } from './type'

type DevToolsStore = {
  tools: Record<string, Tool>
  appendTool: (tool: Tool) => void
  updateTool: (value: Tool) => void
}

const appendUniqueTool = (tool: Tool, tools: Record<string, Tool>) => {
  if (!tools[tool.name]) {
    return { ...tools, [tool.name]: tool }
  }
  return tools
}

const updateToolValue = (toolToUpdate: Tool, tools: Record<string, Tool>) => {
  const updatedTools = Object.entries(tools).reduce<Record<string, Tool>>((acc, [name, tool]) => {
    if (name === toolToUpdate.name) {
      acc[toolToUpdate.name] = toolToUpdate
    } else {
      acc[name] = tool
    }

    return acc
  }, {})

  console.log(updatedTools)

  return updatedTools
}

export const useDevTools = create<DevToolsStore>((set, get) => ({
  tools: {},
  appendTool: tool => set({ ...get(), tools: appendUniqueTool(tool, get().tools) }),
  updateTool: tool => set({ ...get(), tools: updateToolValue(tool, get().tools) }),
}))
