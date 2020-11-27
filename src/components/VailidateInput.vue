<template>
  <div class="validate-input-container pb-3">
    <input
      type="text"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      v-model="inputRef.val"
      @blur="validateInput"
    />
    <div
      id="validationServer05Feedback"
      class="invalid-feedback"
      v-if="inputRef.error"
    >
      {{ inputRef.message }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from 'vue'

const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

interface RuleProp {
  type: 'required' | 'emailReg';
  message: string;
}

export type RulesProp = RuleProp[]

export default defineComponent({

  props: {
    rules: Array as PropType<RuleProp>
  },

  setup(props) {
    const inputRef = reactive({
      val: '',
      error: false,
      message: ''
    })

    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(item => {
          let passed = true
          inputRef.message = item.message
          switch (item.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
      }
    }

    return {
      inputRef,
      validateInput
    }
  }

})
</script>

<style>
</style>
