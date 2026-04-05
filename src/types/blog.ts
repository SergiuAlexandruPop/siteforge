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
  /** If true, this post is shown as a featured hero card at the top of the blog page. */
  pinned: boolean
}

export interface BlogPost {
  meta: BlogMeta
  contentHtml: string
}
