import { create } from "zustand"

export type ImageFormat = "jpeg" | "webp" | "png"

interface ProcessingOptions {
  format: ImageFormat
  quality: number
  resize: {
    width: number | null
    height: number | null
    enabled: boolean
  }
}

interface ImageState {
  // Thông tin ảnh gốc
  originals: {
    id: string
    file: File
    preview: string
    size: number
  }[]

  // Thông tin ảnh đã xử lý
  processed: {
    id: string
    blob: Blob
    preview: string
    size: number
  }[]

  // Trạng thái xử lý
  processing: boolean
  error: string | null

  // Tùy chọn xử lý
  options: ProcessingOptions

  // Actions
  setOriginals: (files: File[]) => void
  setProcessed: (id: string, blob: Blob) => void
  setProcessing: (processing: boolean) => void
  setError: (error: string | null) => void
  setOptions: (options: Partial<ProcessingOptions>) => void
  reset: () => void
}

const initialOptions: ProcessingOptions = {
  format: "webp", // Mặc định là WebP vì nén tốt nhất
  quality: 85, // Tăng chất lượng mặc định lên 85%
  resize: {
    width: null,
    height: null,
    enabled: false,
  },
}

export const useImageStore = create<ImageState>((set) => ({
  // Initial state
  originals: [],
  processed: [],
  processing: false,
  error: null,
  options: initialOptions,

  // Actions
  setOriginals: (files: File[]) =>
    set((state) => {
      // Cleanup existing object URLs
      state.originals.forEach((img) => URL.revokeObjectURL(img.preview))
      state.processed.forEach((img) => URL.revokeObjectURL(img.preview))

      return {
        originals: files.map((file) => ({
          id: file.name + file.size + file.lastModified, // Unique ID for each file
          file,
          preview: URL.createObjectURL(file),
          size: file.size,
        })),
        processed: [],
        error: null,
      }
    }),

  setProcessed: (id: string, blob: Blob) =>
    set((state) => {
      const existingProcessed = state.processed.find((img) => img.id === id)
      if (existingProcessed) {
        URL.revokeObjectURL(existingProcessed.preview)
      }

      const newProcessedImage = {
        id,
        blob,
        preview: URL.createObjectURL(blob),
        size: blob.size,
      }

      const updatedProcessed = existingProcessed
        ? state.processed.map((img) => (img.id === id ? newProcessedImage : img))
        : [...state.processed, newProcessedImage]

      return {
        processed: updatedProcessed,
        processing: false, // This might need adjustment if processing multiple images
        error: null,
      }
    }),

  setProcessing: (processing: boolean) => set({ processing }),

  setError: (error: string | null) => set({ error, processing: false }),

  setOptions: (options: Partial<ProcessingOptions>) =>
    set((state) => ({
      options: { ...state.options, ...options },
    })),

  reset: () => {
    set((state) => {
      // Cleanup object URLs
      state.originals.forEach((img) => URL.revokeObjectURL(img.preview))
      state.processed.forEach((img) => URL.revokeObjectURL(img.preview))

      return {
        originals: [],
        processed: [],
        processing: false,
        error: null,
        options: initialOptions,
      }
    })
  },
}))
