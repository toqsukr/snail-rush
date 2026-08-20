import { ChangeEvent, FC, useState } from 'react'
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
  const [collapsed, setCollapsed] = useState(false)

  if (!Object.values(tools).length) return

  return (
    <aside className='fixed bottom-0 right-0 z-50 flex w-[280px] flex-col rounded-tl bg-neutral-800/90 text-xs text-neutral-100'>
      <button
        type='button'
        className='flex items-center justify-between px-3 py-2 font-semibold uppercase tracking-wide'
        onClick={() => setCollapsed(!collapsed)}>
        <span>devtools</span>
        <span>{collapsed ? '+' : '–'}</span>
      </button>
      {!collapsed && (
        <div className='flex max-h-[320px] flex-col gap-3 overflow-auto px-3 pb-3'>
          {Object.values(tools).map((tool, index) => (
            <SwitchTool key={index} {...tool} />
          ))}
        </div>
      )}
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
    <div className='flex items-center justify-between gap-2'>
      <label>{name}</label>
      <input className='w-[120px] bg-neutral-700 px-1' value={value} onChange={handleChange} />
    </div>
  )
}

const RangeTool: FC<ToolItem<'range'>> = tool => {
  const {
    name,
    value: [current, min, max, step],
    onChange,
  } = tool
  const { updateTool } = useDevTools()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange([parseFloat(e.target.value), min, max, step])
    updateTool({ ...tool, value: [parseFloat(e.target.value), min, max, step], type: 'range' })
  }

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex justify-between'>
        <label>{name}</label>
        <output>{current}</output>
      </div>
      <input type='range' value={current} min={min} max={max} step={step} onChange={handleChange} />
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
    <div className='flex items-center justify-between gap-2'>
      <label>{name}</label>
      <input type='checkbox' checked={value} onChange={handleChange} />
    </div>
  )
}
