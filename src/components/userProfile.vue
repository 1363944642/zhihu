<template>
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
      <img
        :src="url"
        :alt="author.nickName"
        class="rounded-circle img-thumbnail"
      />
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{ author.nickName }}</h6>
        <span class="text-truncate text-muted d-block">
          {{ author.description }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { addColumnAvatar } from '../helper'

export default defineComponent({
  props: {
    author: Object
  },
  setup(props) {
    const url = computed(() => {
      addColumnAvatar(props.author, 50, 50)
      const { avatar } = props.author
      return avatar && avatar.url
    })
    return {
      url
    }
  }
})
</script>
