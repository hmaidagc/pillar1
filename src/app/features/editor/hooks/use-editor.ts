import { Canvas, FabricObject, Rect, Shadow } from 'fabric'
import { useCallback, useMemo, useState } from 'react'
import { useAutoResize } from './use-auto-resize'
import { Editor } from '../types'

const buildEditor = (canvas: Canvas | null): Editor => ({})

export const useEditor = () => {
  const [canvas, setCanvas] = useState<Canvas | null>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  useAutoResize({
    canvas,
    container,
  })

  const editor = useMemo<Editor | undefined>(() => {
    if (canvas) {
      return buildEditor(canvas)
    }
    return undefined
  }, [canvas])

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: Canvas
      initialContainer: HTMLDivElement
    }) => {
      // Assign properties to objects after selected
      Object.assign(FabricObject.ownDefaults, {
        cornerColor: '#FFF',
        cornerStyle: 'circle',
        borderColor: '#3b82f6',
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: '#3b82f6',
      })

      // The workspace page
      const initialWorkspace = new Rect({
        width: 900,
        height: 1200,
        name: 'clip',
        fill: 'white',
        selectable: false,
        hasControls: false,
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.8)',
          blur: 5,
        }),
      })

      const test = new Rect({
        height: 100,
        width: 100,
        fill: 'black',
      })

      const width = initialContainer.offsetWidth
      const height = initialContainer.offsetHeight

      initialCanvas.setDimensions({ width, height })

      initialCanvas.add(initialWorkspace)
      initialCanvas.centerObject(initialWorkspace)
      initialCanvas.clipPath = initialWorkspace

      setCanvas(initialCanvas)
      setContainer(initialContainer)

      initialCanvas.add(test)
      initialCanvas.centerObject(test)
    },
    []
  )

  return { init, editor }
}
