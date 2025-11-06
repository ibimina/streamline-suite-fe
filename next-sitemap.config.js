/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://streamline-suite.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/404'],
      },
    ],
    additionalSitemaps: ['https://streamline-suite.vercel.app/sitemap.xml'],
  },
  exclude: [
    '/404',
    '/500',
    '/admin/*',
    '/api/*',
    '/_next/*',
    '/dashboard/*', // Protect dashboard routes
    '/login',
    '/signup',
  ],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Custom transform function for specific pages
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }

    if (path.startsWith('/features') || path.startsWith('/pricing')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }

    // Default return
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
  additionalPaths: async config => {
    // Add any dynamic paths here if needed
    return []
  },
}
