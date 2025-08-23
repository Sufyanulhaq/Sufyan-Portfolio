import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Sufyan Ul Haq - Full-Stack Developer & Digital Strategist | Liverpool, UK",
    template: "%s | Sufyan Ul Haq - Full-Stack Developer"
  },
  description: "Professional full-stack developer based in Liverpool, UK. Specializing in React, Next.js, Node.js, and modern web technologies. Transform your business with exceptional web development services.",
  keywords: [
    "Full-Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "Liverpool",
    "UK",
    "Web Development",
    "E-commerce",
    "Web Applications",
    "UI/UX Design",
    "Performance Optimization",
    "SEO",
    "Digital Strategy"
  ],
  authors: [{ name: "Sufyan Ul Haq" }],
  creator: "Sufyan Ul Haq",
  publisher: "Sufyan Ul Haq",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sufyanulhaq.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://sufyanulhaq.com',
    title: 'Sufyan Ul Haq - Full-Stack Developer & Digital Strategist',
    description: 'Professional full-stack developer based in Liverpool, UK. Specializing in React, Next.js, Node.js, and modern web technologies.',
    siteName: 'Sufyan Ul Haq Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sufyan Ul Haq - Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sufyan Ul Haq - Full-Stack Developer & Digital Strategist',
    description: 'Professional full-stack developer based in Liverpool, UK. Specializing in React, Next.js, Node.js, and modern web technologies.',
    images: ['/og-image.jpg'],
    creator: '@sufyanulhaq',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'Web Development',
  other: {
    'geo.region': 'GB',
    'geo.placename': 'Liverpool',
    'geo.position': '53.4084;-2.9916',
    'ICBM': '53.4084, -2.9916',
    'DC.title': 'Sufyan Ul Haq - Full-Stack Developer',
    'DC.creator': 'Sufyan Ul Haq',
    'DC.subject': 'Web Development, Full-Stack Development, React, Next.js',
    'DC.description': 'Professional full-stack developer based in Liverpool, UK',
    'DC.publisher': 'Sufyan Ul Haq',
    'DC.contributor': 'Sufyan Ul Haq',
    'DC.date': '2025',
    'DC.type': 'Text',
    'DC.format': 'text/html',
    'DC.identifier': 'https://sufyanulhaq.com',
    'DC.language': 'en',
    'DC.coverage': 'Liverpool, UK',
    'DC.rights': 'Copyright 2025 Sufyan Ul Haq'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Sufyan Ul Haq",
              "jobTitle": "Full-Stack Developer & Digital Strategist",
              "description": "Professional full-stack developer specializing in modern web technologies and digital solutions",
              "url": "https://sufyanulhaq.com",
              "sameAs": [
                "https://github.com/sufyanulhaq",
                "https://linkedin.com/in/sufyanulhaq",
                "https://twitter.com/sufyanulhaq"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Liverpool",
                "addressCountry": "GB",
                "addressRegion": "England"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+44-746-975-3723",
                "contactType": "customer service",
                "areaServed": "GB",
                "availableLanguage": "English"
              },
              "knowsAbout": [
                "Web Development",
                "React",
                "Next.js",
                "Node.js",
                "TypeScript",
                "Full-Stack Development",
                "UI/UX Design",
                "Performance Optimization",
                "SEO"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance Developer"
              },
              "image": "https://sufyanulhaq.com/professional-developer-portrait.png"
            })
          }}
        />
        
        {/* Business Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Sufyan Ul Haq Web Development",
              "description": "Professional web development services in Liverpool, UK",
              "url": "https://sufyanulhaq.com",
              "telephone": "+44-746-975-3723",
              "email": "hello@sufyanulhaq.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Liverpool",
                "addressLocality": "Liverpool",
                "addressRegion": "England",
                "postalCode": "L1",
                "addressCountry": "GB"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 53.4084,
                "longitude": -2.9916
              },
              "openingHours": "Mo-Fr 09:00-18:00",
              "priceRange": "££",
              "currenciesAccepted": "GBP",
              "paymentAccepted": "Bank Transfer, PayPal, Credit Card",
              "areaServed": {
                "@type": "Country",
                "name": "United Kingdom"
              },
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 53.4084,
                  "longitude": -2.9916
                },
                "geoRadius": "50000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Web Development Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Website Development",
                      "description": "Custom websites built with modern technologies"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "E-commerce Solutions",
                      "description": "Complete online stores with payment processing"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Web Applications",
                      "description": "Custom business applications and dashboards"
                    }
                  }
                ]
              }
            })
          }}
        />
        
        {/* WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Sufyan Ul Haq Portfolio",
              "url": "https://sufyanulhaq.com",
              "description": "Professional portfolio and web development services",
              "publisher": {
                "@type": "Person",
                "name": "Sufyan Ul Haq"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://sufyanulhaq.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sufyan Ul Haq" />
        
        {/* Additional SEO meta tags */}
        <meta name="author" content="Sufyan Ul Haq" />
        <meta name="copyright" content="Copyright 2025 Sufyan Ul Haq" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Local business specific meta tags */}
        <meta name="geo.region" content="GB" />
        <meta name="geo.placename" content="Liverpool" />
        <meta name="geo.position" content="53.4084;-2.9916" />
        <meta name="ICBM" content="53.4084, -2.9916" />
        
        {/* Social media meta tags */}
        <meta property="og:site_name" content="Sufyan Ul Haq Portfolio" />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:site" content="@sufyanulhaq" />
        <meta name="twitter:creator" content="@sufyanulhaq" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
