import { Canvas, FabricObject, Point, util } from "fabric"
import { useCallback, useEffect } from "react"


interface UseAutoResizeProps {
  canvas: Canvas | null,
  container: HTMLDivElement | null
}

export const useAutoResize = ({
  canvas,
  container
}: UseAutoResizeProps) => {

  const autoZoom = useCallback(() => {
    if (!canvas || !container) return

    const width = container.offsetWidth
    const height = container.offsetHeight

    canvas.setDimensions({width, height})

    const center = canvas.getCenterPoint()

    const zoomRatio = 0.85
    const localWorkspace = canvas
      .getObjects()
      .find((object) => (object as any).name === "clip")

    if (!localWorkspace) return;

    const scale = util.findScaleToFit(localWorkspace,{
      width:width,
      height:height
    })

    const zoom = zoomRatio * scale

    // Reset viewport transform to identity matrix
    canvas.setViewportTransform([1,0,0,1,0,0])
    canvas.zoomToPoint(center, zoom)

    if (!localWorkspace) return

    const workspaceCenter = localWorkspace.getCenterPoint()
    const viewportTransform = canvas.viewportTransform

    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewportTransform
    ) {
      return;
    }

    viewportTransform[4] = canvas.width / 2 - workspaceCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

    canvas.setViewportTransform(viewportTransform);

      // In v6, clone method signature might be different
      localWorkspace.clone().then((cloned: FabricObject) => {
        canvas.clipPath = cloned;
        canvas.requestRenderAll();
      });

  }, [canvas,container])

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null
    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        autoZoom()
      })
      resizeObserver.observe(container)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [
    canvas,
    container,
    autoZoom
  ])
}