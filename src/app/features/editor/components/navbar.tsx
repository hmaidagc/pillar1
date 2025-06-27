'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Logo } from './logo'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { CiFileOn } from 'react-icons/ci'
import { Separator } from '@/components/ui/separator'

export const Navbar = () => {
  return (
    <div className="w-full flex items-center p-4 h-[68px] flex-row gap-x-10 border-b">
      <Logo />
      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              Menu
              <ChevronDown className="size-4 ml-2"></ChevronDown>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem
              onClick={() => {}}
              className="flex items-center gap-x-2"
            >
              <CiFileOn className="size-8" />
              <div>
                <p>Open</p>
                <p className="text-xs text-muted-foreground">
                  Open a Project File
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-2" />
        <div>Workspace</div>
        <div>View</div>
        <div>Tools</div>
        <div>Reports</div>
        <div>Settings</div>
      </div>
    </div>
  )
}
