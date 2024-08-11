<template>
  <div class="una1">
    <div class="imagediv1" @click="window.location.reload()">
      <img
        class="ima1"
        src="../assets/logo.png"
        alt="Description of the image"
      />
      <img
        class="ima1 ims1"
        src="../assets/republic.png"
        alt="Description of the image"
      />
      <img
        class="ima1"
        src="../assets/bago.png"
        alt="Description of the image"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const isRegistration = ref(true);

    const toggleButton = () => {
      isRegistration.value = !isRegistration.value;
    };

    return {
      isRegistration,
      toggleButton,
    };
  },
};
</script>

<style>
.una1 {
  background-color: white;
  display: flex;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid black;
  box-shadow: 0px 0px 4px black, 0px 0px 3px black inset;
}

.imagediv {
  display: flex;
  align-items: center;
}

.ima1 {
  height: 50px;
  width: 50px;
  margin-top: -5px;
  margin-left: 10px;
  margin-bottom: 0px;
  cursor: pointer;
}

.imabut,
.ima1 {
  margin-right: 30px;
}

.imabut {
  border-radius: 10px;
  font-size: 13px;
  width: 90px;
  height: 40px;
  margin-right: 50px;
}

.ims1 {
  width: 200px;
}

@media (max-width: 768px) {
  .imabut,
  .ima1 {
    margin-right: 0px;
  }

  .ims1 {
    width: 150px;
  }

  .imabut {
    border-radius: 10px;
    font-size: 13px;
    width: 90px;
    height: 30px;
    margin-right: 10px;
  }

  .usew {
    margin-right: -1px;
  }

  .ims1 {
    width: 145.9px;
  }
}
</style>
