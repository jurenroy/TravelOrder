<template>
  <div class="textfield-cont">
    <input
      :value="value"
      :type="type"
      :id="id"
      :required="required"
      @input="updateValue"
      @keydown.enter="onEnter"
      :class="classNames"
      :placeholder="placeholder"
      
    />
    <p class="label">{{ label }}</p>
  </div>
</template>

<script>
import "./styles/textfield.css"; // Ensure this path is correct

export default {
  name: "TextField",
  props: {
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
    id: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false,
    },
    hasError: {  // Prop for error state
      type: Boolean,
      default: false,
    },
    default: {  // Prop for default state
      type: Boolean,
      default: false,
    }
  },
  computed: {
    classNames() {
      return [
        'text-input',
        { 'red-border': this.hasError },
        { 'default-border': this.default }
      ];
    }
  },
  methods: {
    updateValue(event) {
      this.$emit("input", event.target.value);
    },
    onEnter(event) {
      this.$emit("enter", event);
    }
  }
};
</script>