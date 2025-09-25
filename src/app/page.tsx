"use client"

import { ImageDropzone } from "@/components/features/image-dropzone"
import { ImagePreview } from "@/components/features/image-preview"
import { ImageSettings } from "@/components/features/image-settings"
import { Button } from "@/components/ui/button"
import { useImageProcessor } from "@/lib/hooks/use-image-processor"
import { useImageStore } from "@/store/use-image-store"
import { createNewFilename, formatBytes, getBaseName } from "@/lib/utils"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { Download } from "lucide-react"

/**
 * Trang chính của ứng dụng
 */
export default function Home() {
  const originals = useImageStore((state) => state.originals)
  const processed = useImageStore((state) => state.processed)
  const processing = useImageStore((state) => state.processing)
  const error = useImageStore((state) => state.error)
  const options = useImageStore((state) => state.options)
  const reset = useImageStore((state) => state.reset)
  // processImage is now triggered by useEffect in useImageProcessor, no direct call needed here
  useImageProcessor()

  const handleDownloadAll = async () => {
    if (processed.length === 0) return

    const zip = new JSZip()
    processed.forEach((img) => {
      const originalFile = originals.find((o) => o.id === img.id)
      if (originalFile) {
        const newFileName = createNewFilename(
          originalFile.file.name,
          `_${options.format}_${options.quality}`,
          options.format
        )
        zip.file(newFileName, img.blob)
      }
    })

    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" })

    // Save the ZIP file
    saveAs(zipBlob, "MinifyIMG_images.zip")
  }

  return (
    <main className="container py-4">
      <div className="mx-auto" style={{maxWidth: '900px'}}>
        <div className="text-center mb-4">
          <h1 className="display-4 fw-bold">MinifyIMG</h1>
          <p className="mt-2 text-secondary">
            Tối ưu và chuyển đổi định dạng ảnh trực tiếp trên trình duyệt
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row g-4">
          <div className="col-md-6">
            <h2 className="h5 fw-semibold mb-3">Tải ảnh lên</h2>
            <ImageDropzone />
            {originals.length > 0 && (
              <Button onClick={reset} variant="outline" className="w-100 mt-2">
                Xóa tất cả ảnh
              </Button>
            )}
          </div>

          <div className="col-md-6">
            <h2 className="h5 fw-semibold mb-3">Tùy chọn xử lý</h2>
            <ImageSettings />
            {processed.length > 0 && (
              <Button
                onClick={handleDownloadAll}
                disabled={processing}
                className="w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
              >
                <Download className="w-4 h-4" /> Tải xuống tất cả
              </Button>
            )}
          </div>
        </div>

        {originals.length > 0 && (
          <div className="mt-5">
            <ImagePreview />
          </div>
        )}
      </div>
    </main>
  )
}
