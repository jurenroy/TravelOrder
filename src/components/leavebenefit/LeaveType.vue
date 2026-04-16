<template>
  <div class="radio-input">
    <label>
      <input value="sick" name="value-radio" id="value-1" type="radio" @change="$emit('update:modelValue', 'sick')" />
      <span>Sick Leave</span>
    </label>
    <label>
      <input value="vacation" name="value-radio" id="value-2" type="radio" @change="$emit('update:modelValue', 'vacation')" />
      <span>Vacation Leave</span>
    </label>
    <label>
      <input value="wellness" name="value-radio" id="value-3" type="radio" @change="$emit('update:modelValue', 'wellness')" />
      <span>Wellness Leave</span>
    </label>
    <span class="selection"></span>
  </div>
</template>

<script setup>
defineProps({ modelValue: String });
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.radio-input input {
  display: none;
}

.radio-input {
  --container_width: 250px;
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 10px;
  background-color: gray;
  color: #fff;
  width: var(--container_width);
  overflow: hidden;
  border: 2px solid #fff;
}

.radio-input label {
  width: 100%;
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  font-weight: 600;
  letter-spacing: -1px;
  font-size: 14px;
}

.selection {
  display: none;
  position: absolute;
  height: 100%;
  width: calc(var(--container_width) / 3);
  z-index: 0;
  left: 0;
  top: 0;
  transition: 0.15s ease;
}

.radio-input label:has(input:checked) {
  color: #000;
}

.radio-input label:has(input:checked) ~ .selection {
  background-color: #ffe500;
  display: inline-block;
}

.radio-input label:nth-child(1):has(input:checked) ~ .selection {
  transform: translateX(calc(var(--container_width) * 0 / 3));
}

.radio-input label:nth-child(2):has(input:checked) ~ .selection {
  transform: translateX(calc(var(--container_width) * 1 / 3));
}

.radio-input label:nth-child(3):has(input:checked) ~ .selection {
  transform: translateX(calc(var(--container_width) * 2 / 3));
}
</style>
