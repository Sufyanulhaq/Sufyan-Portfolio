import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  Image, 
  File, 
  FolderOpen, 
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Trash2,
  Edit,
  Eye,
  Copy,
  Plus,
  FolderPlus,
  ImagePlus,
  FileText,
  Video,
  Music,
  Archive
} from 'lucide-react'
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent Vercel build issues
export const dynamic = 'force-dynamic'

async function getMediaLibrary() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Get media files with categories and usage info
    const mediaFiles = await sql`
      SELECT 
        ml.id,
        ml.filename,
        ml.original_name,
        ml.file_path,
        ml.file_size,
        ml.mime_type,
        ml.category,
        ml.tags,
        ml.alt_text,
        ml.caption,
        ml.usage_count,
        ml.created_at,
        ml.updated_at,
        u.name as uploaded_by
      FROM cms.media_library ml
      LEFT JOIN cms.users u ON ml.uploaded_by = u.id
      ORDER BY ml.created_at DESC
    `

    // Get media statistics
    const [totalFiles, totalSize, imageCount, documentCount] = await Promise.all([
      sql`SELECT COUNT(*) FROM cms.media_library`,
      sql`SELECT COALESCE(SUM(file_size), 0) FROM cms.media_library`,
      sql`SELECT COUNT(*) FROM cms.media_library WHERE mime_type LIKE 'image/%'`,
      sql`SELECT COUNT(*) FROM cms.media_library WHERE mime_type LIKE 'application/%'`
    ])

    return {
      mediaFiles: mediaFiles.map(file => ({
        ...file,
        created_at: file.created_at?.toISOString(),
        updated_at: file.updated_at?.toISOString()
      })),
      stats: {
        totalFiles: parseInt(totalFiles[0]?.count || '0'),
        totalSize: parseInt(totalSize[0]?.coalesce || '0'),
        imageCount: parseInt(imageCount[0]?.count || '0'),
        documentCount: parseInt(documentCount[0]?.count || '0')
      }
    }
  } catch (error) {
    console.error('Error fetching media library:', error)
    return {
      mediaFiles: [],
      stats: {
        totalFiles: 0,
        totalSize: 0,
        imageCount: 0,
        documentCount: 0
      }
    }
  }
}

export default async function MediaLibraryPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  
  const mediaData = await getMediaLibrary()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-8 w-8 text-blue-600" />
    if (mimeType.startsWith('video/')) return <Video className="h-8 w-8 text-purple-600" />
    if (mimeType.startsWith('audio/')) return <Music className="h-8 w-8 text-green-600" />
    if (mimeType.startsWith('application/pdf')) return <FileText className="h-8 w-8 text-red-600" />
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileText className="h-8 w-8 text-blue-600" />
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="h-8 w-8 text-orange-600" />
    return <File className="h-8 w-8 text-gray-600" />
  }

  const getFileTypeColor = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'bg-blue-100 text-blue-800'
    if (mimeType.startsWith('video/')) return 'bg-purple-100 text-purple-800'
    if (mimeType.startsWith('audio/')) return 'bg-green-100 text-green-800'
    if (mimeType.startsWith('application/')) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Media Library</h1>
            <span className="text-sm text-muted-foreground">
              Manage and organize your website assets
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 lg:p-12">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaData.stats.totalFiles}</div>
              <p className="text-xs text-muted-foreground">
                All media files
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(mediaData.stats.totalSize)}</div>
              <p className="text-xs text-muted-foreground">
                Storage used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaData.stats.imageCount}</div>
              <p className="text-xs text-muted-foreground">
                Visual assets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaData.stats.documentCount}</div>
              <p className="text-xs text-muted-foreground">
                PDFs & files
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Organize</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files by name, tags, or category..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Grid3X3 className="mr-2 h-4 w-4" />
                  Grid
                </Button>
                <Button variant="outline" size="sm">
                  <List className="mr-2 h-4 w-4" />
                  List
                </Button>
                <Button variant="outline" size="sm">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Media Files</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Add Images
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mediaData.mediaFiles.length === 0 ? (
              <div className="text-center py-12">
                <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="mt-4 text-lg font-medium">No media files yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Upload your first image or document to get started.
                </p>
                <Button className="mt-4">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {mediaData.mediaFiles.map((file) => (
                  <div key={file.id} className="group relative border rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                    {/* File Preview */}
                    <div className="relative aspect-square mb-4 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {file.mime_type.startsWith('image/') ? (
                        <img
                          src={file.file_path}
                          alt={file.alt_text || file.original_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        getFileIcon(file.mime_type)
                      )}
                      
                      {/* Usage Badge */}
                      {file.usage_count > 0 && (
                        <Badge className="absolute top-2 right-2 bg-blue-600 text-white">
                          {file.usage_count} uses
                        </Badge>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {file.original_name}
                        </h3>
                        <Badge className={getFileTypeColor(file.mime_type)}>
                          {file.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>{formatFileSize(file.file_size)}</p>
                        <p>Uploaded: {formatDate(file.created_at)}</p>
                        {file.uploaded_by && (
                          <p>By: {file.uploaded_by}</p>
                        )}
                      </div>

                      {/* Tags */}
                      {file.tags && file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {file.tags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {file.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{file.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-1">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
