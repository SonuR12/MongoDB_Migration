import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mongodbmigrate.vercel.app'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-04-23'),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}