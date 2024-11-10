"use client"

import * as React from "react"
import Link from "next/link"
import { categoryPathBySlug } from '../../lib/categories'
import { authorPathByName } from '../../lib/users'
import { formatDate } from '../../lib/datetime'
import { Avatar, AvatarFallback, AvatarImage } from "../../@/components/ui/avatar"
import { Badge } from "../../@/components/ui/badge"

interface Author {
  name: string
  avatar?: {
    url: string
    width: number
    height: number
  }
}

interface Category {
  slug: string
  name: string
}

interface MetadataProps {
  className?: string
  author?: Author
  date?: string
  categories?: Category[]
  options?: {
    compactCategories: boolean
  }
  isSticky?: boolean
}

const DEFAULT_METADATA_OPTIONS = {
  compactCategories: true,
}

export function Metadata({
  className,
  author,
  date,
  categories,
  options = DEFAULT_METADATA_OPTIONS,
  isSticky = false,
}: MetadataProps) {
  const { compactCategories } = options

  return (
    <ul className={`flex flex-wrap items-center gap-4 mt-5 text-sm text-muted-foreground ${className}`}>
      {author && (
        <li className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            {author.avatar && (
              <AvatarImage src={author.avatar.url} alt={`${author.name}'s avatar`} />
            )}
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Link href={authorPathByName(author.name)} className="hover:text-primary hover:underline">
            {author.name}
          </Link>
        </li>
      )}
      {date && (
        <li>
          <time dateTime={date} className="text-xs">
            {formatDate(date)}
          </time>
        </li>
      )}
      {Array.isArray(categories) && categories.length > 0 && (
        <li>
          {compactCategories ? (
            <Badge variant="secondary" title={categories.map(({ name }) => name).join(", ")}>
              <Link href={categoryPathBySlug(categories[0].slug)} className="hover:text-primary">
                {categories[0].name}
              </Link>
              {categories.length > 1 && " +"}
            </Badge>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Badge variant="secondary">
                    <Link href={categoryPathBySlug(category.slug)} className="hover:text-primary">
                      {category.name}
                    </Link>
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </li>
      )}
    </ul>
  )
}

export default Metadata;
