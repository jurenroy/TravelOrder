<template>
  <div class="a4-containerz hiding-class">
    <!-- From Uiverse.io by vinodjangid07 -->
    <form class="file-upload-form">
      <label for="file" class="file-upload-label">
        <div class="file-upload-design">
          <svg viewBox="0 0 640 512" height="1em">
            <path
              d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
            ></path>
          </svg>
          <p>Drag and Drop</p>
          <p>or</p>
          <span class="browse-button">Browse file</span>
        </div>

        <!-- IMPORTANT PART -->
        <input id="file" type="file" accept=".csv" @change="handleFileUpload" />
      </label>
    </form>

    <!-- Loader -->
    <div class="loaders" v-if="loading">
      <span class="loaders-text">uploading</span>
      <span class="loads"></span>
    </div>

    <!-- CSV Preview -->
    <pre v-else>{{ csvData }}</pre>
  </div>
</template>

<script>
import mgblogz from "../../assets/mgbx.png";
import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { API_BASE_URL } from "../../config";
export default {
  data() {
    return {
      csvData: [], // this will store parsed CSV
      loading: false,
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];

      if (!file) return;

      // Extra validation (in case user bypasses accept)
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        alert("Please upload a CSV file only.");
        return;
      }
      this.loading = true; // ✅ START LOADING

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;

        // simulate delay so loader is visible (optional but useful)
        setTimeout(() => {
          this.parseCSV(text);
          this.loading = false; // ✅ STOP LOADING
        }, 1000); // adjust or remove if not needed
      };

      reader.readAsText(file);
    },

    parseCSV(text) {
      const rows = text.split(/\r?\n/).filter((row) => row.trim() !== "");

      this.csvData = rows.map((row) => {
        // Simple CSV split (basic)
        return row.split(",");
      });

      console.log("Parsed CSV:", this.csvData);
    },
  },
};
</script>

<style scoped>
/* From Uiverse.io by vinodjangid07 */
.file-upload-form {
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
}
.file-upload-label input {
  display: none;
}
.file-upload-label svg {
  height: 50px;
  fill: rgb(82, 82, 82);
  margin-bottom: 20px;
}
.file-upload-label {
  cursor: pointer;
  /* background-color: #ddd; */
  background-color: #ecbf67;
  padding: 30px 70px;
  border-radius: 40px;
  border: 2px dashed rgb(82, 82, 82);
  box-shadow: 0px 0px 200px -50px rgba(0, 0, 0, 0.719);
}
.file-upload-design {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.browse-button {
  background-color: rgb(82, 82, 82);
  padding: 5px 15px;
  border-radius: 10px;
  color: white;
  transition: all 0.3s;
}
.browse-button:hover {
  background-color: rgb(14, 14, 14);
}

/* From Uiverse.io by alexruix */
.loaders {
  width: 80px;
  height: 50px;
  position: relative;
}

.loaders-text {
  position: absolute;
  top: 0;
  padding: 0;
  margin: 0;
  color: black;
  animation: text_713 3.5s ease both infinite;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.loads {
  background-color: #ecbf67;
  border-radius: 50px;
  display: block;
  height: 16px;
  width: 16px;
  bottom: 0;
  position: absolute;
  transform: translateX(64px);
  animation: loading_713 3.5s ease both infinite;
}

.loads::before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  background-color: gray;
  border-radius: inherit;
  animation: loading2_713 3.5s ease both infinite;
}

@keyframes text_713 {
  0% {
    letter-spacing: 1px;
    transform: translateX(0px);
  }

  40% {
    letter-spacing: 2px;
    transform: translateX(26px);
  }

  80% {
    letter-spacing: 1px;
    transform: translateX(32px);
  }

  90% {
    letter-spacing: 2px;
    transform: translateX(0px);
  }

  100% {
    letter-spacing: 1px;
    transform: translateX(0px);
  }
}

@keyframes loading_713 {
  0% {
    width: 16px;
    transform: translateX(0px);
  }

  40% {
    width: 100%;
    transform: translateX(0px);
  }

  80% {
    width: 16px;
    transform: translateX(64px);
  }

  90% {
    width: 100%;
    transform: translateX(0px);
  }

  100% {
    width: 16px;
    transform: translateX(0px);
  }
}

@keyframes loading2_713 {
  0% {
    transform: translateX(0px);
    width: 16px;
  }

  40% {
    transform: translateX(0%);
    width: 80%;
  }

  80% {
    width: 100%;
    transform: translateX(0px);
  }

  90% {
    width: 80%;
    transform: translateX(15px);
  }

  100% {
    transform: translateX(0px);
    width: 16px;
  }
}
</style>
