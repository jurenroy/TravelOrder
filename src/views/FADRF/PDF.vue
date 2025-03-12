<template>
  <div>
    <!-- PDF component doesn't need a visual interface -->
     <p></p>
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
    otherDocumentText: {
    type: String,
    default: ""
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
    extractOthersText(documents) {
      // Look for a document that starts with 'Others:'
      const othersDoc = documents.find(doc => 
        typeof doc === 'string' && doc.startsWith('Others:')
      );
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
        } else if (typeof this.item.documents === 'string' && this.item.documents.includes('others:')) {
          // Alternative: if you're storing it as "Others: TEXTHERE" in the documents array
          const othersMatch = this.item.documents.match(/others:\s*(.+?)(?:,|$)/);
          if (othersMatch && othersMatch[1]) {
            othersText = othersMatch[1].trim();
          }
        }

        const possibleOthersTextSources = [
    item.otherDocuments,
    item.otherDocumentText,
    item.others,
    item.other_documents,

    // If documents is an array, look for an entry starting with "Others:"
    ...(Array.isArray(item.documents) 
      ? item.documents.filter(doc => typeof doc === 'string' && doc.startsWith('Others:')) 
      : [])
  ];
  othersText = possibleOthersTextSources.find(source => 
    source && source.trim() !== ''
  ) || '';
  if (typeof othersText === 'string' && othersText.startsWith('Others:')) {
    othersText = othersText.replace('Others:', '').trim();
    
  }
  if (othersText) {
      const othersElement = document.createElement("div");
      othersElement.textContent = `Others: ${othersText}`;
      othersElement.style.marginTop = "10px";
      printableElement.appendChild(othersElement);
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