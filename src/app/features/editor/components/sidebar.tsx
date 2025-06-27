'use client'

import { ActiveTool } from '../types'
import { SidebarItem } from './sidebar-item'

import {
  FileSearch2,
  FileStack,
  NotebookPen,
  RulerDimensionLine,
  Wrench,
} from 'lucide-react'

interface SidebarProps {
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
}

export const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
  return (
    <aside className="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
      <ul className="flex flex-col">
        <SidebarItem
          icon={FileStack}
          label="Pages"
          isActive={activeTool === 'pages'}
          onClick={() => onChangeActiveTool('pages')}
        />
        <SidebarItem
          icon={Wrench}
          label="Properties"
          isActive={activeTool === 'properties'}
          onClick={() => onChangeActiveTool('properties')}
        />
        <SidebarItem
          icon={RulerDimensionLine}
          label="Measure"
          isActive={activeTool === 'measure'}
          onClick={() => onChangeActiveTool('measure')}
        />
        <SidebarItem
          icon={NotebookPen}
          label="Take-Off"
          isActive={activeTool === 'take-off'}
          onClick={() => onChangeActiveTool('take-off')}
        />
        <SidebarItem
          icon={FileSearch2}
          label="Search"
          isActive={activeTool === 'search'}
          onClick={() => onChangeActiveTool('search')}
        />
      </ul>
    </aside>
  )
}
