import { ChangeEvent, FC } from 'react'
import { useDevTools } from './store'
import { Tool, ToolItem } from './type'

const SwitchTool = (tool: Tool) => {
  switch (tool.type) {
    case 'field': {
      const { type, ...props } = tool
      return <FieldTool {...props} />
    }
    case 'range': {
      const { type, ...props } = tool
      return <RangeTool {...props} />
    }
    case 'toggle': {
      const { type, ...props } = tool
      return <ToggleTool {...props} />
    }
    default: {
      return null
    }
  }
}

export const DevTools = () => {
  const { tools } = useDevTools()

  return (
    <aside className='fixed bottom-0 right-0 flex flex-col gap-4 bg-neutral-600 overflow-auto max-h-[180px] p-4'>
      {Object.values(tools).map((tool, index) => (
        <SwitchTool key={index} {...tool} />
      ))}
    </aside>
  )
}

const FieldTool: FC<ToolItem<'field'>> = tool => {
  const { name, value, onChange } = tool
  const { updateTool } = useDevTools()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    updateTool({ ...tool, value: e.target.value, type: 'field' })
  }

  return (
    <div className='flex gap-4'>
      <label>{name}</label>
      <input value={value} onChange={handleChange} />
    </div>
  )
}

const RangeTool: FC<ToolItem<'range'>> = tool => {
  const {
    name,
    value: [current, min, max],
    onChange,
  } = tool
  const { updateTool } = useDevTools()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange([parseInt(e.target.value), min, max])
    updateTool({ ...tool, value: [parseInt(e.target.value), min, max], type: 'range' })
  }

  return (
    <div className='flex gap-4'>
      <label>{name}</label>
      <input type='range' value={current} min={min} max={max} step={1} onChange={handleChange} />
      <output>{current}</output>
    </div>
  )
}

const ToggleTool: FC<ToolItem<'toggle'>> = tool => {
  const { name, value, onChange } = tool
  const { updateTool } = useDevTools()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
    updateTool({ ...tool, value: e.target.checked, type: 'toggle' })
  }

  return (
    <div className='flex gap-4'>
      <label>{name}</label>
      <input type='checkbox' checked={value} onChange={handleChange} />
    </div>
  )
}
