import Image from "next/image"
import { formatBytes } from "@/lib/utils"
import { useImageStore } from "@/store/use-image-store"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ImagePreviewItemProps {
  id: string
  src: string
  size: number
  alt?: string
  originalFileName: string
  format: string
}

/**
 * Component hiển thị preview ảnh và thông tin cho một ảnh
 */
function ImagePreviewItem({
  id,
  src,
  size,
  alt = "Preview",
  originalFileName,
  format,
}: ImagePreviewItemProps) {
  const processedImage = useImageStore((state) =>
    state.processed.find((img) => img.id === id)
  )

  const handleDownload = () => {
    if (processedImage?.blob) {
      const url = URL.createObjectURL(processedImage.blob)
      const a = document.createElement("a")
      a.href = url
      const newFileName = originalFileName.replace(/\.[^/.]+$/, "") + `.${format}`
      a.download = newFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="d-flex flex-column align-items-center gap-2 p-3 border rounded-3">
      <div className="position-relative" style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '0.5rem', border: '1px solid #dee2e6' }}>
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      <p className="text-secondary small text-center mb-1">
        {originalFileName}
      </p>
      <p className="text-secondary small mb-2">
        Kích thước: {formatBytes(size)}
      </p>
      {processedImage && (
        <Button onClick={handleDownload} size="sm" className="d-flex align-items-center gap-2">
          <Download className="w-4 h-4" /> Tải xuống
        </Button>
      )}
    </div>
  )
}

/**
 * Component hiển thị danh sách ảnh gốc và ảnh đã xử lý
 */
export function ImagePreview() {
  const originals = useImageStore((state) => state.originals)
  const processed = useImageStore((state) => state.processed)
  const options = useImageStore((state) => state.options)
  const processing = useImageStore((state) => state.processing)

  if (originals.length === 0) {
    return null
  }

  return (
    <div className="d-flex flex-column gap-4 w-100">
      <h3>Ảnh gốc</h3>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {originals.map((img) => (
          <ImagePreviewItem
            key={img.id}
            id={img.id}
            src={img.preview}
            size={img.size}
            alt={img.file.name}
            originalFileName={img.file.name}
            format={options.format}
          />
        ))}
      </div>

      {processing && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang xử lý...</span>
          </div>
          <p className="text-primary mb-0">Đang xử lý ảnh...</p>
        </div>
      )}

      {processed.length > 0 && (
        <>
          <h3 className="mt-4">Ảnh đã xử lý</h3>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {originals.map((originalImg) => {
              const processedImg = processed.find((p) => p.id === originalImg.id)
              if (!processedImg) return null
              return (
                <ImagePreviewItem
                  key={processedImg.id}
                  id={processedImg.id}
                  src={processedImg.preview}
                  size={processedImg.size}
                  alt={`Processed ${originalImg.file.name}`}
                  originalFileName={originalImg.file.name}
                  format={options.format}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
