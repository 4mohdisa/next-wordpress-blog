"use client"

import * as React from "react"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { postPathBySlug, sanitizeExcerpt } from '../../lib/posts'
import Metadata from '../Metadata'
import { Card, CardContent, CardHeader, CardTitle } from "../../@/components/ui/card"

interface Post {
  title: string
  excerpt?: string
  slug: string
  date?: string
  author?: object
  categories?: object[]
  isSticky?: boolean
}

interface PostCardOptions {
  excludeMetadata?: string[]
}

interface PostCardProps {
  post: Post
  options?: PostCardOptions
}

export function PostCard({ post, options = {} }: PostCardProps) {
  const { title, excerpt, slug, date, author, categories, isSticky = false } = post
  const { excludeMetadata = [] } = options

  const metadata: Record<string, any> = {}

  if (!excludeMetadata.includes('author')) {
    metadata.author = author
  }

  if (!excludeMetadata.includes('date')) {
    metadata.date = date
  }

  if (!excludeMetadata.includes('categories')) {
    metadata.categories = categories
  }

  const truncateExcerpt = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <Card className={`relative transition-all hover:border-primary ${isSticky ? 'border-primary rounded-xl' : ''}`}>
      <CardHeader className="relative p-4 sm:p-6">
        {isSticky && (
          <MapPin className="absolute right-2 top-2 h-4 w-4 text-muted-foreground" aria-label="Sticky Post" />
        )}
        <Link href={postPathBySlug(slug)} className="no-underline">
          <CardTitle className="text-lg sm:text-xl md:text-2xl hover:text-primary hover:underline transition-colors" dangerouslySetInnerHTML={{ __html: title }} />
        </Link>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        <Metadata className="mb-4" {...metadata} />
        {excerpt && (
          <div className="text-sm sm:text-base text-muted-foreground" dangerouslySetInnerHTML={{
            __html: truncateExcerpt(sanitizeExcerpt(excerpt), 150)
          }} />
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
