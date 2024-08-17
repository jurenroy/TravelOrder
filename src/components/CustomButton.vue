<template>
  <div class="button-cont">
    <button
      :disabled="disabled"
      @click="handleClick"
      :class="[classNames, propsBtn]"
      @mousemove="handleMouseMove"
      @mouseleave="resetBackground"
      :style="buttonStyle"
    >
      {{ label }}
    </button>
  </div>
</template>

<script>
import "./styles/custombutton.css";
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
      default: "",
    },
  },
  computed: {
    classNames() {
      return [
        "propsBtn",
      ];
    },
  },
  data() {
    return {
      buttonStyle: {}
    };
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event); // Emit click event
    },
    handleMouseMove(event) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left; // X position within the button
      const y = event.clientY - rect.top; // Y position within the button

      this.buttonStyle = {
        background: `radial-gradient(circle at ${x}px ${y}px, #ff7a18, #af002d 75%)`
      };
    },
    resetBackground() {
      this.buttonStyle = {
        background: ""
      };
    }
  }
};
</script>
