import { ScrollArea } from '@/components/ui/scroll-area'
import { ActiveTool, Editor } from '../types'
import { ToolBarHeader } from './tool-sidebar-header'
import { cn } from '@/lib/utils'
import { ToolSidebarClose } from './tool-sidebar-close'

interface PagesSideBarProps {
  editor: Editor | undefined
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
}

export const PagesSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: PagesSideBarProps) => {
  const onClose = () => {
    onChangeActiveTool('select')
  }
  return (
    <aside
      className={cn(
        'bg-white relative border-r h-full w-[360px] z-[40] flex flex-col',
        activeTool === 'pages' ? 'visible' : 'hidden'
      )}
    >
      <ToolBarHeader title="Thumbnails" description="Navigate project plans" />
      <ScrollArea></ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}
