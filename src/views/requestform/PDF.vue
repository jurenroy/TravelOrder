<template>
    <div>
      <div id="printableArea" ref="printableArea">
        <div class="container">
          <div class="headerxxx">
            <img :src="logo" alt="Logo" width="auto" height="120" /> 
            <div class="title-section">
                <h3>Republic of the Philippines</h3>
                <h4>Department of Environment and Natural Resources</h4>
                <h4>MINES AND GEOSCIENCES BUREAU</h4>
                <h4>Regional Office No. X</h4>
                <p>DENR-X Compound, Puntod, Cagayan de Oro City</p>
                <p>Telefax Nos. (088) 856-2110; (088) 856-1331; Email: region10@mgb.gov.ph</p>
            </div>
            <img :src="bago" alt="bago" width="auto" height="140" /> 
          </div>
  
          <div class="form-title">REQUEST SLIP FORM</div>
          <div class="admin-section">(Administrative Section)</div>
  
          <div class="form-content">
            <table>
              <tr>
                <td><strong>Requestor: </strong>{{ $props.name }}</td>
                <td><strong>Signature:</strong></td>
                
              </tr>
              <tr>
                <td><strong>Division: </strong>{{ getDivision($props.item.division_id) }}</td>
                <td><img :src="$props.signature" alt="Signature" /></td>
              </tr>
              <tr>
                <td><strong>Date & Time Requested: </strong>{{ formatDate($props.item.date)}}</td>
              </tr>
              <tr>
                <td colspan="4"><strong>DOCUMENT(S) REQUESTED</strong></td>
              </tr>
              <tr style="border: solid black 2px;">
                <td><strong>Document Name</strong></td>
                <td><strong>Date & Time Released</strong></td>
                <td><strong>Released by</strong></td>
              </tr>
              <tr v-for="doc in $props.documents" :key="doc">
                <td style="flex-direction: row; display: flex; justify-content: left; align-items: center;"> 
                  <img :src="$props.item.documents && ($props.item.documents.some(item => item.name === doc) || ($props.item.documents.some(item => !$props.documents.includes(item.name)) && doc == 'Others')) ? checked : unchecked" alt="Logo" width="auto" height="20"/>
                  <!-- <img :src="$props.item.documents && $props.item.documents.some(item => !$props.documents.includes(item.name)) && doc == 'Others' ? checked : unchecked" alt="Logo" width="auto" height="20"/> -->
                  <p style="margin-left: 10px;">{{ doc }} {{$props.item.documents && $props.item.documents.some(item => !$props.documents.includes(item.name)) && doc == 'Others' ? ': '+ $props.item.documents.find(item => !$props.documents.includes(item.name)).name : ''}}</p>
                </td>
                <td>{{ $props.item.documents && $props.item.documents.some(item => item.name === doc && item.remarks == 'Released') ?  formatDate($props.item.documents.find(item => item.name === doc).releaseDate) : ''}}
                  {{$props.item.documents && $props.item.documents.some(item => !$props.documents.includes(item.name)) && doc == 'Others' ? ' '+ formatDate($props.item.documents.find(item => !$props.documents.includes(item.name)).releaseDate) : ''}}
                </td>
                <td colspan="2">{{$props.item.documents && $props.item.documents.some(item => item.name === doc && item.remarks == 'Released') ? releasedBy : ''}}
                  {{$props.item.documents && $props.item.documents.some(item => !$props.documents.includes(item.name)) && doc == 'Others' ? releasedBy : ''}}
                </td>
              </tr>
              <tr>
                <td colspan="3"><strong>RATING</strong></td>
              </tr>
              <tr>
                <td colspan="3">
                  <div v-for="(rating, index) in ratings" :key="rating.value" style="display: flex; align-items: center;">
                    <img :src="rating.value <= $props.item.rating ? starz : star" alt="Star" width="auto" height="20"/>
                    <strong style="margin-left: 10px;">{{ rating.value }} - {{ rating.label }}</strong>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import logz from "../../assets/logo.png";
  import bagz from "../../assets/ISO_logo.png";
  import unchecke from "../../assets/unchecked.png";
  import checke from "../../assets/checkbox.png";
  import sta from "../../assets/star.png";
  import staz from "../../assets/starz.png";
  export default {
    props: {
      item: {
        type: Array,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      signature: {
        type: String,
        required: true,
      },
      documents: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        signature: this.$props.signature, // Placeholder for signature image
        ratings: [
          { value: 4, label: 'Very Satisfied' },
          { value: 3, label: 'Satisfied' },
          { value: 2, label: 'Dissatisfied' },
          { value: 1, label: 'Very Dissatisfied' }
        ],
        logo: logz, // Assign the imported logo to a data property
        bago: bagz, // Assign the imported logo to a data property
        unchecked: unchecke, // Assign the imported logo to a data property
        checked: checke, // Assign the imported logo to a data property
        star: sta, // Assign the imported logo to a data property
        starz: staz, // Assign the imported logo to a data property
        divisions: [
          { division_id: 1, division_name: 'MMD' },
          { division_id: 2, division_name: 'FAD' },
          { division_id: 3, division_name: 'GD' },
          { division_id: 4, division_name: 'MSESDD' },
          { division_id: 5, division_name: 'ORD' },
        ],
        releasedBy: "Joanne Rose O. Alvarez",
      };
    },
    methods: {
      print() {
        window.print(); // This will print the entire page
      },
      getDivision(id) {
        const division = this.divisions.find((div) => div.division_id === id);
        return division ? division.division_name : null;
      },
      formatDate(dateString) {
      const date = new Date(dateString);
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      return `${month} ${day}, ${year}, ${hours}:${formattedMinutes} ${ampm}`;
    },
      
    }
  };
  </script>
  
  <style scoped>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #000;
    }
      body::after {
        content: url('src/assets/logo.png') url('src/assets/bago.png');
        display: none;
      }
  
      /* Ensure the images are properly rendered */
      .logo-section img,
      .bagongpilipinas img {
        display: flex; /* Ensure the images are treated as block elements */
        visibility: visible; /* Ensure the images are visible */
      }
  
  .container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      padding: 0;
      width: 210mm;
      /* A4 width */
      height: 296mm;
      /* A4 height */
      position: absolute;
      top: 0;
      left: 0;
      scale: 0.000000001;
  }
  
    .headerxxx {
      display: flex;
      border-bottom: 1px solid #ccc;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
    }
  
  
    .requestor-section {
      display: flex;
      align-items: center;
      
    }
  
    .requestor-label {
      font-weight: bold;
      margin-right: 5px;
    }
  
    .sign {
    text-decoration: none !important;
    }
  
    .signature-label {
      font-weight: bold;
      margin-right: 5px;
    }
  
    .signature-field {
      display: inline-block;
      min-width: 150px;
      text-align: center;
      border-bottom: 1px solid #000;
    }
  
   .logo-section {
    display: flex;
    width: 100%;
    align-items: center; 
    
  }
  
  .bago {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end; /* This will push the image to the right */
  }
    
  .logo-section img {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    display: block; /* Ensure the image is treated as a block element */
    visibility: visible; /* Ensure the image is visible */
  }
  
  .bagongpilipinas img {
    width: 130px;
    height: 130px;
     display: block; /* Ensure the image is treated as a block element */
    visibility: visible; /* Ensure the image is visible */
    
  }
        .hidden {
        display: none;
      }
    .title-section {
      padding-left: 10px;
      line-height: 1.2;
      text-align: center;
    }
  
    .title-section h3, .title-section h4 {
      margin: 0;
    }
  
    .title-section h3 {
      font-weight: normal;
    }
  
    .title-section h4 {
      color: #000080;
    }
  
    .title-section p {
      margin: 5px 0;
      font-size: 13px;
    }
  
    .certification-section {
      width: 30%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  
    .certification-images img {
      height: 50px;
    }
  
    .form-title {
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      margin: 10px 0;
    }
  
    .admin-section {
      text-align: center;
      margin-bottom: 10px;
      font-style: italic;
      
    }
  
    .form-content {
      width: 100%;
      border: none;
    }
  .documents-row td {
    border: none;
  }
  
  
  
  td {
    border: none;
    border-bottom: 1px solid #eee; 
  }
    table {
      width: 100%;
      border-collapse: collapse;
      border: none;
    }
  .documents-header {
    border: none;
    font-weight: bold;
    padding: 8px;
  }
    
    td {
      border: 1px solid #ccc;
      padding: 5px 2px;
      border: none;
      margin-bottom: -5px;
    }
  
    .form-row td {
    border: none;
  }
    .form-row td strong {
    font-weight: bold;
  }
  
    .form-row td:first-child{
      width: 20%;
      font-weight: bold;
      
    }
  
  .form-row td:nth-child(2) {
    border: none;
    border-bottom: 1px solid #000; /* Keep only the bottom border for the value */
    min-width: 200px; /* Adjust this width to match the signature line length */
  }
  
    .form-row td:last-child {
      width: 30%;
      
  
    }
  
    tr.form-row td:last-child {
    border: none;
  }
  
  
  tr.form-row td:last-child strong {
    border: none;
  }
    .documents-header td {
      font-weight: bold;
      text-align: center;
    }
  
    .documents-row td:first-child {
      width: 5%;
      text-align: center;
    }
  
    .documents-row td:nth-child(2) {
      width: 50%;
    }
  
    .checkbox {
      width: 15px;
      height: 15px;
      border: 1px solid #000;
      display: inline-block;
    }
  
    
    .rating-row td {
      padding: 0;
      }
  
    .rating-label {
      font-weight: bold;
      padding: 5px 10px;
      
    }
  
    .star {
      display: inline-block;
      margin-right: 5px;
      color: #000080;
      
    }
  
    .rating-option {
      display: flex;
      align-items: center;
      margin: 5px 0;
      padding-left: 60px;
      
    }
  
    .rating-option.selected {
      font-weight: bold;
    }
  
    .star.filled {
      color: black;
    }
  
    .star.empty {
      color: #ccc;
    }
    .form-row:nth-child(2) td:nth-child(2) {
    border-bottom: 1px solid #000;
    min-width: 200px; /* Adjust this width to match the signature line length */
  }
  
  img[alt="Signature"] {
    display: inline-block !important;
    visibility: visible !important;
    border: none !important;
    height: 40px !important;
    max-width: 150px !important;
  }
  @media print {
    .container{
      scale: 1;
    }
  }
  
</style>