import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mongodbmigrate.vercel.app'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date('2024-12-19'),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}