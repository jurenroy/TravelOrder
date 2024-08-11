<template>
    <div class="button-cont">
      <button :disabled="disabled" @click="handleClick" :class="classNames">
        {{ label }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: "CustomButton",
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      label: {
        type: String,
        required: true,
      },
      classNames: {
        type: [String, Array, Object],
        default: ''
      }
    },
    methods: {
      handleClick(event) {
        this.$emit('click', event); // Emit click event
      },
    },
  };
  </script>
  