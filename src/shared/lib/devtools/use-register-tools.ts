import { useEffect } from 'react'
import { useDevTools } from './store'
import { Tool } from './type'

export const useRegisterTools = (tools: Tool[]) => {
  const { appendTool } = useDevTools()

  useEffect(() => {
    tools.forEach(tool => {
      appendTool(tool)
    })
  }, [])
}
