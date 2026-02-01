import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/checkout/success',
        '/_next/',
        '/favicon.ico',
      ],
    },
    sitemap: 'https://songgift.app/sitemap.xml',
  }
}
