<template>
  <div class="validate-input-container pb-3 position-relative">
    <input
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      :value="inputRef.val"
      @blur="validateInput"
      @input="updateValue"
      v-bind="$attrs"
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
import { defineComponent, reactive, PropType, onMounted } from 'vue'
import { emitter } from './ValidateFrom.vue'

const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

interface RuleProp {
  type: 'required' | 'emailReg';
  message: string;
}

export type RulesProp = RuleProp[]

export default defineComponent({

  props: {
    rules: Array as PropType<RuleProp>,
    modelValue: String
  },

  inheritAttrs: false,

  setup(props, context) {
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })

    const updateValue = (e: KeyboardEvent) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }

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
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('from-item-created', validateInput)
    })

    return {
      inputRef,
      validateInput,
      updateValue
    }
  }

})
</script>

<style>
</style>