import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-actions'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    
    try {
      // Upload to Cloudinary
      const uploadResult = await uploadImage(buffer, filename)
      
      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height
      })
    } catch (uploadError) {
      console.error('Cloudinary upload failed:', uploadError)
      
      // Fallback to placeholder if Cloudinary fails
      const uniqueId = Math.random().toString(36).substring(2, 15)
      const fallbackUrl = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center&auto=format&q=80&id=${uniqueId}&filename=${encodeURIComponent(file.name)}`
      
      return NextResponse.json({
        success: true,
        url: fallbackUrl,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        fallback: true
      })
    }

  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 })
    }

    // Delete file
    const filePath = join(process.cwd(), 'public', 'uploads', 'images', filename)
    
    try {
      const { unlink } = await import('fs/promises')
      await unlink(filePath)
      return NextResponse.json({ success: true, message: 'File deleted successfully' })
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
