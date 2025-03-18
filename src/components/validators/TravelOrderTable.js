// TravelOrderTable.js

const TravelOrderTable = {
    isInitialNull(item) {
      return item.initial === null;
    },
    initialForDC(item) {
      return [15, 21, 45, 48, 3].includes(item.name_id);
    },
    initialForSC(item) {
      return [2, 39, 3, 8, 42, 34, 29, 52, 51, 36, 5, 47, 17].includes(item.name_id) && item.intervals === 1;
    },
    isInitialized(item) {
      return (
        (![39, 2, 3, 8, 42, 34, 29, 36, 11, 5, 47, 48, 15, 45, 21, 13, 10, 37, 62, 53, 4, 56, 58, 55, 60, 59, 20, 77, 52, 51, 66, 17, 72, 73, 54, 80].includes(item.name_id) && item.initial !== null) ||
        ([15, 21, 45, 48, 3].includes(item.name_id) && item.aor === 1 && item.intervals === 1) ||
        ([39, 2, 8, 42, 34, 29, 36, 11, 5, 47, 52, 51, 66, 17, 72, 73, 54, 80].includes(item.name_id) && item.intervals === 1)
      );
    },
    initializedByRD(item) {
      return [15, 21, 45, 48, 3].includes(item.name_id) && item.aor === 1 && item.intervals === 1;
    },
    initializedByDC(item) {
      return [2, 39, 8, 42, 34, 29, 52, 51, 36, 5, 47, 17].includes(item.name_id) && item.intervals === 1;
    },
    isNoteNull(item) {
      return item.note === null;
    },
    isNoted(item) {
      return item.note !== null;
    },
    forRecommendationNoneORDNoneChief(item) {
      return item.signature1 === null && item.note !== null && ![15, 20, 21, 45, 48, 3, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59, 77].includes(item.name_id);
    },
    forRecommendationORDandChiefwithIntervals(item) {
      return item.signature1 === null && item.note !== null && [15, 21, 45, 48, 3, 56, 58, 55, 59, 60, 13, 10, 37, 62, 53, 77, 4].includes(item.name_id) && item.intervals === 1;
    },
    forRecommendationCAOnotIncluded(item) {
      return !([15].includes(item.name_id) && item.aor === 0 && item.intervals === 1);
    },
    forRecommendationbyRED(item) {
      return [15, 21, 45, 48, 3].includes(item.name_id) && item.aor === 1 && item.intervals === 1;
    },
    forRecommendationToSCbyCAO(item) {
      return [2, 39, 8, 42, 34, 29, 52, 51, 36, 5, 47].includes(item.name_id) && item.intervals === 1;
    },
    recommendedNoneORDNoneChief(item) {
      return item.note !== null && item.signature1 !== null && ![15, 20, 21, 45, 48,3, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59, 77].includes(item.name_id);
    },
    recommendedORDandChiefwithIntervals(item) {
      return item.signature1 !== null && item.note !== null && ([15, 21, 45, 48,3].includes(item.name_id) || item.division_id === 5) && item.intervals === 1;
    },
    recommendedbyRED(item) {
      return [15, 21, 45, 48,3].includes(item.name_id) && item.aor === 1 && item.intervals === 1;
    },
    recommendedbyCAO(item) {
      return ([2, 39, 3, 8, 42, 34, 29, 52, 51, 36, 5, 47].includes(item.name_id) || item.division_id === 5) && item.intervals === 1;
    },
    forApproval(item) {
      return item.signature2 === null && item.signature1 !== null;
    },
    forApprovalORDandChief(item) {
      return [15, 20, 21, 45, 48, 3, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59, 77].includes(item.name_id) && item.signature2 === null && item.note !== null && item.intervals === 0;
    },
    forApprovalRDinterval(item) {
      return item.name_id === 20 && item.intervals === 1;
    },
    forApprovalCAO(item) {
        return [15].includes(item.name_id) && item.aor === 0 && item.intervals === 1;
    },
    forApprovalbyRED(item) {
      return item.name_id === 20 && (item.aor !== 1 || item.intervals !== 1);
    },
    forApprovalbyBD(item) {
      return [15, 20, 21, 45, 48].includes(item.name_id) && item.aor === 1 && item.intervals === 1;
    },
    approved(item) {
      return item.signature2 !== null && item.signature1 !== null && item.note !== null;
    },
    approvedORD(item) {
      return [15, 20, 21, 45, 48, 13, 10, 37, 62, 53, 75, 56, 58, 55, 60, 59, 77].includes(item.name_id) && item.signature2 !== null;
    },
  };


export default TravelOrderTable


//   <script>
// import axios from 'axios';
// import pdf from './PDF.vue';
// import editform from './EditForm.vue';
// import form from './Form.vue';
// import otpz from '../../components/otp/OTP.vue';
// import NoteModal from '@/components/note/Note.vue';
// import { API_BASE_URL } from '../../config';
// import { useAuthStore } from '../../store/auth';
// import { ItemIndicators } from './itemIndicators'; // Import the utility module

// export default {
//   provide() {
//     return {
//       close: this.close,
//     };
//   },
//   components: {
//     pdf,
//     otpz,
//     editform,
//     form,
//     NoteModal
//   },
//   mounted() {
//     this.fetchEmployees();
//     this.fetchNames();
//     this.fetchData();
//   },
//   beforeDestroy() {
//     clearInterval(this.fetchInterval); // Clear the interval when the component is destroyed
//   },
//   data() {
//     // ... your existing data properties
//   },
//   methods: {
//     // Replace your existing methods with calls to ItemIndicators
//     isInitialNull(item) {
//       return ItemIndicators.isInitialNull(item);
//     },
//     isInitialized(item) {
//       return ItemIndicators.isInitialized(item);
//     },
//     initializedByRD(item) {
//       return ItemIndicators.initializedByRD(item);
//     },
//     initializedByDC(item) {
//       return ItemIndicators.initializedByDC(item);
//     },
//     isNoteNull(item) {
//       return ItemIndicators.isNoteNull(item);
//     },
//     isNoted(item) {
//       return ItemIndicators.isNoted(item);
//     },
//     forRecommendationNoneORDNoneChief(item) {
//       return ItemIndicators.forRecommendationNoneORDNoneChief(item);
//     },
//     forRecommendationORDandChiefwithIntervals(item) {
//       return ItemIndicators.forRecommendationORDandChiefwithIntervals(item);
//     },
//     forRecommendationCAOnotIncluded(item) {
//       return ItemIndicators.forRecommendationCAOnotIncluded(item);
//     },
//     forRecommendationbyRED(item) {
//       return ItemIndicators.forRecommendationbyRED(item);
//     },
//     forRecommendationToSCbyCAO(item) {
//       return ItemIndicators.forRecommendationToSCbyCAO(item);
//     },
//     recommendedNoneORDNoneChief(item) {
//       return ItemIndicators.recommendedNoneORDNoneChief(item);
//     },
//     recommendedORDandChiefwithIntervals(item) {
//       return ItemIndicators.recommendedORDandChiefwithIntervals(item);
//     },
//     forApproval(item) {
//       return ItemIndicators.forApproval(item);
//     },
//     forApprovalORDandChief(item) {
//       return ItemIndicators.forApprovalORDandChief(item);
//     },
//     forApprovalRDinterval(item) {
//       return ItemIndicators.forApprovalRDinterval(item);
//     },
//     forApprovalCAO(item) {
//       return ItemIndicators.forApprovalCAO(item);
//     },
//     forApprovalbyRED(item) {
//       return ItemIndicators.forApprovalbyRED(item);
//     },
//     forApprovalbyBD(item) {
//       return ItemIndicators.forApprovalbyBD(item);
//     },
//     approved(item) {
//       return ItemIndicators.approved(item);
//     },
//     approvedORD(item) {
//       return ItemIndicators.approvedORD(item);
//     },
//     // ... your existing methods
//   },
//   computed: {
//     // ... your existing computed properties
//   },
//   watch: {
//     selectedStatus: 'fetchData',
//     selectedMonth: 'fetchData',
//     selectedYear: 'fetchData'
//   }
// }
// </script>