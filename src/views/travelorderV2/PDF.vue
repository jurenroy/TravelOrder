<template>
<div class="blare">
    <div class="a4-containerz" id="pdf-content" @contextmenu.prevent>
      <div ref="content" class="a4-contentz">
        <!-- Your content goes here -->
        <img src="@/components/assets/hnf.jpg" alt="A4-sized photo" class="a4-photo" @contextmenu.prevent>
        <p class="a4-to" style="text-align: center;">TRAVEL ORDER</p>
        <p class="a4-textBold">No. <span class="a4-textspank">{{ padWithZeroes(to_num) }}-{{ yearToday}}</span></p>
            <div class="travel-info-grid">
  <!-- Left section (Top left) -->
  <div class="travel-info-left">
    <div class="info-row">
      <p class="info-label">Name:</p>
      <p class="info-value-name">{{ name }}</p>
    </div>
    <div class="info-row">
      <p class="info-label">Position:</p>
      <p class="info-value">{{ position }}</p>
    </div>
    <div class="info-row">
      <p class="info-label">Departure:</p>
      <p class="info-value">{{ departure }}</p>
    </div>
    <div class="info-row">
      <p class="info-label">Destination:</p>
      <p class="info-value">{{ destination }}</p>
    </div>
  </div>

  <!-- Right section (Top right) -->
  <div class="travel-info-right">
    <div class="info-row2">
      <p class="info-label">Date:</p>
      <p class="info-value">{{ date }}</p>
    </div>
    <div class="info-row2">
      <p class="info-label">Division/Section:</p>
      <p class="info-value">{{ division }}</p>
    </div>
    <div class="info-row2">
      <p class="info-label">Official Station:</p>
      <p class="info-value">{{ station }}</p>
    </div>
    <div class="info-row2">
      <p class="info-label">Arrival Date:</p>
      <p class="info-value">{{ arrival }}</p>
    </div>
  </div>

  <!-- Full-width section (Bottom) -->
  <div class="travel-info-full-width">
    <div class="info-row">
      <p class="info-label">Purpose of Travel:</p>
      <p class="info-value">{{ purpose }}</p>
    </div>
    <div class="info-row">
      <p class="info-label">Per Diems/Expense Allowed:</p>
      <p class="info-value">{{ pdea }}</p>
    </div>
    <div class="info-row">
      <p class="info-label">Assistance or Laborer Allowed:</p>
      <p class="info-value">{{ ala }}</p>
    </div>
    <div class="info-row">
      <p class="info-label">Appropriations to which travel should be charged:</p>
      <p class="info-value">{{ appropriations }}</p>
    </div>
    <div class="info-row">
      <p class="info-label">Remarks or Special instructions:</p>
      <p class="info-value">{{ remarks }}</p>
    </div>
  </div>
</div>
        <div class="certz">
        <div style="display: flex; flex-direction: column; justify-content: flex-start; ">
          <div style="display: flex; justify-content: flex-start; margin-top: -10px;">
            <p class="label2" style="margin-top: 35px; margin-left: 6%;">Certifications:</p>
          </div>
          <div style="display: flex; justify-content: flex-start; margin-top: -25px; margin-bottom: -10px;">
            <p class="label2" style="margin-left: 6%; text-align: justify; width: 88%;">This is to certify that the travel
              is necessary and is connected with the function of the official/employee of this Division/Section/Unit.</p>
          </div>
        </div>
          <div class="outer-container" :style="{ marginTop: '-30px', justifyContent: ((division == 'ORD' && intervals == 0 && name !== 'RODANTE B. FELINA') || (divisionChiefs.includes(name) && intervals == 0) || name == 'RODANTE B. FELINA' || name == 'LIBERTY B. DAITIA' || (sdiv - 1 == divisionNames.indexOf(division)))  ? 'flex-end' : 'space-around' }" v-if="aor == 0">
            
            <div class="inner-container2" v-if="((!divisionChiefs.includes(name) && intervals == 0 && division !== 'ORD') && (sdiv - 1 !== divisionNames.indexOf(division)))">
              <p class="recoz">Recommended by: </p>
              <img :src="signature1" class="signatiz" v-if="signature1 !== `${API_BASE_URL}/storage/null`" @contextmenu.prevent/>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }">
                {{ recommended }}</p>
              <p style="margin-top: -10px;">Chief, {{ division }}</p>
            </div>
  
            <div class="inner-container2" v-if="intervals == 1 && name !== 'RODANTE B. FELINA' && name !== 'LIBERTY B. DAITIA'">
              <p class="recoz">Recommended by:</p>
              <img :src="signature1" class="signatiz" v-if="signature1 !== `${API_BASE_URL}/storage/null`" @contextmenu.prevent/>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px'}">
                LIBERTY B. DAITIA</p>
              <p style="margin-top: -10px;">CHIEF AO</p>
            </div>
  
            <div class="inner-container2" :style="{ marginRight: (division == 'ORD' && intervals == 0) || (divisionChiefs.includes(name) && intervals == 0) || (sdiv - 1 == divisionNames.indexOf(division)) ? '120px' : '0px' }" v-if="name !== 'RODANTE B. FELINA'">
              <p class="aproz">Approved by:</p>
              <p style="margin-top: -15px;" v-if="sname !== 20 && sname !== null">By Authority of the OIC, Regional
                Director:</p>
              <img :src="signature2" class="signatiz" v-if="signature2 !== `${API_BASE_URL}/storage/null` && aor == 0" @contextmenu.prevent/>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
                v-if="sdiv == 5 || sdiv == null">RODANTE B. FELINA</p>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
                v-if="sdiv == 4 && sdiv !== null ">ALVIN M. VILLANUEVA</p>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
                v-if="sdiv == 3 && sdiv !== null ">OSIN A. SINSUAT JR.</p>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
                v-if="sdiv == 2 && sdiv !== null ">LIBERTY B.DAITIA</p>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
                v-if="sdiv == 1 && sdiv !== null ">JANICE B.FUROG</p>
              <p style="margin-top: -10px;" v-if="sdiv == 5 || sdiv == null">OIC, Regional Director</p>
              <p style="margin-top: -10px;" v-if="sdiv !== 5 && sdiv !== null">Chief, {{ sdivz.division_name }}</p>
            </div>
  
            <div class="inner-container2" :style="{ marginRight: division == 'ORD' ? '90px' : '0px' }" v-if="name == 'RODANTE B. FELINA'">
              <p class="aproz">Approved by:</p>
              <img :src="signature2" class="signatiz" v-if="signature2 !== `${API_BASE_URL}/storage/null` && aor == 0 && 2==1" @contextmenu.prevent/>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
              >HENRY A. ADORNADO, PhD</p>
              <p style="margin-top: -10px;">Regional Executive Director</p>
            </div>
          </div>
          <div class="outer-container" :style="{ marginTop: '-30px', justifyContent: (((division == 'ORD' && intervals == 0) || (name=='LIBERTY B. DAITIA' && intervals == 0)) && !(name=='RODANTE B. FELINA' && intervals == 1)) || (divisionChiefs.includes(name) && intervals == 0) ? 'flex-end' : 'space-around' }" v-if="aor == 1">
  
            <div class="inner-container2" v-if="divisionChiefs.includes(name) && intervals == 1">
              <p class="recoz">Recommended by:</p>
              <img :src="signature1" class="signatiz" v-if="signature1 !== `${API_BASE_URL}/storage/null`" @contextmenu.prevent/>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px'}">
                HENRY A. ADORNADO, PhD</p>
              <p style="margin-top: -10px;">Regional Executive Director</p>
            </div>
  
            <div class="inner-container2" v-if="!divisionChiefs.includes(name) && intervals == 0 && division !== 'ORD'">
              <p class="recoz">Recommended by:</p>
              <img :src="signature1" class="signatiz" v-if="signature1 !== `${API_BASE_URL}/storage/null`" @contextmenu.prevent/>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }">
                {{ recommended }}</p>
              <p style="margin-top: -10px;">Chief, {{ division }}</p>
            </div>
  
            <div class="inner-container2" v-if="!divisionChiefs.includes(name) && intervals == 1">
              <p class="recoz">Recommended by:</p>
              <img :src="signature1" class="signatiz" v-if="signature1 !== `${API_BASE_URL}/storage/null`" @contextmenu.prevent/>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px'}">
                LIBERTY B. DAITIA</p>
              <p style="margin-top: -10px;">CHIEF AO</p>
            </div>
  
            <div class="inner-container2" :style="{ marginRight: (division == 'ORD' && intervals == 0) || divisionChiefs.includes(name) ? '120px' : '0px' }" v-if="((divisionChiefs.includes(name) && intervals == 0) || !divisionChiefs.includes(name)) && name != 'RODANTE B. FELINA'">
              <p class="aproz">Approved by:</p>
              <p style="margin-top: -15px;" v-if="sname !== 20 && sname !== null">By Authority of the OIC, Regional
                Director:</p>
              <img :src="signature2" class="signatiz" v-if="signature2 !== `${API_BASE_URL}/storage/null`" @contextmenu.prevent/>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
                v-if="sdiv == 5 || sdiv == null">RODANTE B. FELINA </p>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
                v-if="sdiv == 4 && sdiv !== null ">ALVIN M. VILLANUEVA</p>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
                v-if="sdiv == 3 && sdiv !== null ">OSIN JR. A. SINSUAT</p>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
                v-if="sdiv == 2 && sdiv !== null ">LIBERTY B.DAITIA</p>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
                v-if="sdiv == 1 && sdiv !== null ">JANICE B.FUROG</p>
              <p style="margin-top: -10px;" v-if="sdiv == 5 || sdiv == null">OIC, Regional Director</p>
              <p style="margin-top: -10px;" v-if="sdiv !== 5 && sdiv !== null">Chief, {{ sdivz.division_name }}</p>
            </div>
  
            <div class="inner-container2" :style="{ marginRight: division == 'ORD' ? '-10px' : '0px' }" v-if="divisionChiefs.includes(name) && intervals == 1">
              <p class="aproz">Approved by:</p>
              <img :src="signature2" class="signatiz" v-if="signature2 !== `${API_BASE_URL}/storage/null`" @contextmenu.prevent/>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
              >Atty. DANILO U. UYKIENG</p>
              <p style="margin-top: -10px;">OIC, Bureau Director</p>
            </div>
  
            <div class="inner-container2" :style="{ marginRight: division == 'ORD' ? '90px' : '0px' }" v-if="name == 'RODANTE B. FELINA' && intervals == 0">
              <p class="aproz">Approved by:</p>
              <img :src="signature2" class="signatiz" v-if="signature2 !== `${API_BASE_URL}/storage/null`" @contextmenu.prevent/>
              <p class="value"
                :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == `${API_BASE_URL}/storage/null`) ? '40px' : '40px' }"
              >HENRY A. ADORNADO, PhD</p>
              <p style="margin-top: -10px;">Regional Executive Director</p>
            </div>
  
          </div>
  
          <p style="letter-spacing: 5px; text-align: center; margin-top: -25px;">AUTHORIZATION</p>
          <p style="text-align: justify; margin-top: -10px; margin-left: 6%; width: 88%; text-indent: 3em;">I hereby
            authorize the Accountant to deduct the corresponding amount of the unliquidated cash advance from my
            succeeding salary for my failure to liquidate this travel within twenty(20) days upon return to my permanent
            official station pursuant to Commision on Audit(COA) Circular No. 2012-004 dated November 28, 2012.</p>
          <div class="inner-containerz" style="align-self: flex-end; margin-right: 6%; ">
            <img :src="signature3" class="signatizz" v-if="signature3 !== `${API_BASE_URL}/storage/null`"
              style="margin-top: -50px; margin-bottom: -10px" @contextmenu.prevent/>
            <p style="font-weight: bold; text-align: center;">{{ name }}</p>
            <p style="text-align: center;">Official Employee</p>
          </div>
          <div>
            <div class="cueare">
              <p class="footerz">MGB-X-FAD-FO-033</p>
            <img :src="qrCodeUrl" alt="QR Code" v-if="qrCodeUrl" class="bigz" @contextmenu.prevent>
            <img :src="imageSrc" alt="QR Code" v-if="qrCodeUrl" class="centz" @contextmenu.prevent>
            <p class="qrquote" style="font-size: 9px;">This is an official Travel Order approved digitally and generated from <br/>the MGB-X Online Travel Order. No original signature is required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
  </template>
  
  <script setup>
  import QRCode from 'qrcode'
  </script>
  
  <script>
  // Import the necessary libraries
  import jsPDF from 'jspdf';
  import axios from 'axios';
  import mgbx from '../../assets/mgbx.png'
  import { API_BASE_URL } from '../../config'
  import { vShow } from 'vue';
  export default {
    props: {
      travel_order_id: String
    },
    data() {
      return {
        date: '',
        yearToday: '', // Get the current year
        name: '',
        position: '',
        departure: '',
        destination: '',
        division: '',
        station: '',
        arrival: '',
        purpose: '',
        pdea: '',
        ala: '',
        appropriations: '',
        remarks: '',
        signature1: '',
        signature2: '',
        formData: [],
        formData: [],
        names: {},
        positions: [],
        divisions: [],
        employees: [],
        recommended: '',
        recommendedID: '',
        signature1: '',
        signature2: '',
        signature3: '',
        accounts: [],
        sname: '',
        sdiv: '',
        sdivz: '',
        to_num: '',
        qrCodeUrl: '',
        imageSrc: mgbx,
        intervals: '',
        aor: '',
        divisionChiefs:[
          'LIBERTY B. DAITIA',
          'OSIN A. SINSUAT JR.',
          'JANICE B. FUROG',
          'ALVIN M. VILLANUEVA',
          'RODANTE B. FELINA'
        ],
        divisionNames: ["MMD", "FAD", "GD", "MSESDD", "ORD"]
      };
    },
    mounted() {
      // Populate fields when the component is mounted
      if (this.travel_order_id !== 0) {
        this.fetchData(this.travel_order_id);
      }
      // Fetch additional data
      
      this.fetchNames();
      this.fetchPositions();
      this.fetchDivisions();
      this.fetchEmployees();
      this.fetchAccounts();
    },
    watch: {
      travel_order_id(newVal) {
        // Check if the new value is not null, then populate fields
        if (newVal !== 0) {
          this.fetchData(newVal);
        }
      }
    },
    methods: {
      async generateQRCode() {
        const textToEncode = `MGBX TRAVEL ORDER \nTRAVEL ORDER NO. ${this.padWithZeroes(this.to_num)}-${this.yearToday}\n${this.name}\nDate of Travel: ${this.departure} - ${this.arrival}\n Destinatation: ${this.destination}\n Purpose:${this.purpose}`;
        try {
          this.qrCodeUrl = await QRCode.toDataURL(textToEncode);
        } catch (err) {
          console.error(err);
        }
      },
      padWithZeroes(travel_order_id) {
        // Convert travel_order_id to string
        const idString = travel_order_id.toString();
        // Check if the length is less than 4
        if (idString.length < 4) {
          // Pad with zeroes to make it four digits
          return '0'.repeat(4 - idString.length) + idString;
        } else {
          // If already four digits, return as is
          return idString;
        }
      },
      close() {
        // Close logic
        travel_order_id = null;
        this.$emit('close');
      },
      printzz(){
        window.print();
      },
  
       downloadPDF() {
        // Initialize jsPDF with A4 size
        const pdf = new jsPDF('p', 'mm', 'a4');
  
        // Get the HTML content
        const content = document.getElementById('pdf-content');
  
        // Add HTML content to PDF
        pdf.html(content, {
          // Set width and height of PDF to A4 size
          html2canvas: { scale: 0.26 }, // Adjust scale as needed to fit content
          x: 0,
          y: 0,
          callback: () => {
            // Download the PDF file
            pdf.save('travel_order.pdf');
          }
        });
      },
      fetchAccounts() {
        axios.get(`${API_BASE_URL}/get_accounts_json`)
          .then(response => {
            this.accounts = response.data;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      },
      fetchData() {
        axios.get(`${API_BASE_URL}/get_forms_json/${this.travel_order_id}`)
          .then(response => {
            this.formData = response.data;
            this.populateFields();
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      },
      fetchNames() {
        axios.get(`${API_BASE_URL}/get_names_json`)
          .then(response => {
            this.names = response.data;
          })
          .catch(error => {
            console.error('Error fetching names:', error);
          });
      },
      fetchPositions() {
        fetch(`${API_BASE_URL}/get_positions_json/`)
          .then(response => response.json())
          .then(data => {
            this.positions = data;
          })
          .catch(error => {
            console.error('Error fetching positions:', error);
          });
      },
      fetchDivisions() {
        fetch(`${API_BASE_URL}/get_divisions_json/`)
          .then(response => response.json())
          .then(data => {
            this.divisions = data;
          })
          .catch(error => {
            console.error('Error fetching divisions:', error);
          });
      },
      fetchEmployees() {
        fetch(`${API_BASE_URL}/get_employees_json/`)
          .then(response => response.json())
          .then(data => {
            this.employees = data;
          })
          .catch(error => {
            console.error('Error fetching employees:', error);
          });
      },
      getName(nameId) {
        const name = this.names[nameId];
        if (name) {
          const { first_name, middle_init, last_name } = name;
          return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
        }
        return 'Unknown';
      },
      populateFields(travelOrderId) {
        console.log(this.formData)
        const selectedForm = this.formData;
        if (selectedForm) {
          this.name_id = selectedForm.name_id ;
          this.position_id = selectedForm.position_id;
          this.departure = selectedForm.departure;
          this.destination = selectedForm.destination;
          this.date = selectedForm.date;
          this.yearToday = selectedForm.date.slice(0, 4);
          this.division_id = selectedForm.division_id;
          this.station = selectedForm.station;
          this.arrival = selectedForm.arrival;
          this.purpose = selectedForm.purpose;
          this.pdea = selectedForm.pdea;
          this.ala = selectedForm.ala;
          this.appropriation = selectedForm.appropriations;
          this.remarks = selectedForm.remarks;
          this.sname = selectedForm.sname;
          this.sdiv = selectedForm.sdiv;
          this.to_num = selectedForm.to_num;
          this.intervals = selectedForm.intervals;
          this.aor = selectedForm.aor;
          this.signature1 = `${API_BASE_URL}/storage/${selectedForm.signature1}`;
          this.signature2 = `${API_BASE_URL}/storage/${selectedForm.signature2}`;
          this.signature3 = `${API_BASE_URL}/storage/null`;
          const nameDetails = this.names[this.name_id - 1];
          if (nameDetails) {
            this.name = `${nameDetails.first_name.toUpperCase()} ${nameDetails.middle_init.toUpperCase()} ${nameDetails.last_name.toUpperCase()}`;
          }
  
          const selectedPosition = this.positions.find(position => position.position_id === this.position_id);
          if (selectedPosition) {
            this.position = selectedPosition.position_name;
          }
  
          this.sdivz = this.divisions.find(division => division.division_id === this.sdiv)
  
          const selectedDivision = this.divisions.find(division => division.division_id === this.division_id);
          if (selectedDivision) {
            this.division = selectedDivision.division_name;
            const recommendedEmployee = this.employees.find(employee => employee.division_id === this.division_id && employee.chief > 0);
            if (recommendedEmployee) {
              this.recommended = this.getName(recommendedEmployee.name_id - 1);
            }
          }
          const selectedAccount = this.accounts.find(acc => acc.name_id === nameDetails.name_id);
          if (selectedAccount) {
            this.signature3 = `${API_BASE_URL}/storage/${selectedAccount.signature}`;
          }
          this.generateQRCode();
        } else {
          this.name_id = '';
          this.name = '';
          this.positionID = '';
          this.departure = '';
          this.destination = '';
          this.date = '';
          this.divisionID = '';
          this.station = '';
          this.arrival = '';
          this.recommended = '';
          this.recommendedID = '';
        }
      },
  
    }
  };
  </script>
  
  
  
  <style scoped>
.blare{
    height: 0px;
    margin-top: -25000px;
}
  .a4-container {
    width: 210mm;
    /* A4 width */
    height: 296mm;
    /* A4 height */
    margin: 0 auto;
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: -10000px;
    position: relative;
  }
  
  .a4-content {
    /* Adjust this height based on your content */
    height: 295mm;

    /* A4 height minus padding and border */
  }
  
  .a4-photo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 98%;
    z-index: -1;
    /* Place the photo behind other content */
  }
  
  .a4-to {
    margin-top: 22.5%;
    letter-spacing: 5px;
    font-weight: bold;
    font-size: 20px;
    color: #000000
  }
  
  .a4-textBold {
    font-weight: bold;
    font-size: 20px;
    color: #000000;
    margin-bottom: -30px;
    margin-top: -15px; 
    text-align: center;
  }
  
  .outer-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  
  .inner-container {
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin: 10px;
    /* Adding margin for spacing between inner containers */
    margin-left: 35px;
  }
  
  .inner-container2 {
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin: 10px;
    /* Adding margin for spacing between inner containers */
    margin-left: -20px;
    justify-content: center;
    align-items: center;
  }
  
  /* Overall grid layout */
.travel-info-grid {
  display: grid;
  grid-template-columns: 6fr 4fr; /* Two equal columns */
  padding: 20px;
  margin-top: -30px;
}

/* Left section for top-left data */
.travel-info-left,
.travel-info-right {
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
}

/* Full-width section for bottom data */
.travel-info-full-width {
  grid-column: span 2; /* This spans both columns */
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-top: -40px;
  margin-bottom: -60px;
}

/* Info row layout with labels and values */
.info-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px; /* Space between label and value */
  align-items: center;
  margin-top: -20px;
}
.info-row2 {
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 10px; /* Space between label and value */
  align-items: center;
  margin-top: -20px;
}

/* Label styling */
.info-label {
  font-weight: bold;
  text-align: left;
}

/* Value styling */
.info-value {
  text-align: left;
}
/* Value styling */
.info-value-name{
  text-align: left;
  font-weight: bolder;
  font-size: 14px;
  text-decoration: underline;
}

/* Optional: Additional adjustments for text alignment */
.info-label, .info-value {
  font-size: 14px;
}
  
  .buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    margin-top: 20px;
    z-index: 9;
  }
  
  button {
    padding: 10px 20px;
    margin-right: 10px;
  }
  
  .signatiz {
    height: 80px;
    width: auto;
    margin-bottom: -65px;
    margin-top: -15px;
    pointer-events: none; /* Prevent mouse events on the image */
  }
  .signatizz {
    height: 60px;
    width: auto;
    margin-bottom: -50px;
    margin-top: 5px;
    margin: auto;
  }
  .lowclass{
    margin-top: -20px;
  }
  .a4-container p {
    font-size: 1em; /* Relative font size */
    margin-bottom: 1em; /* Relative margin */
  }
  
  .inner-containerz{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-left: 50%;
    margin-top: 35px;
  }
  
  .inner-containerz p{
    margin-top: 0px;
    margin-bottom: -0px
  }
  
  .inner-containerz .signatizz{
    margin-top: 50px;
  }
  
  .footerz{
    text-align: left; margin-left: 6%; margin-top: 20px;
  }
  
  .cueare{
    display: flex; flex-direction: column; position: absolute; bottom: 0;
  }
  
  .bigz{
    height: 100px; width: 100px; margin-left: 40px; margin-bottom: 5px; margin-top: -20px;
  }
  .centz{
    height: 50px; width: 50px;  margin-top: -75px; margin-left: 66px;
  }
  .qrquote {
      margin-top: 20px;
  }
  @media print {
    .bglang {
      display: none !important;
    }
    .blare{
        margin-top: 0;
    }
    .a4-container {
      border: none;
      margin-top: -20px;
      height: calc(100vh - 40px); /* Adjust height to fit one page */
      overflow: hidden; /* Prevent content overflow */
      opacity: 100;
    }
    .a4-content{
        height: 295mm;
    }
      @page {
      size: A4;
      margin: 5%;
    }
    .a4-photo {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      /* Place the photo behind other content */
    }
    .label-value-row2{
      font-size: 18px;
    }
    .label2{
      font-size: 18px;
    }
    .cueare{
    position: fixed; bottom: 20;
    }
    .bigz{
      margin-top: 0px;
    }
  }
  
  
  </style>