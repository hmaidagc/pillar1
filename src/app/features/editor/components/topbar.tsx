'use client'

import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ActiveTool } from '../types'
import { LucideMousePointerClick, Hand, Redo2, Undo2 } from 'lucide-react'

interface TopBarProps {
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
}

export const TopBar = ({ activeTool, onChangeActiveTool }: TopBarProps) => {
  return (
    <div className="w-full mx-[100px] flex items-center p-4 h-[68px] flex-row gap-x-1 border-b">
      <Hint label="Select" side="bottom" sideOffset={10}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChangeActiveTool('select')}
          className={cn(activeTool === 'select' && 'bg-gray-100')}
        >
          <LucideMousePointerClick className="size-4" />
        </Button>
      </Hint>
      <Hint label="Grab" side="bottom" sideOffset={10}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChangeActiveTool('grab')}
          className={cn(activeTool === 'grab' && 'bg-gray-100')}
        >
          <Hand className="size-4" />
        </Button>
      </Hint>
      <Hint label="Undo" side="bottom" sideOffset={10}>
        <Button variant="ghost" size="icon" onClick={() => {}}>
          <Undo2 className="size-4" />
        </Button>
      </Hint>
      <Hint label="Redo" side="bottom" sideOffset={10}>
        <Button variant="ghost" size="icon" onClick={() => {}}>
          <Redo2 className="size-4" />
        </Button>
      </Hint>
    </div>
  )
}
