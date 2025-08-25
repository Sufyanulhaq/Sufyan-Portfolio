import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
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
    
    // For testing, return a unique placeholder URL
    const uniqueId = Math.random().toString(36).substring(2, 15)
    const testUrl = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center&auto=format&q=80&id=${uniqueId}&filename=${encodeURIComponent(file.name)}&timestamp=${timestamp}`

    return NextResponse.json({
      success: true,
      url: testUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      test: true,
      message: 'This is a test upload - each file gets a unique URL'
    })

  } catch (error) {
    console.error('Error in test upload:', error)
    return NextResponse.json(
      { error: 'Failed to process test upload' },
      { status: 500 }
    )
  }
}
