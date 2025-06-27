import { useRef } from 'react'

interface PDFUploaderProps {
  onUpload: (file: File) => void
  isLoading: boolean
  currentPDF: string | null
  onRemove: () => void
}

// Simple PDF Upload Component (inline for testing)
export const PDFUploader = ({
  onUpload,
  isLoading,
  currentPDF,
  onRemove,
}: PDFUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      console.log('PDF file selected:', file.name)
      onUpload(file)
    } else {
      alert('Please select a valid PDF file')
    }
  }

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Loading PDF...' : 'Upload PDF Plan'}
        </button>

        {currentPDF && (
          <button
            onClick={onRemove}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove PDF
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {currentPDF && (
        <div className="text-sm text-gray-600 mb-2">Current: {currentPDF}</div>
      )}
    </div>
  )
}
