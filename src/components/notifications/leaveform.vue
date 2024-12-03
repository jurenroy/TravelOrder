<template>
    <span>{{ pendingCount }}</span>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config';
export default {
  name: 'Notification',
  data() {
    return {
      accountId: localStorage.getItem('accountId'),
      acc: [], // This will be populated with account data
      formData: [],
      bus: {}, // Assuming this will be set in your logic
      sub: {}, // Assuming this will be set in your logic
    };
  },
  computed: {
    pendingCount() {
      return this.countPendingNotifications(this.formData, this.acc);
    },
  },
  methods: {
    fetchAccounts() {
      axios.get(`${API_BASE_URL}/get_accounts_json`)
        .then(response => {
          this.acc = response.data.find(result => result.account_id == this.accountId);
          this.fetchEmployees()
          this.fetchData()
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchData() {
        this.load = true
        axios.get(`${API_BASE_URL}/get_leave_json`)
          .then(response => {
            this.mawala = true;
            this.load = false
            this.sub = this.employees.find(emp => emp.name_id == this.acc.name_id)
            this.bus = this.employees.find(emp => emp.rd !== null)
            this.csvformdata = response.data
  
            this.formData = response.data
          
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      },
    fetchEmployees() {
        axios.get(`${API_BASE_URL}/get_employees_json`)
          .then(response => {
            this.employees = response.data;
          })
          .catch(error => {
            console.error('Error fetching employeess:', error);
          });
      },
    getDivisionGroup(division_id) {
        // Filter employees by division_id and map to the name_id
        return this.employees
          .filter(emp => emp.division_id === division_id)
          .map(emp => emp.name_id);
      },
    countPendingNotifications(formData, acc) {
      let pendingCount = 0;

      if (acc.name_id === 24) {
        pendingCount += formData.filter(form => {
        return [form.asof, form.tevl, form.tesl, form.ltavl, form.ltasl, form.bvl, form.vsl, form.dayswpay, form.dayswopay, form.others].every(val => val == null)
      }).length;
      } else if (acc.name_id === 2) {
          pendingCount += formData.filter(form => {
            return (form.asof || form.tevl || form.tesl || form.ltavl || form.ltasl || form.bvl || form.vsl || form.dayswpay || form.dayswopay || form.others) && form.certification == null;
          }).length;
      } 
      // else if (this.bus.name_id === this.sub.name_id) {
      //     if (acc.name_id !== 20) {
      //       pendingCount += formData.filter(form => {
      //         return (
      //           (this.getDivisionGroup(this.sub.division_id).includes(form.name_id) && !form.recommendation) || (form.recommendation && !form.appsig) || (this.getDivisionGroup(5).includes(form.name_id) && form.certification && !form.appsig)
      //         );
      //       }).length;
      //     } else {
      //       pendingCount += formData.filter(form => {
      //         return (
      //           ((form.recommendation && !form.appsig) || (this.getDivisionGroup(5).includes(form.name_id) && form.certification && !form.appsig) || ([15,21,45,48].includes(form.name_id) && form.certification && !form.appsig) ) && form.name_id !== acc.name_id
      //         );
      //       }).length;
      //     }
      // } 
      else if (acc.type_id === 3) {
          if (acc.name_id === 20) {
            pendingCount += formData.filter(form => {
              return (
                (form.recommendation && !form.appsig) || (this.getDivisionGroup(5).includes(form.name_id) && form.certification && !form.appsig) || ([15,21,45,48].includes(form.name_id) && form.certification && !form.appsig)
              );
            }).length;
          } else {
            pendingCount += formData.filter(form => {
              return (
                (this.getDivisionGroup(this.sub.division_id).includes(form.name_id) && !form.recommendation && form.certification) && form.name_id !== acc.name_id
              );
            }).length;
          }
      } else if (this.acc.type_id == 2) {
          pendingCount += formData.filter(form => {
            return form.name_id === this.acc.name_id && (!form.approval || !form.disapproved)
          }).length;
      }        
      return pendingCount;
    },
  },
  mounted() {
    this.fetchAccounts()
  },
};
</script>
