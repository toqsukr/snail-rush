type ToolMap = {
  toggle: boolean
  field: string
  range: [value: number, minLimit: number, maxLimit: number]
}

export type ToolItem<TType extends ToolType = 'toggle'> = {
  name: string
  value: ToolMap[TType]
  onChange: (value: ToolMap[TType]) => void
}

export type ToolType = 'toggle' | 'field' | 'range'

export type Tool =
  | ({
      type: 'field'
    } & ToolItem<'field'>)
  | ({
      type: 'range'
    } & ToolItem<'range'>)
  | ({
      type: 'toggle'
    } & ToolItem<'toggle'>)
