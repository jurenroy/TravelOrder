<template>
  <div class="buttons">
    <button @click="printzz">Download as PDF</button>
    <alerz></alerz>
  </div>
  <div class="a4-container" id="pdf-content">
    <div ref="content" class="a4-content">
      <img src="@/components/assets/hnf.jpg" alt="A4-sized photo" class="a4-photo">
      <p class="a4-to" style="text-align: center;">TRAVEL ORDER</p>
      <p class="a4-textBold" style="margin-top: -15px; text-align: center;">No. <span
          style="text-decoration: underline; text-align: center;">{{ padWithZeroes(to_num) }}-{{ yearToday }}</span></p>
      <div class="outer-container">
        <div class="inner-container">
          <div class="label-value-row">
            <p class="label" style="margin-left: 50px;">Name:</p>
            <p class="value" style="font-weight: bold;">{{ name }}</p>
          </div>
          <div class="label-value-row">
            <p class="label" style="margin-left: 50px;">Position: </p>
            <p class="value">{{ position }}</p>
          </div>
          <div class="label-value-row">
            <p class="label" style="margin-left: 50px;">Departure:</p>
            <p class="value">{{ departure }}</p>
          </div>
          <div class="label-value-row">
            <p class="label" style="margin-left: 50px;">Destination:</p>
            <p class="value">{{ destination }}</p>
          </div>
        </div>
        <div class="inner-container">
          <div class="label-value-row">
            <p class="label">Date:</p>
            <p class="value">{{ date }}</p>
          </div>
          <div class="label-value-row">
            <p class="label">Division/Section: </p>
            <p class="value">{{ division }}</p>
          </div>
          <div class="label-value-row">
            <p class="label">Official Station:</p>
            <p class="value">{{ station }}</p>
          </div>
          <div class="label-value-row">
            <p class="label">Arrival Date:</p>
            <p class="value">{{ arrival }}</p>
          </div>
        </div>
      </div>
      <div class="label-value-row2" style="margin-top: -20px;">
        <p class="label2">Purpose of Travel:</p>
        <p class="value2">{{ purpose }}</p>
      </div>
      <div class="label-value-row2">
        <p class="label2">Per Diems/Expense Allowed:</p>
        <p class="value2">{{ pdea }}</p>
      </div>
      <div class="label-value-row2">
        <p class="label2">Assistance or Laborer Allowed:</p>
        <p class="value2">{{ ala }}</p>
      </div>
      <div class="label-value-row2">
        <p class="label2">Appropriations to which travel should be charged:</p>
        <p class="value2">{{ appropriations }}</p>
      </div>
      <div class="label-value-row2">
        <p class="label2">Remarks or Special instructions:</p>
        <p class="value2">{{ remarks }}</p>
      </div>
      <div style="display: flex; flex-direction: column; justify-content: flex-start; ">
        <div style="display: flex; justify-content: flex-start; margin-top: -10px;">
          <p class="label2" style="margin-top: 35px; margin-left: 6%;">Certifications:</p>
        </div>
        <div style="display: flex; justify-content: flex-start; margin-top: -25px; margin-bottom: -10px;">
          <p class="label2" style="margin-left: 6%; text-align: justify; width: 88%;">This is to certify that the travel
            is necesarry and is connected with the function of the official/employee of this Division/Section/Unit.</p>
        </div>
        <div class="outer-container"
          :style="{ marginTop: '-30px', justifyContent: (division == 'ORD' || name == 'LIBERTY B. DAITIA') ? 'flex-end' : 'space-around' }"
          v-if="aor == 0">

          <div class="inner-container2" v-if="!divisionChiefs.includes(name) && intervals == 0 && division !== 'ORD'">
            <p>Recommended by:</p>
            <img :src="signature1" class="signatiz" v-if="signature1 !== 'http://172.31.10.164:8000/storage/null'" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }">
              {{ recommended }}</p>
            <p style="margin-top: -10px;">Chief, {{ division }}</p>
          </div>

          <div class="inner-container2"
            v-if="!divisionChiefs.includes(name) && intervals == 1 && division !== 'ORD' && name !== 'LIBERTY B. DAITIA'">
            <p>Recommended by:</p>
            <img :src="signature1" class="signatiz" v-if="signature1 !== 'http://172.31.10.164:8000/storage/null'" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }">
              LIBERTY B. DAITIA</p>
            <p style="margin-top: -10px;">CHEIF AO</p>
          </div>

          <div class="inner-container2"
            v-if="divisionChiefs.includes(name) && intervals == 1 && name !== 'LIBERTY B. DAITIA'">
            <p>Recommended by:</p>
            <img :src="signature1" class="signatiz" v-if="signature1 !== 'http://172.31.10.164:8000/storage/null'" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }">
              LIBERTY B. DAITIA</p>
            <p style="margin-top: -10px;">CHEIF AO</p>
          </div>

          <div class="inner-container2"
            :style="{ marginRight: division == 'ORD' || name == 'LIBERTY B. DAITIA' ? '120px' : '0px' }"
            v-if="name !== 'RODANTE B. FELINA'">
            <p>Approved by:</p>
            <p style="margin-top: -15px;" v-if="sname !== 20 && sname !== null">By Authority of the OIC, Regional
              Director:</p>
            <img :src="signature2" class="signatiz"
              v-if="signature2 !== 'http://172.31.10.164:8000/storage/null' && aor == 0" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }"
              v-if="sdiv == 5 || sdiv == null">RODANTE B. FELINA</p>
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }"
              v-if="sdiv == 4 && sdiv !== null">ALVIN M. VILLANUEVA</p>
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }"
              v-if="sdiv == 3 && sdiv !== null">OSIN JR. A. SINSUAT</p>
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }"
              v-if="sdiv == 2 && sdiv !== null">LIBERTY B.DAITIA</p>
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }"
              v-if="sdiv == 1 && sdiv !== null">JANICE B.FUROG</p>
            <p style="margin-top: -10px;" v-if="sdiv == 5 || sdiv == null">OIC, Regional Director</p>
            <p style="margin-top: -10px;" v-if="sdiv !== 5 && sdiv !== null">Chief, {{ sdivz.division_name }}</p>
          </div>

          <div class="inner-container2" :style="{ marginRight: division == 'ORD' ? '90px' : '0px' }"
            v-if="name == 'RODANTE B. FELINA'">
            <p>Approved by:</p>
            <img :src="signature2" class="signatiz"
              v-if="signature2 !== 'http://172.31.10.164:8000/storage/null' && aor == 0" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }">
              HENRY A. ADORNADO, PhD</p>
            <p style="margin-top: -10px;">Regional Executive Director</p>
          </div>
        </div>
        <div class="outer-container"
          :style="{ marginTop: '-30px', justifyContent: (division == 'ORD' || (name == 'RODANTE B. FELINA' && intervals == 0) || (name == 'LIBERTY B. DAITIA' && intervals == 0)) && !(name == 'RODANTE B. FELINA' && intervals == 1) ? 'flex-end' : 'space-around' }"
          v-if="aor == 1">

          <div class="inner-container2" v-if="divisionChiefs.includes(name) && intervals == 1">
            <p>Recommended by:</p>
            <img :src="signature1" class="signatiz" v-if="signature1 !== 'http://172.31.10.164:8000/storage/null'" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }">
              HENRY A. ADORNADO, PhD</p>
            <p style="margin-top: -10px;">Regional Executive Director</p>
          </div>

          <div class="inner-container2" v-if="!divisionChiefs.includes(name) && intervals == 0 && division !== 'ORD'">
            <p>Recommended by:</p>
            <img :src="signature1" class="signatiz" v-if="signature1 !== 'http://172.31.10.164:8000/storage/null'" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }">
              {{ recommended }}</p>
            <p style="margin-top: -10px;">Chief, {{ division }}</p>
          </div>

          <div class="inner-container2" v-if="!(divisionChiefs.includes(name) && intervals == 1 && division !== 'ORD')">
            <p>Recommended by:</p>
            <img :src="signature1" class="signatiz" v-if="signature1 !== 'http://172.31.10.164:8000/storage/null'" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature1 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }">
              LIBERTY B. DAITIA</p>
            <p style="margin-top: -10px;">CHEIF AOz</p>
          </div>

          <div class="inner-container2"
            :style="{ marginRight: division == 'ORD' || name == 'LIBERTY B. DAITIA' ? '120px' : '0px' }"
            v-if="((divisionChiefs.includes(name) && intervals == 0) || !divisionChiefs.includes(name)) && name != 'RODANTE B. FELINA'">
            <p>Approved by:</p>
            <p style="margin-top: -15px;" v-if="sname !== 20 && sname !== null">By Authority of the OIC, Regional
              Director:</p>
            <img :src="signature2" class="signatiz"
              v-if="signature2 !== 'http://172.31.10.164:8000/storage/null' && aor == 0" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }"
              v-if="sdiv == 5 || sdiv == null">RODANTE B. FELINA</p>
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }"
              v-if="sdiv == 4 && sdiv !== null">ALVIN M. VILLANUEVA</p>
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }"
              v-if="sdiv == 3 && sdiv !== null">OSIN JR. A. SINSUAT</p>
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }"
              v-if="sdiv == 2 && sdiv !== null">LIBERTY B.DAITIA</p>
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }"
              v-if="sdiv == 1 && sdiv !== null">JANICE B.FUROG</p>
            <p style="margin-top: -10px;" v-if="sdiv == 5 || sdiv == null">OIC, Regional Director</p>
            <p style="margin-top: -10px;" v-if="sdiv !== 5 && sdiv !== null">Chief, {{ sdivz.division_name }}</p>
          </div>

          <div class="inner-container2" :style="{ marginRight: division == 'ORD' ? '-10px' : '0px' }"
            v-if="divisionChiefs.includes(name) && intervals == 1">
            <p>Approved by:</p>
            <img :src="signature2" class="signatiz" v-if="signature2 !== 'http://172.31.10.164:8000/storage/null'" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }">
              Atty. DANILO U. UYKIENG</p>
            <p style="margin-top: -10px;">OIC, Bureau Director</p>
          </div>

          <div class="inner-container2" :style="{ marginRight: division == 'ORD' ? '90px' : '0px' }"
            v-if="name == 'RODANTE B. FELINA' && intervals == 0">
            <p>Approved by:</p>
            <img :src="signature2" class="signatiz" v-if="signature2 !== 'http://172.31.10.164:8000/storage/null'" />
            <p class="value"
              :style="{ 'font-weight': 'bold', 'margin-top': (signature2 == 'http://172.31.10.164:8000/storage/null') ? '50px' : '50px' }">
              HENRY A. ADORNADO, PhD</p>
            <p style="margin-top: -10px;">Regional Executive Director</p>
          </div>

        </div>

        <p style="letter-spacing: 5px; text-align: center; margin-top: -25px;">AUTHORIZATION</p>
        <p style="text-align: justify; margin-top: -10px; margin-left: 6%; width: 88%; text-indent: 3em;">I hereby
          authorize the Accountant top deduct the corresponing amount of the unliquidated cash advance from my
          succeeding salary for my failure to liquidate this travel within twenty(20) days upon return to my permanent
          official station pursuant to Commision on Audit(COA) Circular No. 2012-004 dated November 28, 2012.</p>
        <div class="inner-container" style="align-self: flex-end; margin-right: 6%; ">
          <img :src="signature3" class="signatizz" v-if="signature3 !== 'http://172.31.10.164:8000/storage/null'"
            style="margin-top: -50px; margin-bottom: 0px" />
          <p style="font-weight: bold; text-align: center;">{{ name }}</p>
          <p style="text-align: center;">Official Employee</p>
        </div>
        <img :src="qrCodeUrl" alt="QR Code" v-if="qrCodeUrl"
          style="height: 100px; width: 100px; position: absolute; margin-top: 510px;">
        <img :src="imageSrc" alt="QR Code" v-if="qrCodeUrl"
          style="height: 50px; width: 50px; position: absolute; margin-top: 535px; margin-left: 26px">
        <p style="text-align: left; margin-top: -60px; margin-left: 6%;">MGB-X-FAD-FO-033</p>
      </div>
    </div>
  </div>

</template>

<script setup>
import alerz from '../components/heder.vue'
import QRCode from 'qrcode'
</script>

<script>
import jsPDF from 'jspdf';
import axios from 'axios';
import mgbx from '../assets/mgbx.png'
export default {
  props: {
    travel_order_id: String
  },
  data() {
    return {
      yearToday: new Date().getFullYear(),
      name: '',
      position: '',
      departure: '',
      destination: '',
      date: '',
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
      divisionChiefs: [
        'LIBERTY B. DAITIA',
        'OSIN JR. A. SINSUAT',
        'JANICE B. FUROG',
        'ALVIN M. VILLANUEVA',
        'RODANTE B. FELINA'
      ]
    };
  },
  mounted() {
    if (this.travel_order_id !== null) {
      this.populateFields(this.travel_order_id);
    }
    this.fetchData();
    this.fetchNames();
    this.fetchPositions();
    this.fetchDivisions();
    this.fetchEmployees();
    this.fetchAccounts();
  },
  watch: {
    travel_order_id(newVal) {
      if (newVal !== null) {
        this.populateFields(newVal);
      }
    }
  },
  methods: {
    async generateQRCode() {
      const textToEncode = `MGBX TRAVEL ORDER \nTRAVEL ORDER NO. ${this.padWithZeroes(this.to_num)}-${this.yearToday}\n${this.name}`;
      try {
        this.qrCodeUrl = await QRCode.toDataURL(textToEncode);
      } catch (err) {
        console.error(err);
      }
    },
    padWithZeroes(travel_order_id) {
      const idString = travel_order_id.toString();
      if (idString.length < 4) {
        return '0'.repeat(4 - idString.length) + idString;
      } else {
        return idString;
      }
    },
    close() {
      travel_order_id = null;
      this.$emit('close');
    },
    printzz() {
      window.print();
    },

    downloadPDF() {
      const pdf = new jsPDF('p', 'mm', 'a4');

      const content = document.getElementById('pdf-content');

      pdf.html(content, {
        html2canvas: { scale: 0.26 },
        x: 0,
        y: 0,
        callback: () => {
          pdf.save('travel_order.pdf');
        }
      });
    },
    fetchAccounts() {
      axios.get('http://172.31.10.164:8000/get_accounts_json')
        .then(response => {
          this.accounts = response.data;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchData() {
      axios.get('http://172.31.10.164:8000/get_forms_json')
        .then(response => {
          this.formData = response.data;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchNames() {
      axios.get('http://172.31.10.164:8000/get_names_json')
        .then(response => {
          this.names = response.data;
        })
        .catch(error => {
          console.error('Error fetching names:', error);
        });
    },
    fetchPositions() {
      fetch('http://172.31.10.164:8000/get_positions_json/')
        .then(response => response.json())
        .then(data => {
          this.positions = data;
        })
        .catch(error => {
          console.error('Error fetching positions:', error);
        });
    },
    fetchDivisions() {
      fetch('http://172.31.10.164:8000/get_divisions_json/')
        .then(response => response.json())
        .then(data => {
          this.divisions = data;
        })
        .catch(error => {
          console.error('Error fetching divisions:', error);
        });
    },
    fetchEmployees() {
      fetch('http://172.31.10.164:8000/get_employees_json/')
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
      const selectedForm = this.formData.find(form => form.travel_order_id === travelOrderId);
      if (selectedForm) {
        this.name_id = selectedForm.name_id;
        this.position_id = selectedForm.position_id;
        this.departure = selectedForm.departure;
        this.destination = selectedForm.destination;
        this.date = selectedForm.date;
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
        this.signature1 = `http://172.31.10.164:8000/storage/${selectedForm.signature1}`;
        this.signature2 = `http://172.31.10.164:8000/storage/${selectedForm.signature2}`;
        this.signature3 = 'http://172.31.10.164:8000/storage/null';


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
          this.signature3 = `http://172.31.10.164:8000/storage/${selectedAccount.signature}`;
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
.a4-container {
  position: relative;
  width: 210mm;
  height: 296mm;
  margin: 0 auto;
  padding: 10px;
  border: 1px solid #ccc;
}

.a4-content {
  height: 295mm;
}

.a4-photo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 98%;
  z-index: -1;
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
  margin-bottom: -10px;
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
  margin-left: -20px;
}

.inner-container2 {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 10px;
  margin-left: -20px;
  justify-content: center;
  align-items: center;
}

.label-value-row {
  display: flex;
  flex-direction: row;
}

.inner-container p {
  margin: 5px 0;
  display: flex;
  font-size: 18px;
  text-align: left;
}

.label {
  font-weight: bold;
  width: 180px;
}

.value {
  text-decoration: underline;
  word-wrap: break-word;
  max-width: 30ch;
  text-align: left;
}

.label-value-row2 {
  display: flex;
  flex-direction: row;
  margin-left: 6%;
  margin-top: -10px;
  margin-bottom: -20px;
}

.label2 {
  font-weight: bold;
  width: auto;
}

.value2 {
  text-decoration: underline;
  margin-left: 20px;
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
  height: 100px;
  width: auto;
  margin-bottom: -50px;
  margin-top: -15px;
}

.signatizz {
  height: auto;
  width: 100px;
  margin-bottom: -50px;
  margin-top: -15px;
  margin: auto;
}

@media print {
  .buttons {
    display: none !important;
  }

  .a4-container {
    margin-top: -70px;
    margin-bottom: -1000px;
    overflow: hidden;
  }

  @page {
    size: A4;
  }
}
</style>
