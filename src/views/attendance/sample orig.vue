<template>
    <div class="excel-grid">
      <div
        v-for="(row, rowIndex) in data"
        :key="rowIndex"
        class="row"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          contenteditable="true"
          @input="updateCell($event, rowIndex, colIndex)"
          @keydown.enter.prevent
        >
          {{ cell }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        data: [
          ["A1", "B1", "C1"],
          ["A2", "B2", "C2"],
          ["A3", "B3", "C3"],
        ],
      };
    },
    methods: {
      updateCell(e, rowIndex, colIndex) {
        this.data[rowIndex][colIndex] = e.target.innerText;
      },
    },
  };
  </script>
  
  <style>
  .excel-grid {
    display: inline-block;
    border: 2px solid #ccc;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    user-select: none;
  }
  
  .row {
    display: flex;
  }
  
  .cell {
    min-width: 80px;
    min-height: 25px;
    border: 1px solid #ddd;
    padding: 4px;
    text-align: left;
    line-height: 25px;
    cursor: text;
  }
  
  .cell:focus {
    outline: 2px solid #4a90e2;
    background: #eaf2ff;
  }
  </style>