<template>
<div class="hehehe">
      <div ref="content" class="a4-contentz">
        <!-- Your content goes here -->
        <p class="a4-to" style="text-align: center; font-family: Arial, Helvetica, sans-serif;">TRAVEL CLEARANCE</p>
        <p class="a4-textBold">No. <span class="a4-textspank">{{ clearance_number }}</span></p>
        <div class="travel-info-grid">

          <!-- Full-width section (Bottom) -->
          <div class="travel-info-full-width" style="margin-top: 20px;">
            <div class="info-row">
              <p class="info-label">Names of Personnel:</p>
              <p class="info-value-name">{{ getFormattedNames(name_id)}}</p>
            </div>
            <div class="info-row">
              <p class="info-label">PAP Code:</p>
              <p class="info-value">{{ pap_code }}</p>
            </div>
            <div class="info-row">
              <p class="info-label">Purpose:</p>
              <p class="info-value">{{ purpose }}</p>
            </div>
            <div class="info-row">
              <p class="info-label">Location:</p>
              <p class="info-value">{{ destination }}</p>
            </div>

            <div class="info-row">
              <p class="info-label">Travel Date:</p>
              <p class="info-value">{{ departure }} to {{ arrival }}</p>
            </div>

            <div class="form-group">
              <p class="info-label">Basis of Approval</p>

              <!-- Top-level basis -->
              <div>
                <input 
                  type="checkbox" 
                  value="fieldworkWithinPlan" 
                  :checked="form.selectedBasis === 'fieldworkWithinPlan'" 
                  @change="form.selectedBasis = 'fieldworkWithinPlan'" 
                />
                Fieldwork within the Approved Travel Plan
              </div>
            
              <!-- Sub-basis for fieldworkWithinPlan -->
              <div style="margin-left: 20px;">
                <input 
                  type="checkbox" 
                  value="withinScheduledPeriod" 
                  :checked="form.selectedSubBasis === 'withinScheduledPeriod'" 
                  @change="form.selectedSubBasis = 'withinScheduledPeriod'" 
                />
                Within the Scheduled Period
              </div>
              <div style="margin-left: 20px;">
                <input 
                  type="checkbox" 
                  value="outsideScheduledPeriod" 
                  :checked="form.selectedSubBasis === 'outsideScheduledPeriod'" 
                  @change="form.selectedSubBasis = 'outsideScheduledPeriod'" 
                />
                Outside the Scheduled Period
              </div>
              <div style="margin-left: 20px;">
                <input 
                  type="checkbox" 
                  value="previousReportToRD" 
                  :checked="form.selectedSubBasis === 'previousReportToRD'" 
                  @change="form.selectedSubBasis = 'previousReportToRD'" 
                />
                Previous Travel Report endorsed to RD
              </div>
              <div style="margin-left: 20px;">
                <input 
                  type="checkbox" 
                  value="copyOfInstruction" 
                  :checked="form.selectedSubBasis === 'copyOfInstruction'" 
                  @change="form.selectedSubBasis = 'copyOfInstruction'" 
                />
                Copy of Instruction from the RD/DC
              </div>
              <div style="margin-left: 20px;">
                <input 
                  type="checkbox" 
                  value="copyOfInvitation" 
                  :checked="form.selectedSubBasis === 'copyOfInvitation'" 
                  @change="form.selectedSubBasis = 'copyOfInvitation'" 
                />
                Copy of Invitation, Memo, and SO
              </div>
            
              <!-- Other top-level basis -->
              <div>
                <input 
                  type="checkbox" 
                  value="fieldworkNotWithinPlan" 
                  :checked="form.selectedBasis === 'fieldworkNotWithinPlan'" 
                  @change="form.selectedBasis = 'fieldworkNotWithinPlan'" 
                />
                Fieldwork not within the Approved Travel Plan
              </div>
            
              <div>
                <input 
                  type="checkbox" 
                  value="interveningActivity" 
                  :checked="form.selectedBasis === 'interveningActivity'" 
                  @change="form.selectedBasis = 'interveningActivity'" 
                />
                Intervening Activity
              </div>
            </div>

            <div class="info-row">
              <p class="info-label">Remarks:</p>
              <p class="info-value">{{ remarks ? remarks : 'None' }}</p>
            </div>
            <div class="info-row">
              <p class="info-label">Reviewed by:</p>
            </div>
            
            <img 
              src="http://202.137.117.84:8011/storage/images/9atB1WAmuVpgCcpu22L3klSzrxpsBzsLTuGrNqdu.png" 
              alt="Signature Image"
              style="height: 60px; width: 90px;margin-bottom: -80px; margin-left: 40px;"
            />

            <div class="info-row2" style="margin-top: 50px;">
              <p class="info-label">KAYSHE JOY F. PELINGON</p>
            </div>
            <div class="info-row" style="margin-top: -20px;">
              <p class="info-label">Planning Officer II
              </p>
            </div>
            <div class="footertext">
              <p>Note: Print out this form in 2 copies.</p>
              <p>This clearance was automatically generated through the MGB-X Automated Clearance for Travel (MGB-X A.C.T.) System.</p>
              <p>It is valid without a physical signature as long as unaltered.</p>
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
import axios from 'axios';
import mgbx from '../../assets/mgbx.png'
import { API_BASE_URL } from '../../config'

export default {
  props: {
    clearance_id: String
  },
  data() {
    return {
      date: '',
      name: '',
      name_id: '',
      departure: '',
      destination: '',
      division_id: '',
      station: '',
      arrival: '',
      purpose: '',
      pap_code: '',
      basis_of_approval: '',
      remarks: '',
      clearance_number: '',
      signature1: '',
      signature2: '',
      signature3: '',
      names: {},
      positions: [],
      divisions: [],
      employees: [],
      accounts: [],
      recommended: '',
      approver: '',
      approver_title: '',
      qrCodeUrl: '',
      imageSrc: mgbx,
      basisOptions: [
      { value: 'fieldworkWithinPlan', label: 'Fieldwork within the Approved Travel Plan' },
      { value: 'fieldworkNotWithinPlan', label: 'Fieldwork not within the Approved Travel Plan' },
      { value: 'interveningActivity', label: 'Intervening Activity' }
    ],
    subBasisOptions: [
      { value: 'withinScheduledPeriod', label: 'Within the Scheduled Period' },
      { value: 'outsideScheduledPeriod', label: 'Outside the Scheduled Period' },
      { value: 'previousReportToRD', label: 'Previous Travel Report endorsed to RD' },
      { value: 'copyOfInstruction', label: 'Copy of Instruction from the RD/DC' },
      { value: 'copyOfInvitation', label: 'Copy of Invitation, Memo, and SO' }
    ],
    form: {
      selectedBasis: '',
      selectedSubBasis: ''
    }
    };
  },
  mounted() {
    if (window.location.pathname === '/travelclearance') {
      this.blareClass = 'blare';
    } else {
      this.blareClass = 'blareblank';
    }
    this.fetchNames();
    this.fetchPositions();
    this.fetchDivisions();
    this.fetchEmployees();
    this.fetchAccounts();
    if (this.clearance_id !== 0) {
      this.fetchData(this.clearance_id);
    }
  },
  watch: {
    clearance_id(newVal) {
      if (newVal !== 0) {
        this.fetchData(newVal);
      }
    }
  },
  methods: {
    async generateQRCode() {
      const textToEncode = `MGBX TRAVEL CLEARANCE \nCLEARANCE NO. ${this.clearance_number}\n${this.name}\nDate of Travel: ${this.departure} - ${this.arrival}\nDestination: ${this.destination}\nPurpose: ${this.purpose}`;
      try {
        this.qrCodeUrl = await QRCode.toDataURL(textToEncode);
      } catch (err) {
        console.error(err);
      }
    },
    fetchData() {
      axios.get(`${API_BASE_URL}/travel_clearances/${this.clearance_id}`)
        .then(response => {
          this.populateFields(response.data);
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
    fetchAccounts() {
      axios.get(`${API_BASE_URL}/get_accounts_json`)
        .then(response => {
          this.accounts = response.data;
        })
        .catch(error => {
          console.error('Error fetching accounts:', error);
        });
    },
    getPosition(position_id) {
      const selectedPosition = this.positions.find(position => position.position_id === position_id);
      return selectedPosition ? selectedPosition.position_name : 'Unknown';
    },
    getDivision(division_id) {
      const selectedDivision = this.divisions.find(division => division.division_id === division_id);
      return selectedDivision ? selectedDivision.division_name : 'Unknown';
    },
    populateFields(data) {
      this.date = data.date;
      this.name_id = data.name_id;
      this.position_id = data.position_id;
      this.departure = data.departure;
      this.destination = data.destination;
      this.division_id = data.division_id;
      this.station = data.station;
      this.arrival = data.arrival;
      this.purpose = data.purpose;
      this.pap_code = data.pap_code;
      this.remarks = data.remarks;
      this.clearance_number = data.clearance_number;
      this.signature1 = `${API_BASE_URL}/storage/${data.signature1 || 'null'}`;
      this.signature2 = `${API_BASE_URL}/storage/${data.signature2 || 'null'}`;
      const basis = data.basis_of_approval || '';

      const withinPlanOptions = [
        'withinScheduledPeriod',
        'outsideScheduledPeriod',
        'previousReportToRD',
        'copyOfInstruction',
        'copyOfInvitation',
      ];
          
      if (withinPlanOptions.includes(basis)) {
        this.form.selectedBasis = 'fieldworkWithinPlan';
        this.form.selectedSubBasis = basis;
      } else if (['fieldworkNotWithinPlan', 'interveningActivity'].includes(basis)) {
        this.form.selectedBasis = basis;
        this.form.selectedSubBasis = '';
      } else {
        this.form.selectedBasis = '';
        this.form.selectedSubBasis = '';
      }

      const nameDetails = this.names[this.name_id - 1];
      if (nameDetails) {
        this.name = `${nameDetails.first_name.toUpperCase()} ${nameDetails.middle_init.toUpperCase()} ${nameDetails.last_name.toUpperCase()}`;
      }

      // Set recommended and approver based on division and logic
      const selectedDivision = this.divisions.find(division => division.division_id === this.division_id);
      if (selectedDivision) {
        const recommendedEmployee = this.employees.find(employee => employee.division_id === this.division_id && employee.chief > 0);
        if (recommendedEmployee) {
          this.recommended = this.getName(recommendedEmployee.name_id - 1);
        }
      }


      this.generateQRCode();
    },
    getFormattedNames(nameIds) {
      if (!nameIds) return 'Unknown';
      const ids = String(nameIds)
        .split(',')
        .map(id => parseInt(id.trim(), 10))
        .filter(Boolean);

      const namesArray = ids.map(id => {
        const name = this.names[id - 1]; // ✅ correct for IDs starting at 1
        if (!name) return null;
      
        const { first_name, middle_init, last_name } = name;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      }).filter(Boolean);

      if (namesArray.length === 0) return 'Unknown';
      if (namesArray.length === 1) return namesArray[0];
      if (namesArray.length === 2) return namesArray.join(' and ');

      const lastName = namesArray.pop();
      return `${namesArray.join(', ')}, and ${lastName}`;
    },
  }
};
</script>

<style scoped>
/* Make all checkboxes black */
input[type="checkbox"] {
    accent-color: black;
  }
/* Similar styles to PDF.vue, adapted for Travel Clearance */
.hehehe{
  display: none;
}
.blare {
  height: 0px; margin-top: -25000px;
}
.blareblank{

}
.a4-containerz {
  width: 210mm;
  height: 296mm;
  margin: 0 auto;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: -10000px;
  position: relative;
  font-family: Arial, Helvetica, sans-serif;
}

.a4-contentz {
  height: 295mm;
  z-index: 2;
}

.a4-photo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 98%;
  z-index: 1;
}

.a4-to {
  margin-top: 15.5%;
  letter-spacing: 3px;
  font-weight: bold;
  font-size: 25px;
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

.a4-textspank {
  font-weight: bold;
  font-size: 20px;
  color: #000000;
}

.travel-info-grid {
  display: grid;
  grid-template-columns: 6fr 4fr;
  padding: 20px;
  margin-top: -30px;
}

.travel-info-left,
.travel-info-right {
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
}

.travel-info-full-width {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-top: -40px;
  margin-bottom: -60px;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 10px;
  align-items: center;
  margin-top: -10px;
}
.info-row2 {
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 10px;
  align-items: center;
  margin-top: -20px;
}

.info-label {
  font-weight: bold;
  text-align: left;
}

.info-value {
  text-align: left;
}
.info-value-name{
  text-align: left;
  font-weight: bolder;
  font-size: 14px;
  text-decoration: underline;
}

.info-label, .info-value {
  font-size: 14px;
}

.outer-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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

.certz {
  margin-top: 20px;
}

.label2 {
  font-size: 18px;
}

.recoz, .aproz {
  font-weight: bold;
  text-align: center;
}

.signatiz {
  height: 80px;
  width: auto;
  margin-bottom: -65px;
  margin-top: -15px;
  pointer-events: none;
}

.signatizz {
  height: 70px;
  width: 50px;
  margin-bottom: -50px;
  margin-top: 5px;
  margin: auto;
}

.footertext{
  text-align: center;
  font-size: 12px;
}

.footertext p{
  margin-bottom: -10px;
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
  display: flex; flex-direction: column; position: absolute; bottom: 0; z-index: 3;
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
  .hehehe{
    display: flex;
  }
  .bglang {
    display: none !important;
  }
  .blare{
    margin-top: 0;
  }
  .a4-containerz {
    border: none;
    margin-top: -20px;
    height: calc(100vh - 40px);
    overflow: hidden;
    opacity: 100;
  }
  .a4-contentz{
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
