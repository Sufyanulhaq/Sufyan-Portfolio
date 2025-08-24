'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  X, 
  Image, 
  File, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Save,
  Plus,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

interface FileWithPreview extends File {
  preview?: string
  id: string
}

interface FileMetadata {
  id: string
  altText: string
  caption: string
  category: string
  tags: string[]
}

export default function MediaUploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [metadata, setMetadata] = useState<FileMetadata[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newTag, setNewTag] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = (selectedFiles: File[]) => {
    const newFiles = selectedFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))

    setFiles(prev => [...prev, ...newFiles])
    
    // Initialize metadata for new files
    const newMetadata = newFiles.map(file => ({
      id: file.id,
      altText: '',
      caption: '',
      category: '',
      tags: []
    }))
    
    setMetadata(prev => [...prev, ...newMetadata])
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
    setMetadata(prev => prev.filter(meta => meta.id !== id))
  }

  const updateMetadata = (id: string, field: keyof FileMetadata, value: string | string[]) => {
    setMetadata(prev => prev.map(meta => 
      meta.id === id ? { ...meta, [field]: value } : meta
    ))
  }

  const addTag = (id: string) => {
    if (newTag.trim() && !metadata.find(meta => meta.id === id)?.tags.includes(newTag.trim())) {
      updateMetadata(id, 'tags', [...(metadata.find(meta => meta.id === id)?.tags || []), newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (id: string, tagToRemove: string) => {
    const meta = metadata.find(meta => meta.id === id)
    if (meta) {
      updateMetadata(id, 'tags', meta.tags.filter(tag => tag !== tagToRemove))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // TODO: Implement actual file upload to storage service
      // For now, just simulate success
      alert('Files uploaded successfully!')
      router.push('/admin/media')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-600" />
    return <File className="h-8 w-8 text-gray-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/media">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Media Library
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Upload Media Files</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || files.length === 0}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {uploadProgress}%
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Upload All
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 lg:p-12">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Area */}
          <div className="space-y-6">
            {/* Drag & Drop Zone */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                  onDragEnter={onDrag}
                  onDragLeave={onDrag}
                  onDragOver={onDrag}
                  onDrop={onDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {dragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild variant="outline">
                    <Label htmlFor="file-upload">
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Files
                    </Label>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* File List */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Files ({files.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {file.preview ? (
                            <img 
                              src={file.preview} 
                              alt={file.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            getFileIcon(file)
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)} • {file.type}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Metadata Editor */}
          {files.length > 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>File Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {files.map((file) => {
                      const meta = metadata.find(m => m.id === file.id)
                      if (!meta) return null

                      return (
                        <div key={file.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-4">
                            {file.preview ? (
                              <img 
                                src={file.preview} 
                                alt={file.name}
                                className="h-16 w-16 object-cover rounded"
                              />
                            ) : (
                              getFileIcon(file)
                            )}
                            <div>
                              <h4 className="font-medium text-sm">{file.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* Alt Text */}
                            <div>
                              <Label htmlFor={`alt-${file.id}`}>Alt Text</Label>
                              <Input
                                id={`alt-${file.id}`}
                                value={meta.altText}
                                onChange={(e) => updateMetadata(file.id, 'altText', e.target.value)}
                                placeholder="Describe this image for accessibility..."
                              />
                            </div>

                            {/* Caption */}
                            <div>
                              <Label htmlFor={`caption-${file.id}`}>Caption</Label>
                              <Textarea
                                id={`caption-${file.id}`}
                                value={meta.caption}
                                onChange={(e) => updateMetadata(file.id, 'caption', e.target.value)}
                                placeholder="Optional caption for this file..."
                                rows={2}
                              />
                            </div>

                            {/* Category */}
                            <div>
                              <Label htmlFor={`category-${file.id}`}>Category</Label>
                              <Input
                                id={`category-${file.id}`}
                                value={meta.category}
                                onChange={(e) => updateMetadata(file.id, 'category', e.target.value)}
                                placeholder="e.g., Portfolio, Blog, Services..."
                              />
                            </div>

                            {/* Tags */}
                            <div>
                              <Label>Tags</Label>
                              <div className="flex gap-2 mb-2">
                                <Input
                                  value={newTag}
                                  onChange={(e) => setNewTag(e.target.value)}
                                  placeholder="Add a tag..."
                                  onKeyPress={(e) => e.key === 'Enter' && addTag(file.id)}
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => addTag(file.id)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {meta.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {meta.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="gap-1">
                                      {tag}
                                      <button
                                        onClick={() => removeTag(file.id, tag)}
                                        className="ml-1 hover:text-red-600"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
