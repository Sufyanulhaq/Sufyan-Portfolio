import type { Metadata } from "next"

interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article" | "profile"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

const defaultSEO = {
  title: "Sufyan - Full Stack Developer",
  description:
    "Professional full-stack developer specializing in modern web technologies. Building scalable applications with React, Next.js, and Node.js.",
  keywords: ["full stack developer", "web developer", "react", "nextjs", "nodejs", "typescript"],
  image: "/og-image.png",
  url: "https://sufyan.dev",
}

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title = defaultSEO.title,
    description = defaultSEO.description,
    keywords = defaultSEO.keywords,
    image = defaultSEO.image,
    url = defaultSEO.url,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
  } = config

  const fullTitle = title === defaultSEO.title ? title : `${title} | ${defaultSEO.title}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: author ? [{ name: author }] : [{ name: "Sufyan" }],
    creator: "Sufyan",
    publisher: "Sufyan",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type,
      locale: "en_US",
      url,
      title: fullTitle,
      description,
      siteName: defaultSEO.title,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : ["Sufyan"],
        section,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@sufyan_dev",
    },
    alternates: {
      canonical: url,
    },
    other: {
      "msapplication-TileColor": "#0ea5e9",
      "theme-color": "#0ea5e9",
    },
  }
}

export function generateStructuredData(config: {
  type: "Person" | "Article" | "WebSite" | "Organization"
  data: Record<string, any>
}) {
  const baseUrl = defaultSEO.url

  const structuredData = {
    "@context": "https://schema.org",
    "@type": config.type,
    ...config.data,
  }

  if (config.type === "Person") {
    return {
      ...structuredData,
      url: baseUrl,
      sameAs: ["https://github.com/sufyan", "https://linkedin.com/in/sufyan", "https://twitter.com/sufyan_dev"],
    }
  }

  if (config.type === "WebSite") {
    return {
      ...structuredData,
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    }
  }

  return structuredData
}
