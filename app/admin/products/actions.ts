// app/admin/products/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function uploadImages(formData: FormData) {
  const files = formData.getAll('files') as File[]
  
  if (!files.length) {
    return { error: 'No files uploaded', urls: [] }
  }

  const urls: string[] = []

  for (const file of files) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${uuidv4()}.${fileExt}`
    const filePath = `products/${fileName}`
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { error: error.message, urls: [] }
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)
    
    urls.push(publicUrlData.publicUrl)
  }

  return { urls }
}

export async function deleteImage(imageUrl: string) {
  try {
    // Extract path from URL
    const urlParts = imageUrl.split('/storage/v1/object/public/product-images/')
    if (urlParts.length < 2) return { error: 'Invalid URL' }
    
    const filePath = urlParts[1]
    
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath])
    
    if (error) {
      console.error('Delete error:', error)
      return { error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { error: 'Failed to delete image' }
  }
}

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const discount_price = formData.get('discount_price') ? parseFloat(formData.get('discount_price') as string) : null
  const affiliate_link = formData.get('affiliate_link') as string
  const platform = formData.get('platform') as string
  const category_id = formData.get('category_id') as string
  const is_trending = formData.get('is_trending') === 'true'
  const imageUrls = JSON.parse(formData.get('image_urls') as string || '[]')
  
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      slug,
      description,
      price,
      discount_price,
      affiliate_link,
      platform,
      category_id: category_id || null,
      is_trending,
      images: imageUrls,
      rating: 0,
      is_active: true,
      created_at: new Date().toISOString()
    })
    .select()
  
  if (error) {
    console.error('Database error:', error)
    return { error: error.message }
  }
  
  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath(`/platform/${platform.toLowerCase()}`)
  revalidatePath('/admin/products')
  
  return { success: true, data }
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const discount_price = formData.get('discount_price') ? parseFloat(formData.get('discount_price') as string) : null
  const affiliate_link = formData.get('affiliate_link') as string
  const platform = formData.get('platform') as string
  const category_id = formData.get('category_id') as string
  const is_trending = formData.get('is_trending') === 'true'
  const images = JSON.parse(formData.get('images') as string || '[]')
  
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  
  const { data, error } = await supabase
    .from('products')
    .update({
      name,
      slug,
      description,
      price,
      discount_price,
      affiliate_link,
      platform,
      category_id: category_id || null,
      is_trending,
      images,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Database error:', error)
    return { error: error.message }
  }
  
  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath(`/platform/${platform.toLowerCase()}`)
  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/edit/${id}`)
  
  return { success: true, data }
}

export async function deleteProduct(productId: string) {
  // First get product to delete its images
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('images')
    .eq('id', productId)
    .single()
  
  if (fetchError) {
    return { error: fetchError.message }
  }
  
  // Delete images from storage
  if (product.images && product.images.length > 0) {
    for (const imageUrl of product.images) {
      const urlParts = imageUrl.split('/storage/v1/object/public/product-images/')
      if (urlParts.length >= 2) {
        const filePath = urlParts[1]
        await supabase.storage.from('product-images').remove([filePath])
      }
    }
  }
  
  // Delete product from database
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/admin/products')
  
  return { success: true }
}