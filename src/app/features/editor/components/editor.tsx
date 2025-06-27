'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor } from '../hooks/use-editor'
import { Canvas } from 'fabric'
import { usePDFUpload } from '../../pdf/hooks/use-pdf-upload'
import { PDFUploader } from '../../pdf/component/pdf-uploader'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'
import { ActiveTool } from '../types'
import { TopBar } from './topbar'
import { PagesSideBar } from './pages-sidebar'
// import PDFUploader from "@/app/features/pdf/component/pdf-uploader"

export const Editor = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('select')
  const { init, editor } = useEditor()
  const [canvas, setCanvas] = useState<Canvas | null>(null)
  const [isCanvasReady, setIsCanvasReady] = useState(false)

  const canvasRef = useRef(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === activeTool) {
        return setActiveTool('select')
      }
      setActiveTool(tool)
    },
    [activeTool, editor]
  )

  // Use the actual PDF upload hook
  const { uploadPDF, removePDFBackground, isLoading, currentPDF } =
    usePDFUpload({ canvas })

  useEffect(() => {
    console.log('init')

    if (!canvasRef.current) return

    const newCanvas = new Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
      // Add these properties to improve rendering performance
      renderOnAddRemove: false, // Prevent automatic rendering on object changes
      skipTargetFind: false,
      selection: true,
      // Improve performance during interactions
      perPixelTargetFind: true,
      targetFindTolerance: 4,
    })

    init({
      initialCanvas: newCanvas,
      initialContainer: containerRef.current!,
    })

    // Set the canvas state so usePDFUpload can access it
    setCanvas(newCanvas)
    setIsCanvasReady(true)

    return () => {
      setIsCanvasReady(false)
      setCanvas(null)
      newCanvas.dispose()
    }
  }, [init])

  // Debug effect to monitor canvas changes
  // useEffect(() => {
  //   if (canvas) {
  //     console.log(
  //       'Canvas state updated, object count:',
  //       canvas.getObjects().length
  //     )
  //     console.log(
  //       'Canvas objects:',
  //       canvas.getObjects().map((obj) => ({
  //         name: (obj as any).name,
  //         type: obj.type,
  //         visible: obj.visible,
  //       }))
  //     )
  //   }
  // }, [canvas])

  // useEffect(() => {
  //   if (!canvas) return
  //   const wrapper = canvas.wrapperEl

  //   // clear old grab handlers
  //   canvas.off('mouse:down')
  //   canvas.off('mouse:up')

  //   switch (activeTool) {
  //     case 'select':
  //       // built-in selection: arrow cursor
  //       wrapper.style.cursor = 'pointer'
  //       canvas.selection = true
  //       canvas.hoverCursor = 'grabbing'
  //       break

  //     case 'grab':
  //       // open hand when idle
  //       wrapper.style.cursor = 'grab'
  //       canvas.selection = false

  //       // closed hand on drag
  //       canvas.on('mouse:down', () => {
  //         wrapper.style.cursor = 'grabbing'
  //       })
  //       canvas.on('mouse:up', () => {
  //         wrapper.style.cursor = 'grab'
  //       })
  //       break

  //     default:
  //       // fallback for other tools
  //       wrapper.style.cursor = 'pointer'
  //       canvas.selection = false
  //       break
  //   }

  //   canvas.requestRenderAll()
  // }, [canvas, activeTool])

  return (
    <div className="h-full flex flex-col">
      {/* PDF Upload Controls */}

      {/* <div className="p-4 border-b"> */}
      {/* <PDFUploader
          onUpload={uploadPDF}
          isLoading={isLoading}
          currentPDF={currentPDF}
          onRemove={removePDFBackground}
        /> */}
      {/* Debug info */}
      {/* <div className="mt-2 text-xs text-gray-500">
          Canvas Ready: {isCanvasReady ? '✅' : '❌'} | 
          Objects: {canvas ? canvas.getObjects().length : 0} |
          PDF: {currentPDF || 'None'}
        </div> */}
      {/* </div> */}

      <Navbar />
      <TopBar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />

      <div className="absolute h-[calc(100%-68px)] w-full top-[136px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        {editor && (
          <PagesSideBar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
        )}

        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <div
            className="flex-1 h-[calc(100%-124px)] bg-muted"
            ref={containerRef}
          >
            <canvas
              ref={canvasRef}
              style={{
                // Prevent canvas from flickering during resize
                transition: 'none',
                // Ensure canvas stays in place
                position: 'absolute',
                top: 0,
                left: 0,
                // Prevent selection highlighting that can cause flicker
                userSelect: 'none',
                // Hardware acceleration for better performance
                transform: 'translateZ(0)',
              }}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
