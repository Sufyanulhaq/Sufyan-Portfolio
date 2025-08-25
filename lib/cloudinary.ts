import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
}

export async function uploadImage(file: Buffer, filename: string): Promise<UploadResult> {
  try {
    // Convert buffer to base64
    const base64Image = file.toString('base64')
    const dataURI = `data:image/jpeg;base64,${base64Image}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'portfolio-blog',
      public_id: filename.replace(/\.[^/.]+$/, ''), // Remove file extension
      overwrite: false,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    })

    return {
      url: result.secure_url,
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === 'ok'
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return false
  }
}

export async function getImageUrl(publicId: string, options: {
  width?: number
  height?: number
  crop?: string
  quality?: string
} = {}): Promise<string> {
  try {
    const transformation = []
    
    if (options.width) transformation.push({ width: options.width })
    if (options.height) transformation.push({ height: options.height })
    if (options.crop) transformation.push({ crop: options.crop })
    if (options.quality) transformation.push({ quality: options.quality })
    
    const url = cloudinary.url(publicId, {
      transformation,
      secure: true
    })
    
    return url
  } catch (error) {
    console.error('Cloudinary URL generation error:', error)
    throw new Error('Failed to generate image URL')
  }
}
