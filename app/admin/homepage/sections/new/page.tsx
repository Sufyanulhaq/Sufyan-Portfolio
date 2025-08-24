'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus,
  X,
  Image,
  Palette,
  Type,
  Layout,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface SectionData {
  section_name: string
  section_type: string
  title: string
  subtitle: string
  content: string
  background_image: string
  background_color: string
  text_color: string
  layout: string
  sort_order: number
  is_active: boolean
  is_published: boolean
  meta_title: string
  meta_description: string
  custom_css: string
}

const sectionTypes = [
  { value: 'hero', label: 'Hero Section', description: 'Main banner with call-to-action' },
  { value: 'content', label: 'Content Block', description: 'Text and media content' },
  { value: 'image', label: 'Image Section', description: 'Image-focused content' },
  { value: 'layout', label: 'Layout Section', description: 'Custom layout container' },
  { value: 'testimonial', label: 'Testimonial', description: 'Client feedback section' },
  { value: 'cta', label: 'Call to Action', description: 'Action-oriented section' }
]

const layoutOptions = [
  { value: 'full-width', label: 'Full Width' },
  { value: 'container', label: 'Container' },
  { value: 'two-column', label: 'Two Column' },
  { value: 'three-column', label: 'Three Column' },
  { value: 'grid', label: 'Grid Layout' },
  { value: 'centered', label: 'Centered' }
]

export default function NewSectionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  
  const [sectionData, setSectionData] = useState<SectionData>({
    section_name: '',
    section_type: 'content',
    title: '',
    subtitle: '',
    content: '',
    background_image: '',
    background_color: '',
    text_color: '',
    layout: 'container',
    sort_order: 1,
    is_active: true,
    is_published: false,
    meta_title: '',
    meta_description: '',
    custom_css: ''
  })

  const handleInputChange = (field: keyof SectionData, value: string | number | boolean) => {
    setSectionData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!sectionData.section_name || !sectionData.title) {
      alert('Please fill in required fields')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement actual API call to save section
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Section created successfully!')
      router.push('/admin/homepage')
    } catch (error) {
      console.error('Error creating section:', error)
      alert('Failed to create section')
    } finally {
      setIsLoading(false)
    }
  }

  const getSectionTypeDescription = () => {
    const type = sectionTypes.find(t => t.value === sectionData.section_type)
    return type?.description || ''
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/homepage">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Homepage CMS
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Create New Section</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Section
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 lg:p-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="section_name">Section Name *</Label>
                    <Input
                      id="section_name"
                      value={sectionData.section_name}
                      onChange={(e) => handleInputChange('section_name', e.target.value)}
                      placeholder="e.g., Hero Banner, About Section"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section_type">Section Type *</Label>
                    <Select 
                      value={sectionData.section_type} 
                      onValueChange={(value) => handleInputChange('section_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sectionTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {getSectionTypeDescription()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={sectionData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Section title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={sectionData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="Section subtitle"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={sectionData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Section content (supports HTML)"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visual Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Visual Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="background_image">Background Image URL</Label>
                    <Input
                      id="background_image"
                      value={sectionData.background_image}
                      onChange={(e) => handleInputChange('background_image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="background_color">Background Color</Label>
                    <Input
                      id="background_color"
                      value={sectionData.background_color}
                      onChange={(e) => handleInputChange('background_color', e.target.value)}
                      placeholder="#ffffff or CSS color"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="text_color">Text Color</Label>
                    <Input
                      id="text_color"
                      value={sectionData.text_color}
                      onChange={(e) => handleInputChange('text_color', e.target.value)}
                      placeholder="#000000 or CSS color"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="layout">Layout</Label>
                    <Select 
                      value={sectionData.layout} 
                      onValueChange={(value) => handleInputChange('layout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {layoutOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={sectionData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                    placeholder="SEO title for this section"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={sectionData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="SEO description for this section"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom_css">Custom CSS</Label>
                  <Textarea
                    id="custom_css"
                    value={sectionData.custom_css}
                    onChange={(e) => handleInputChange('custom_css', e.target.value)}
                    placeholder="Custom CSS styles for this section"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={sectionData.sort_order}
                    onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value))}
                    min="1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    checked={sectionData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published">Published</Label>
                  <Switch
                    id="is_published"
                    checked={sectionData.is_published}
                    onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {sectionData.section_type}
                  </div>
                  <div>
                    <span className="font-medium">Layout:</span> {sectionData.layout}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> 
                    <Badge className="ml-2" variant={sectionData.is_published ? 'default' : 'secondary'}>
                      {sectionData.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
