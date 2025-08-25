'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  disabled?: boolean
  className?: string
  maxSize?: number // in MB
  accept?: string[]
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className,
  maxSize = 5,
  accept = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSize}MB.`)
      return
    }

    // Validate file type
    if (!accept.includes(file.type)) {
      setError('Invalid file type. Only images are allowed.')
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(false)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onChange(data.url)
      setSuccess(true)
      
      // Clear success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000)

    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [onChange, maxSize, accept])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || isUploading,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false,
    maxSize: maxSize * 1024 * 1024
  })

  const handleRemove = async () => {
    if (value && onRemove) {
      // Extract filename from URL
      const filename = value.split('/').pop()
      if (filename) {
        try {
          await fetch(`/api/upload/image?filename=${filename}`, {
            method: 'DELETE'
          })
        } catch (error) {
          console.error('Error deleting file:', error)
        }
      }
      onRemove()
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {!value ? (
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={cn(
                "flex flex-col items-center justify-center space-y-4 cursor-pointer",
                "min-h-[200px] rounded-lg transition-colors",
                isDragActive && "bg-primary/5",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <input {...getInputProps()} />
              
              {isUploading ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="w-64 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              ) : success ? (
                <div className="flex flex-col items-center space-y-2">
                  <Check className="h-8 w-8 text-green-500" />
                  <p className="text-sm text-green-600">Upload successful!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {isDragActive
                        ? 'Drop your image here'
                        : 'Click to upload or drag and drop'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WebP up to {maxSize}MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="relative group">
          <Card>
            <CardContent className="p-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={value}
                  alt="Uploaded image"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4 mr-1" />
                <span className="truncate">{value.split('/').pop()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
