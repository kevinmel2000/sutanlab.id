<template>
  <PageList
    :contents="contents"
    :total="total"
  />
</template>

<script>
import { formatReadingTime } from '~/utils/helpers'
import PageList from '~/components/Blog/PageList'
import posts from '~/contents/posts/published'

export default {
  components: {
    PageList
  },
  asyncData: () => (
    Promise.all(posts.map(content => (
      import(`~/contents/posts/published/${content.name}/index.md`)
        .then(content => ({
          ...content.attributes,
          readingtime: formatReadingTime(content.html)
        }))
    ))).then(res => ({
      contents: res.slice(0, process.env.BLOG_PAGINATION_LIMIT),
      total: res.length
    }))
  )
}
</script>
