<template>
  <article-detail :is-edit="true"/>
</template>

<script>
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'EditForm',
  created() {
    console.log(this.$route.query.id)
  },
  components: { ArticleDetail }
}
</script>

