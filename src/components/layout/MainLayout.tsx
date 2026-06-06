import type { ReactNode } from 'react'

interface MainLayoutProps {
  leftSidebar: ReactNode
  rightSidebar: ReactNode
  showLeftSidebar: boolean
  showRightSidebar: boolean
  children: ReactNode
}

export function MainLayout({ leftSidebar, rightSidebar, showLeftSidebar, showRightSidebar, children }: MainLayoutProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      {showLeftSidebar && (
        <div className="w-64 shrink-0 border-r border-base-300">
          {leftSidebar}
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
      {showRightSidebar && (
        <div className="w-80 shrink-0 hidden lg:block border-l border-base-300">
          {rightSidebar}
        </div>
      )}
    </div>
  )
}
