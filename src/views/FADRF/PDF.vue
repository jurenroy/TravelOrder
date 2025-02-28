<template>
  <div>
    <!-- PDF component doesn't need a visual interface -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PDF',
  props: {
    item: {
      type: Object,
      required: true
    },
    names: {
      type: Object,
      required: true
    },
    divisions: {
      type: Array,
      required: true
    },
    logoPath: {
      type: String,
      default: ""
    }
  },
  methods: {
    findDivisionName(division_Id) {
      if (this.divisions && this.divisions.length > 0) {
        const division = this.divisions.find(div => div.division_id === division_Id);
        return division?.division_name || 'UNKNOWN';
      }
      return 'UNKNOWN';
    },
    
    getName(nameId) {
      const name = this.names[nameId - 1];
      if (name) {
        const { first_name, middle_init, last_name } = name;
        return `${first_name.toUpperCase()} ${middle_init.toUpperCase()} ${last_name.toUpperCase()}`;
      }
      return 'Unknown';
    },
    generatePDF(item) {
      // Create a reference to your PDF component
      const pdfComponent = this.$refs.pdfComponent;
      
      // If the PDF component exists, call its generatePDF method with the item
      if (pdfComponent) {
        pdfComponent.item = item;
        pdfComponent.generatePDF();
      } else {
        console.error('PDF component reference not found');
      }
    },
    generatePDF() {
      this.$nextTick(() => {
        const printableElement = document.createElement("div");
        printableElement.id = "printableArea";
        printableElement.style.padding = "20px";
        printableElement.style.fontFamily = "Arial, sans-serif";
        printableElement.style.textAlign = "center";

        // Make sure documents is an array
        const requestedDocs = Array.isArray(this.item.documents) ? this.item.documents : JSON.parse(this.item.documents || '[]');
        
        // Extract the time from the date string
        let timeRequested = "";
        try {
          const dateObj = new Date(this.item.date);
          if (!isNaN(dateObj.getTime())) {
            // Format time as HH:MM AM/PM
            timeRequested = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        } catch (e) {
          console.error("Error parsing date:", e);
        }

        let othersText = "";
        if (this.item.otherDocuments) {
          othersText = this.item.otherDocuments;
        } else if (typeof this.item.documents === 'string' && this.item.documents.includes('Others:')) {
          // Alternative: if you're storing it as "Others: TEXTHERE" in the documents array
          const othersMatch = this.item.documents.match(/Others:\s*(.+?)(?:,|$)/);
          if (othersMatch && othersMatch[1]) {
            othersText = othersMatch[1].trim();
          }
        }
        
        // Function to generate rating option HTML based on current rating
        const generateRatingOption = (value, label) => {
          // Only parse and apply rating if it exists and is not null/undefined/empty
          const hasRating = this.item.rating !== undefined && this.item.rating !== null && this.item.rating !== '';
          const currentRating = hasRating ? parseInt(this.item.rating) : null;
          const isSelected = hasRating && currentRating === value;
          
          // Add revision text only for Very dissatisfied rating (value 1)
          const revisionText = value === 1 ? '<span style="margin-left: 370px; font-weight: normal;">revised document Feb 2025</span>' : '';
          
          return `
            <div class="rating-option ${isSelected ? 'selected' : ''}">
              <span class="star ${isSelected ? 'filled' : 'empty'}">${isSelected ? '★' : '☆'}</span>
              <strong>${value} - ${label}</strong>
              ${revisionText}
            </div>
          `;
        };
        
        printableElement.innerHTML = `
          <body>
            <div class="container">
              <div class="header">
                <div class="logo-section">
                  <img src="${this.logoPath}" alt="DENR Logo" class="logo">
                  <div class="title-section">
                    <h3>Republic of the Philippines</h3>
                    <h4>Department of Environment and Natural Resources</h4>
                    <h4>MINES AND GEOSCIENCES BUREAU</h4>
                    <h4>Regional Office No. X</h4>
                    <p>DENR-X Compound, Puntod, Cagayan de Oro City</p>
                    <p>Telefax Nos. (088) 856-2110;(088) 856-1331; Email: region10@mgb.gov.ph</p>
                  </div>
                </div>
                <div class="certification-section">
                  <div class="certification-images">
                    <img src="/api/placeholder/50/50" alt="ISO Certification">
                    <img src="/api/placeholder/50/50" alt="Quality Certification">
                  </div>
                </div>
              </div>
              
              <div class="form-title">REQUEST SLIP FORM</div>
              <div class="admin-section">(Administrative Section-Procurement/Property)</div>
              
              <div class="form-content">
                <table>
                  <tr class="form-row">
                    <td><strong>Requestor:</strong></td>
                    <td>${this.getName(this.item.name_id)}</td>
                    <td rowspan="3"></td>
                  </tr>
                  <tr class="form-row">
                    <td><strong>Division:</strong></td>
                    <td>${this.findDivisionName(this.item.division_id)}</td>
                  </tr>
                  <tr class="form-row">
                    <td><strong>Date & Time:</strong></td>
                    <td>${this.item.date}</td>
                  </tr>
                  
                  <tr class="documents-header">
                    <td colspan="2">DOCUMENT(S) REQUESTED</td>
                    <td style="width: 20%;">Time Requested</td>
                    <td style="width: 30%;">Date and Time Released</td>
                  </tr>

                  <tr class="documents-row">
                    <td><input type="checkbox" ${requestedDocs.includes('PURCHASE REQUEST - REQUISITION AND ISSUE SLIP') ? 'checked' : ''} /></td>
                    <td>PURCHASE REQUEST - REQUISITION AND ISSUE SLIP</td>
                    <td>${requestedDocs.includes('PURCHASE REQUEST - REQUISITION AND ISSUE SLIP') ? timeRequested : ''}</td>
                    <td></td>
                  </tr>
                  <tr class="documents-row">
                    <td><input type="checkbox" ${requestedDocs.includes('CERTIFICATE OF EMPLOYMENT WITH COMPENSATION') ? 'checked' : ''} /></td>
                    <td>CERTIFICATE OF EMPLOYMENT WITH COMPENSATION</td>
                    <td>${requestedDocs.includes('CERTIFICATE OF EMPLOYMENT WITH COMPENSATION') ? timeRequested : ''}</td>
                    <td></td>
                  </tr>
                  <tr class="documents-row">
                    <td><input type="checkbox" ${requestedDocs.includes('INVENTORY CUSTODIAN SLIP') ? 'checked' : ''} /></td>
                    <td>INVENTORY CUSTODIAN SLIP</td>
                    <td>${requestedDocs.includes('INVENTORY CUSTODIAN SLIP') ? timeRequested : ''}</td>
                    <td></td>
                  </tr>
                  <tr class="documents-row">
                    <td><input type="checkbox" ${requestedDocs.includes('PROPERTY ACKNOWLEDGEMENT RECEIPT') ? 'checked' : ''} /></td>
                    <td>PROPERTY ACKNOWLEDGEMENT RECEIPT</td>
                    <td>${requestedDocs.includes('PROPERTY ACKNOWLEDGEMENT RECEIPT') ? timeRequested : ''}</td>
                    <td></td>
                  </tr>
                  <tr class="documents-row">
                    <td><input type="checkbox" ${requestedDocs.includes('GATE PASS') ? 'checked' : ''} /></td>
                    <td>GATE PASS</td>
                    <td>${requestedDocs.includes('GATE PASS') ? timeRequested : ''}</td>
                    <td></td>
                  </tr>
                  <tr class="documents-row">
                    <td><input type="checkbox" ${requestedDocs.includes('PO FUEL') ? 'checked' : ''} /></td>
                    <td>PO FUEL</td>
                    <td>${requestedDocs.includes('PO FUEL') ? timeRequested : ''}</td>
                    <td></td>
                  </tr>
                  <tr class="documents-row">
                    <td><input type="checkbox" ${requestedDocs.includes('PROPERTY RETURN SLIP') ? 'checked' : ''} /></td>
                    <td>PROPERTY RETURN SLIP</td>
                    <td>${requestedDocs.includes('PROPERTY RETURN SLIP') ? timeRequested : ''}</td>
                    <td></td>
                  </tr>
                  <tr class="documents-row">
                    <td><input type="checkbox" ${requestedDocs.includes('R&M OF MOTOR VEHICLES') ? 'checked' : ''} /></td>
                    <td>R&M OF MOTOR VEHICLES</td>
                    <td>${requestedDocs.includes('R&M OF MOTOR VEHICLES') ? timeRequested : ''}</td>
                    <td></td>
                  </tr>
                  <tr class="documents-row">
                    <td><input type="checkbox" ${requestedDocs.includes('JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C') ? 'checked' : ''} /></td>
                    <td>JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C</td>
                    <td>${requestedDocs.includes('JOB ORDER FOR FURNITURE & FIXTURES, LIGHTINGS, PLUMBING, & A/C') ? timeRequested : ''}</td>
                    <td></td>
                  </tr>
                  <tr class="documents-row">
                    <td><input type="checkbox" ${requestedDocs.includes('Others') ? 'checked' : ''} /></td>
                    <td>Others: ${othersText ? othersText : '_______________________________'}</td>
                    <td>${requestedDocs.includes('Others') ? timeRequested : ''}</td>
                    <td></td>
                  </tr>
                  
                  <tr>
                    <td colspan="4" class="rating-label">RATING</td>
                  </tr>
                  <tr class="rating-row">
                    <td colspan="4">
                      ${generateRatingOption(4, 'Very Satisfied')}
                      ${generateRatingOption(3, 'Satisfied')}
                      ${generateRatingOption(2, 'Dissatisfied')}
                      ${generateRatingOption(1, 'Very dissatisfied')}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </body>

          <style scoped>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #000;
            }
            
            .container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #ccc;
            }
            
            .header {
              display: flex;
              border-bottom: 1px solid #ccc;
              padding: 10px;
            }
            
            .logo-section {
              display: flex;
              width: 70%;
            }
            
            .logo {
              width: 100px;
              height: 100px;
            }
            
            .title-section {
              padding-left: 10px;
              line-height: 1.2;
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
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
            }
            
            td {
              border: 1px solid #ccc;
              padding: 5px 10px;
            }
            
            .form-row td:first-child {
              width: 20%;
              font-weight: bold;
            }
            
            .form-row td:nth-child(2) {
              width: 50%;
              border-bottom: 1px solid #000;
            }
            
            .form-row td:last-child {
              width: 30%;
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
          </style>
        `;

        document.body.appendChild(printableElement);
        
        // Create an iframe for printing
        const printFrame = document.createElement('iframe');
        printFrame.style.display = 'none'; // Hide the iframe
        document.body.appendChild(printFrame); // Append it to the body

        // Prepare the content for the iframe
        const printDocument = printFrame.contentWindow.document;
        printDocument.open();
        printDocument.write(`
          <html>
            <head>
              <title>Print Request Slip</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                h2 { margin-bottom: 10px; }
              </style>
            </head>
            <body>${printableElement.innerHTML}</body>
          </html>
        `);
        printDocument.close();

        // Focus on the iframe and trigger print
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();

        // Clean up: remove the iframe after printing
        printFrame.parentNode.removeChild(printFrame);

        // Remove the printable element from the document
        document.body.removeChild(printableElement);
      });
    }
  }
};
</script>

<style scoped>
/* No specific styles needed for the component itself */
</style>