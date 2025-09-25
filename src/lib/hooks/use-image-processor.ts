import { useCallback, useEffect } from "react"
import imageCompression from "browser-image-compression"
import { useImageStore } from "@/store/use-image-store"
import type { ImageFormat } from "@/store/use-image-store"

/**
 * Chuyển đổi ảnh sang định dạng khác
 */
async function convertImageFormat(
  inputBlob: Blob,
  format: ImageFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // Tạo canvas
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      // Vẽ ảnh lên canvas
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Không thể tạo canvas context'))
        return
      }
      ctx.drawImage(img, 0, 0)

      // Chuyển đổi sang định dạng mới
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Không thể chuyển đổi định dạng'))
          }
        },
        `image/${format}`,
        quality / 100
      )
    }

    img.onerror = () => {
      reject(new Error('Không thể tải ảnh'))
    }

    // Tạo object URL từ blob
    img.src = URL.createObjectURL(inputBlob)
  })
}

/**
 * Hook xử lý ảnh
 */
export function useImageProcessor() {
  const options = useImageStore((state) => state.options)
  const originals = useImageStore((state) => state.originals)
  const setProcessed = useImageStore((state) => state.setProcessed)
  const setProcessing = useImageStore((state) => state.setProcessing)
  const setError = useImageStore((state) => state.setError)

  const processImage = useCallback(
    async (originalFile: { id: string; file: File }) => {
      try {
        // Bước 1: Nén ảnh (nếu cần resize)
        let processedBlob: Blob
        if (options.resize.enabled && (options.resize.width || options.resize.height)) {
          const compressionOptions = {
            maxSizeMB: 10, // Giá trị lớn để không ảnh hưởng đến chất lượng
            maxWidthOrHeight: Math.max(options.resize.width || 0, options.resize.height || 0),
            useWebWorker: true,
            fileType: 'image/png', // Sử dụng PNG để giữ chất lượng tốt nhất
            initialQuality: 1,
          }
          const compressedFile = await imageCompression(originalFile.file, compressionOptions)
          processedBlob = compressedFile
        } else {
          // Nếu không resize, sử dụng file gốc
          processedBlob = originalFile.file
        }

        // Bước 2: Chuyển đổi định dạng
        const finalBlob = await convertImageFormat(
          processedBlob,
          options.format,
          options.quality
        )

        // Cập nhật state cho từng ảnh
        setProcessed(originalFile.id, finalBlob)
      } catch (error) {
        console.error(`Lỗi xử lý ảnh ${originalFile.file.name}:`, error)
        setError(`Có lỗi xảy ra khi xử lý ảnh ${originalFile.file.name}`)
      }
    },
    [options, setProcessed, setError]
  )

  useEffect(() => {
    if (originals.length > 0) {
      setProcessing(true)
      Promise.all(originals.map(processImage)).finally(() => {
        setProcessing(false)
      })
    }
  }, [originals, options, processImage, setProcessing])

  return { processImage }
}
