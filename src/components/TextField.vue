<template>
  <div class="textfield-cont">
    
    <input
      :value="modelValue"
      :type="type"
      :id="id"
      :required="required"
      @input="updateValue"
      @keydown.enter="onEnter"
      :class="classNames"
      :placeholder="placeholder"
    />
    <div class="img-cont">
      <img :src="imgSrc" class="img-login" alt="Input Image" v-if="imgSrc">
    </div>
    
    
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
    modelValue: {
      type: String,
      default: "",
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
    hasError: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    imgSrc: {
      type: String,
      default: ""
    }
  },
  computed: {
    classNames() {
      return [
        'text-input',
        { 'red-border': this.hasError },
        { 'default-border': this.isDefault }
      ];
    }
  },
  methods: {
    updateValue(event) {
      this.$emit("update:modelValue", event.target.value);
    },
    onEnter(event) {
      this.$emit("enter", event);
    }
  }
};
</script>
