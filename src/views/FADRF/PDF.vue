
 <script setup>
 import { onMounted, ref, watch } from 'vue';
 import { API_BASE_URL } from '@/config';
 import axios from 'axios';
 import TableComponent from './table.vue';
 import PDF from './PDF.vue';
 const fetchedData = ref([]);
 const handleDataFetched = (data) => {
  fetchedData.value = data; // Store the fetched data
};
 import jsPDF from 'jspdf';
 const props = defineProps({
  fetchedData: {
    type: Array,
    required: true
  }
});


 const otherDocumentText = ref("");
 const selectedName = ref(null);
 const division = ref('');
 const names = ref([]);
 const employees = ref([]);
 const divisions = ref([]);
 const pleaseWait = ref(false);
 const loading = ref(false);
 const formDisable = ref(false);
 const documents = ref([
   { name: 'PURCHASE REQUEST - REQUISITION AND ISSUE SLIP', checked: false },  
   { name: 'CERTIFICATE OF EMPLOYMENT WITH COMPENSATION', checked: false },  
   { name: 'INVENTORY CUSTODIAN SLIP', checked: false },  
   { name: 'PROPERTY ACKNOWLEDGEMENT RECEIPT', checked: false },  
   { name: 'GATE PASS', checked: false },  
   { name: 'PO FUEL', checked: false },  
   { name: 'PROPERTY RETURN SLIP', checked: false },  
   { name: 'R&M OF MOTOR VEHICLES', checked: false },  
   { name: 'JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C', checked: false },  
   { name: 'OTHERS', checked: false }  
 ]);
 
 watch(otherDocumentText, (newValue) => {
   otherDocumentText.value = newValue.toUpperCase(); // Automatically capitalize the input
 });
 
const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/FADRFget_request`);
    formData.value = response.data.map(item => ({
      ...item,
      documents: item.documents ? JSON.parse(item.documents) : [] // Ensure documents is an array
    }));
    console.log('Fetched Data:', formData.value); // Log the fetched data
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};




 const fetchSelectedEmployee = () => {
   const selectedEmployee = employees.value.find(emp => emp.name_id === selectedName.value);
   if (selectedEmployee) {
     form.value.name_id = selectedName.value;
     form.value.division_id = selectedEmployee.division_id;
     division.value = findDivisionName(selectedEmployee.division_id);
   } else {
     form.value.name_id = '';
     form.value.division_id = '';
     division.value = '';
   }
 };
 
 const findDivisionName = (divisionId) => {
   const divisionItem = divisions.value.find(div => div.division_id === divisionId);
   return divisionItem ? divisionItem.division_name : '';
 };
 
 // PDF generation function
 const generatePDF = () => {
  const doc = new jsPDF('p', 'mm', 'a5');
  
  // Assuming you want to generate a PDF for the first item in formData
  const item = formData.value[0]; // Get the first item for demonstration

  if (!item) {
    console.error('No item found in formData');
    return; // Exit if item is not found
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  // Title
  doc.text('Request Slip Form', 15, 20);
  doc.text('Administrative Section - Procurement/Property', 15, 30);
  
  // Date & Time
  doc.text(`Date & Time: ${item.date || 'N/A'}`, 20, 40); // Use 'N/A' if date is not available
  
  // Name and Division
  doc.text(`Name: ${item.name || 'N/A'}`, 20, 50); // Use 'N/A' if name is not available
  doc.text(`Division: ${item.division || 'N/A'}`, 20, 60); // Use 'N/A' if division is not available
  
  // Documents
  doc.text('Documents Requested:', 20, 70);
  let yOffset = 80;
  
  if (item.documents && Array.isArray(item.documents)) {
    item.documents.forEach(doc => {
      doc.text(`- ${doc}`, 20, yOffset);
      yOffset += 10;
    });
  } else {
    doc.text('No documents requested', 20, yOffset);
  }

  // Save PDF
  doc.save('request-slip.pdf');
};
 
 const handleSubmit = async () => {
  // ... existing code ...
  
  try {
    const response = await axios.post(`${API_BASE_URL}/FADRFsubmit_request`, form.value);

    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to submit request');
    }

    // After submission, show the PDF in popup instead of just generating
    showPDFInPopup();

    alert('Request submitted successfully!');
    form.value.documents = [];
    documents.value.forEach(doc => (doc.checked = false));
    
  } catch (error) {
    // ... existing error handling ...
  }
 
   form.value.documents = documents.value
     .filter(doc => doc.checked)
     .map(doc => (` ${doc.name}`));
 
   if (!form.value.name_id || !form.value.division_id || form.value.documents.length === 0) {
     alert('Please fill all required fields and select at least one document.');
     return;
   }
 
   pleaseWait.value = true;
   loading.value = true;
   formDisable.value = true;
 
   try {
     const response = await axios.post(`${API_BASE_URL}/FADRFsubmit_request`, form.value);
 
     if (response.status < 200 || response.status >= 300) {
       throw new Error('Failed to submit request');
     }
 
     // After submission, generate the PDF
     generatePDF();
 
     alert('Request submitted successfully!');
     form.value.documents = [];
     documents.value.forEach(doc => (doc.checked = false));
     
   } catch (error) {
     console.error('Submission error:', error);
     alert('Error submitting request. Please try again.');
   } finally {
     pleaseWait.value = false;
     loading.value = false;
     formDisable.value = false;
   }
 };
 
 onMounted(() => {
   fetchData();
   updateDateTime();
   console.log(pdfContainer.value);
 });

 </script>

 <style scoped>
.leavebuttonss {
 display: flex;
 position: relative;
 flex-direction: row;
 height: 40px;
 justify-content: space-around;
 margin-top: 8px;

}
.leavebutton {
 border-radius: 10px;
 width: 20%;
 font-weight: bold;
 font-size: 20px;
 
}
.containerlist {
 
   position: relative;
   left: 4px;
   top: 10px;
   margin-right: 8px;
   cursor: default;

}

.containerlist input {
   display: none;
}

.containerlist svg {
   overflow: visible;
   height: 12px;
   width: 13px;
}



.containeremployee {
   
   display: flex;
   justify-content: center;

}

.containeremployee input {
   display: none;
}

.containeremployee svg {
   overflow: visible;
   height: 15px;
   width: 15px;
}

.path {

   fill: none;
   stroke: black;
   stroke-width: 6;
   stroke-linecap: round;
   stroke-linejoin: round;
   transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
   stroke-dasharray: 241 9999999;
   stroke-dashoffset: 0;
}

.containeremployee input:checked~svg .path,
.containerlist input:checked~svg .path {
   stroke-dasharray: 70.5096664428711 9999999;
   stroke-dashoffset: -262.2723388671875;
}

.a4-containerz {
   position: relative;
   width: 100mm;
   height: 200mm;
   margin: 0 auto;
   padding: 10px;
   border: 1px solid #ccc;
}

.a4-contentz {
   height: 295mm;
}

.pic1 {
   height: 80px;
   width: auto;
   margin: auto;
}

.pic2 {
   height: 100px;
   width: auto;
   margin: auto;
}

.grid-container {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   grid-gap: 0px;
   width: 350px;
   margin: auto;
}

.grid-item {
   padding: 2px;
   border: 1px solid #ccc;
   text-align: left;
}

.leavecredits {
   height: 10px;
   width: 110px;
   font-size: 9px;
   border: none;
   outline: none;
   position: relative;
   top: 2px;
}

.cuearez{
  display: flex; flex-direction: column; position: absolute; bottom: 0; right: 0;
}

.bigzz{
  height: 100px; width: 100px; margin-left: 145px; margin-bottom: 5px; margin-top: -57px; position: absolute;
}
.centzz{
  height: 30px; width: 30px;  margin-top: -18px; margin-left: 185px; position: absolute; opacity: 50%;
}
.qrquotez {
    margin-top: 55px; margin-right: 10px;margin-bottom: 20px;
}

@media print {
    .leverage{
        display: none !important;
    }
    .qrquote {
    margin-top: 50px;
    }
    .a4-containerz {
    border: none;
    height: calc(100vh - 40px); /* Adjust height to fit one page */
    max-height: 100%;
    overflow: hidden; /* Prevent content overflow */
    position: absolute; /* Allows for precise positioning */
    top: 0px; /* Move the container down by 20mm */
    opacity: 100%;
    margin-top: 0px;
  }
  @page {
    size: A4;
    margin: 5%;
  }

  .popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  position: relative;
  width: 60%; /* Reduced from 80% to 60% */
  max-width: 500px; /* Adding a max-width */
  max-height: 80%; /* Reduced from 90% to 80% */
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
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
  .signatizz{
    z-index: 999;
  }

}
</style>