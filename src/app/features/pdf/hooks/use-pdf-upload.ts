// src/app/features/pdf/hooks/use-pdf-upload.ts
import { Canvas, FabricImage } from 'fabric'
import { useCallback, useState } from 'react'

interface UsePDFUploadProps {
  canvas: Canvas | null
}

export const usePDFUpload = ({ canvas }: UsePDFUploadProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentPDF, setCurrentPDF] = useState<string | null>(null)

  // Set the Background Canvas
  const setCanvasBackground = useCallback(
    async (imageDataUrl: string) => {
      if (!canvas) return

      canvas.renderOnAddRemove = false

      const fabricImage = await FabricImage.fromURL(imageDataUrl)

      // Find the workspace to position the PDF relative to it
      const workspace = canvas
        .getObjects()
        .find((obj) => (obj as any).name === 'clip')

      if (workspace) {
        const workspaceWidth = workspace.width! * (workspace.scaleX || 1)
        const workspaceHeight = workspace.height! * (workspace.scaleY || 1)

        const imageAspectRatio = fabricImage.width! / fabricImage.height!
        const workspaceAspectRatio = workspaceWidth / workspaceHeight

        let scaleFactor: number
        if (imageAspectRatio > workspaceAspectRatio) {
          scaleFactor = workspaceWidth / fabricImage.width!
        } else {
          scaleFactor = workspaceHeight / fabricImage.height!
        }

        scaleFactor *= 0.9
        fabricImage.scale(scaleFactor)

        const workspaceCenter = workspace.getCenterPoint()

        fabricImage.set({
          left: workspaceCenter.x,
          top: workspaceCenter.y,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          name: 'pdf-background',
        })
      }

      // Remove existing background
      const existingBackground = canvas
        .getObjects()
        .find((obj) => (obj as any).name === 'pdf-background')
      if (existingBackground) {
        canvas.remove(existingBackground)
      }

      canvas.add(fabricImage)

      if (workspace) {
        const workspaceIndex = canvas.getObjects().indexOf(workspace)
        canvas.moveObjectTo(fabricImage, workspaceIndex + 1)
      }

      canvas.renderOnAddRemove = true
      canvas.requestRenderAll()
    },
    [canvas]
  )

  // Main Logic
  const uploadPDF = useCallback(
    async (file: File) => {
      if (!canvas) return
      setIsLoading(true)

      try {
        console.log('Loading PDF with global PDF.js...')

        // Load PDF.js globally as suggested in the article
        if (!(window as any).pdfjsLib) {
          console.log('Loading PDF.js script...')

          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
            script.onload = () => {
              console.log('PDF.js script loaded')
              resolve()
            }
            script.onerror = () =>
              reject(new Error('Failed to load PDF.js script'))
            document.head.appendChild(script)
          })
        }

        const pdfjsLib = (window as any).pdfjsLib

        // Set worker as suggested in the article
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

        console.log('PDF.js configured with worker')

        // Step 4: Read the uploaded file
        const arrayBuffer = await file.arrayBuffer()
        console.log('PDF file read, size:', arrayBuffer.byteLength)

        // Step 5: Load PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const pdfDocument = await loadingTask.promise

        console.log('PDF loaded, pages:', pdfDocument.numPages)

        // Step 6: Get first page
        const page = await pdfDocument.getPage(1)
        console.log('First page loaded')

        // Step 7: Create viewport (determines rendered size)
        const viewport = page.getViewport({ scale: 2 })
        console.log('Viewport created:', viewport.width, 'x', viewport.height)

        // Step 8: Create temporary canvas for PDF rendering
        const tempCanvas = document.createElement('canvas')
        const ctx = tempCanvas.getContext('2d')!
        tempCanvas.width = viewport.width
        tempCanvas.height = viewport.height

        console.log('Rendering PDF page...')

        // Step 9: Render PDF page to temporary canvas
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        }
        await page.render(renderContext).promise
        console.log('PDF page rendered successfully')

        // Step 10: Convert canvas to image data URL
        const imageDataUrl = tempCanvas.toDataURL('image/png', 0.95)
        console.log('PDF converted to image')

        // Step 11: Set as Fabric.js canvas background
        await setCanvasBackground(imageDataUrl)
        setCurrentPDF(file.name)

        console.log('PDF set as canvas background successfully!')
      } catch (error) {
        console.error('PDF rendering failed:', error)

        // Simple fallback
        const tempCanvas = document.createElement('canvas')
        const ctx = tempCanvas.getContext('2d')!

        tempCanvas.width = 800
        tempCanvas.height = 600

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, 800, 600)

        ctx.strokeStyle = '#dc3545'
        ctx.lineWidth = 2
        ctx.strokeRect(10, 10, 780, 580)

        ctx.fillStyle = '#dc3545'
        ctx.font = '24px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('❌ PDF Rendering Failed', 400, 280)

        ctx.fillStyle = '#000000'
        ctx.font = '18px Arial'
        ctx.fillText(file.name, 400, 320)

        const imageDataUrl = tempCanvas.toDataURL('image/png')
        await setCanvasBackground(imageDataUrl)
        setCurrentPDF(file.name)
      } finally {
        setIsLoading(false)
      }
    },
    [canvas, setCanvasBackground]
  )

  //  RemovePDFBackground Function
  const removePDFBackground = useCallback(() => {
    if (!canvas) return

    const background = canvas
      .getObjects()
      .find((obj) => (obj as any).name === 'pdf-background')

    if (background) {
      canvas.remove(background)
      canvas.requestRenderAll()
    }

    setCurrentPDF(null)
  }, [canvas])

  return {
    uploadPDF,
    removePDFBackground,
    isLoading,
    currentPDF,
  }
}
