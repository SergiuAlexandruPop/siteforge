export interface BlogMeta {
  title: string
  slug: string
  date: string
  author: string
  excerpt: string
  featuredImage: string
  published: boolean
  readingTime: number
  tags: string[]
}

export interface BlogPost {
  meta: BlogMeta
  contentHtml: string
}
