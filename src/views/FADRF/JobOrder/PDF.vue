<template>
    <div class="a4-container" ref="pdfContent">
        <img src="@/components/assets/hnf.jpg" alt="A4-sized photo" class="a4-photo" @contextmenu.prevent>
      <!-- Top Row -->
      <div class="top-row">
        <div class="label-line">
          <strong>JOB ORDER No.</strong>
          <span class="underline"></span>
        </div>
        <div class="label-line">
          <strong>DATE :</strong>
          <span class="underline"></span>
        </div>
      </div>
  
      <h4>DESCRIPTION OF PROPERTY:</h4>
      <!-- Description of Property Table -->
      <table class="property-table">
        <!-- Row 1 -->
        <tr>
          <th>Type:</th>
          <th>Brand/Model:</th>
          <th>Serial/Engine No.:</th>
        </tr>
        <tr>
          <td>dsfgdfsg</td>
          <td>dfgsdfgdsfg</td>
          <td>sdfgsdfgdfg</td>
        </tr>
        <!-- Row 2 -->
        <tr>
          <th>Property No.:</th>
          <th>Date of Acquisition:</th>
          <th>Acquisition Cost:</th>
        </tr>
        <tr>
          <td>dsfgdsfgdsf</td>
          <td>sdfgdsfgdfs</td>
          <td>sdfgdsfgdsfg</td>
        </tr>
        <!-- Row 3 -->
        <tr>
          <th>Date of Last Repair:</th>
          <th>Nature of Last Repair:</th>
          <th></th>
        </tr>
        <tr>
          <td>sdfgdsfgdfs</td>
          <td>dfsgdfsgdf</td>
          <td></td>
        </tr>
      </table>
      <div class="section">
      <h4>DEFECTS / COMPLAINTS:</h4>
    </div>

    <!-- Nature & Scope of Work -->
    <div class="section">
      <h4>NATURE & SCOPE OF WORK TO BE DONE:</h4>
      <div class="blank-area">dgdfgdfgdfg</div>
    </div>

    <!-- Parts to be Supplied / Replace -->
    <div class="section">
      <h4>PARTS TO BE SUPPLIED / REPLACED:</h4>
      <div class="blank-area">dfgdsfgdfgdf</div>
    </div>

    <!-- Requested By -->
    <div class="requested-by">
      <div class="label">Requested by:</div>
      <div class="signature-line">
        <span>Name & Signature</span>
      </div>
    </div>


    <div class="performed-noted">
    <!-- Performed by -->
    <div class="performed">
      <div class="label">Performed by:</div>
      <div class="signature-line"></div>
      <div class="caption">Name & Signature</div>
    </div>

    <!-- Noted by -->
    <div class="noted">
      <div class="label">Noted by:</div>
      <div class="official-name">LARIZA AMOR R. LUCERO</div>
      <div class="official-position">Supply Officer</div>
      <div class="signature-line"></div>
      <div class="caption">Name & Signature</div>
    </div>
    </div>

    <!-- Parts to be Supplied / Replace -->
    <div class="section">
      <h4>REMARKS:</h4>
      <div class="blank-area"></div>
    </div>

    </div>
  </template>
  <script>
  import bg from '@/components/assets/hnf.jpg'
  export default {
    data() {
      return {
        releasedBy: "Lariza Amor R. Lucero",
      };
    },
    methods: {
      print() {
        window.print(); // This will print the entire page
      },
    },
  };
  </script>
  
  <style scoped>
  .a4-container {
  width: 210mm;
  height: auto;
  padding: 10mm; /* space so text isn't on the edge */
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.a4-photo {
  position: absolute;
  top: 0;
  width: 210mm;
  height: auto;
  object-fit: cover;
  z-index: -1;
  user-select: none;
  pointer-events: none;
}
  
  .top-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    margin-top: 150px;
  }
  
  .label-line {
    display: flex;
    align-items: center;
  }
  
  .label-line strong {
    margin-right: 4px;
  }
  
  .underline {
    border-bottom: 2px solid black;
    display: inline-block;
    width: 80px;
  }
  
  .property-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .property-table th,
  .property-table td {
    border: 1px solid black;
    padding: 4px;
    text-align: left;
  }
  .section {
  margin-top: 5mm;
}

.section h4 {
  margin: 0 0 4px 0;
}

.blank-area {
  border: 1px solid black;
  height: 15mm; /* Adjust height per section */
  background: white;
}

.requested-by {
  margin-top: 10mm;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-weight: bold;
}

.signature-line {
  border-top: 1px solid black;
  padding-top: 2px;
  width: 80mm;
  text-align: center;
}

.performed-noted {
  display: flex;
  justify-content: space-between;
  margin-top: 12mm;
}

.performed,
.noted {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 48%;
}

.label {
  font-weight: bold;
  margin-bottom: 2mm;
}

.official-name {
  font-weight: bold;
}

.official-position {
  margin-bottom: 4mm;
}

.signature-line {
  border-top: 1px solid black;
  width: 100%;
  height: 2mm;
  margin: 3mm 0 1mm 0;
}

.caption {
  font-size: 11px;
}
  </style>
  