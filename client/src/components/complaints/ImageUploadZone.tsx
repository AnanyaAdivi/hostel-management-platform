import { Upload, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export default function ImageUploadZone({
  imagePreview,
  onDrop,
  onClear,
}: {
  imagePreview: string | null
  onDrop: (file: File) => void
  onClear: () => void
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) {
        onDrop(files[0])
      }
    },
  })

  if (imagePreview) {
    return (
      <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
        <img
          src={imagePreview}
          alt="preview"
          style={{ width: '100%', maxHeight: 220, objectFit: 'cover' }}
        />
        <button
          type="button"
          onClick={onClear}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: 999,
            border: 'none',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? 'var(--accent-primary)' : 'var(--border-default)'}`,
        borderRadius: 10,
        padding: '2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragActive ? 'rgba(108,99,255,0.05)' : 'var(--bg-tertiary)',
        transition: 'all 0.15s',
      }}
    >
      <input {...getInputProps()} />
      <Upload size={24} style={{ margin: '0 auto 8px', color: 'var(--text-tertiary)' }} />
      <p style={{ color: 'var(--text-tertiary)', fontSize: 13, margin: 0 }}>
        Drag and drop or click to upload
      </p>
      <p style={{ color: 'var(--text-tertiary)', fontSize: 11, marginTop: 4 }}>
        JPEG, PNG, WEBP up to 5MB
      </p>
    </div>
  )
}
