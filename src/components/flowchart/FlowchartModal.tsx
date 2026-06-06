import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { listImages } from '../../services/storage'

interface FlowchartModalProps {
  slug: string
  onClose: () => void
}

export function FlowchartModal({ slug, onClose }: FlowchartModalProps) {
  const [images, setImages] = useState<{ name: string; url: string }[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listImages(slug).then(imgs => {
      setImages(imgs)
      setLoading(false)
    })
  }, [slug])

  const prev = () => setCurrent(i => (i > 0 ? i - 1 : images.length - 1))
  const next = () => setCurrent(i => (i < images.length - 1 ? i + 1 : 0))

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-6xl w-full h-[85vh] flex flex-col p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
          <h3 className="font-bold text-lg">流程图预览</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto flex items-center justify-center relative">
          {loading ? (
            <span className="loading loading-spinner loading-lg" />
          ) : images.length === 0 ? (
            <div className="text-center text-base-content/50">
              <p className="text-lg">暂无流程图</p>
              <p className="text-sm mt-1">将流程图图片放入 website/{slug}/images/ 目录</p>
            </div>
          ) : (
            <>
              {images.length > 1 && (
                <button className="btn btn-circle btn-sm btn-ghost absolute left-2 z-10" onClick={prev}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex flex-col items-center gap-2 px-8">
                <img
                  src={images[current].url}
                  alt={images[current].name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
                <span className="text-sm text-base-content/60">
                  {current + 1} / {images.length} — {images[current].name}
                </span>
              </div>
              {images.length > 1 && (
                <button className="btn btn-circle btn-sm btn-ghost absolute right-2 z-10" onClick={next}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}
