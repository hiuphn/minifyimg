import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { useImageStore } from "@/store/use-image-store"
import { isImageFile } from "@/lib/utils"

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
}

/**
 * Component cho phép kéo thả hoặc chọn file ảnh
 */
export function ImageDropzone() {
  const setOriginals = useImageStore((state) => state.setOriginals)
  const setError = useImageStore((state) => state.setError)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        setError("Vui lòng chọn ít nhất một file ảnh")
        return
      }

      const validFiles = acceptedFiles.filter((file) => {
        if (!isImageFile(file)) {
          setError(`File "${file.name}" không phải là ảnh.`)
          return false
        }
        if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
          setError(`Định dạng ảnh "${file.name}" không được hỗ trợ. Vui lòng sử dụng JPG, PNG hoặc WebP.`)
          return false
        }
        return true
      })

      if (validFiles.length > 0) {
        setOriginals(validFiles)
      }
    },
    [setOriginals, setError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    multiple: true, // Allow multiple files
    noClick: false, // Allow clicking to open file dialog
    noKeyboard: false, // Allow keyboard navigation
  })

  return (
    <div
      {...getRootProps()}
      className={`border border-2 rounded-3 d-flex flex-column align-items-center justify-content-center w-100" style={{height: '256px', cursor: 'pointer', background: isDragActive ? '#e9ecef' : '#f8f9fa'}}`}
    >
      <input 
        {...getInputProps()} 
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        style={{ display: 'none' }}
      />
      <div className="d-flex flex-column align-items-center justify-content-center pt-3 pb-4">
        <Upload
          className={`mb-3" style={{width: '40px', height: '40px', color: isDragActive ? '#0d6efd' : '#adb5bd'}}`}
        />
        <p className="mb-2 text-secondary">
          {isDragActive ? (
            <span className="fw-semibold text-primary">Thả ảnh vào đây</span>
          ) : (
            <span>
              <span className="fw-semibold">Nhấp để tải lên</span> hoặc kéo thả
            </span>
          )}
        </p>
        <p className="text-muted small">
          JPG, PNG hoặc WebP • Chọn nhiều ảnh cùng lúc
        </p>
      </div>
    </div>
  )
}
