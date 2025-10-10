<template>
  <div class="calendar-container">
    <div class="filters">
    <!-- Division Dropdown -->
    <select v-model="selectedDivision" @change="onDivisionChange">
      <option value="all">All Divisions</option>
      <option v-for="division in divisions" :key="division.division_id" :value="division.division_id">
        {{ division.division_name }}
      </option>
    </select>
  </div>
    <div class="calendar-header">
      <button @click="prevMonth">◀</button>
      <h2>{{ monthName }} {{ currentYear }}</h2>
      <button @click="nextMonth">▶</button>
    </div>

    <div class="calendar-grid">
      <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>

      <div
        v-for="day in calendarDays"
        :key="day.date"
        class="day-cell"
        :class="{ today: isToday(day.date) }"
      >
        <div class="date-number">{{ day.day }}</div>

        <div
          v-for="event in getEventsForDate(day.date)"
          :key="event.id"
          class="event-bar"
          :style="{ backgroundColor: getColorForName(event.name_id), gridColumn: event.gridColumn }"
          :title="event.tooltip"
        >
          <!-- Display the name and travel type on the event bar -->
          <span class="event-info">{{ event.title }}-{{ getPersonName(event.name_id) }} </span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import axios from 'axios'
import { API_BASE_URL } from '@/config';

dayjs.extend(isBetween)

const currentDate = ref(dayjs())
const events = ref([])
const namesMap = ref({}) // This will store the names by name_id

const colorMap = ref({})

// Array of divisions
const divisions = ref([
  { division_id: 1, division_name: 'MMD' },
  { division_id: 2, division_name: 'FAD' },
  { division_id: 3, division_name: 'GD' },
  { division_id: 4, division_name: 'MSESDD' },
  { division_id: 5, division_name: 'ORD' }
])

// Selected division
const selectedDivision = ref('all')

// Watch for division change
const onDivisionChange = () => {
  console.log('Selected Division:', selectedDivision.value)
  // You can trigger API fetch or other logic here
}

function getColorForName(name_id) {
  if (!colorMap.value[name_id]) {
    const hue = (name_id * 37) % 360 // unique hue per person
    colorMap.value[name_id] = `hsl(${hue}, 70%, 60%)`
  }
  return colorMap.value[name_id]
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed(() => {
  const start = currentDate.value.startOf('month').startOf('week')
  const end = currentDate.value.endOf('month').endOf('week')
  const days = []
  let day = start
  while (day.isBefore(end)) {
    days.push({ date: day.format('YYYY-MM-DD'), day: day.date() })
    day = day.add(1, 'day')
  }
  return days
})

const currentYear = computed(() => currentDate.value.year())
const monthName = computed(() => currentDate.value.format('MMMM'))

const isToday = (date) => dayjs().isSame(date, 'day')

// Calculate event grid position (spanning across multiple days)
const calculateGridColumn = (startDate, endDate, dayDate) => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const target = dayjs(dayDate)
  const diff = target.diff(start, 'day')

  if (target.isBetween(start, end, null, '[]')) {
    const startCol = start.day() + 1 // Sunday (0) to Saturday (6), so +1 for 1 to 7
    return startCol + diff
  }
  return null
}

// Filter events per date
const getEventsForDate = (date) => {
  return events.value.map((e) => {
    const gridColumn = calculateGridColumn(e.start, e.end, date)
    return { ...e, gridColumn }
  }).filter(event => event.gridColumn)
}

// Navigation
const prevMonth = () => (currentDate.value = currentDate.value.subtract(1, 'month'))
const nextMonth = () => (currentDate.value = currentDate.value.add(1, 'month'))



// Fetch events from API
const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/calendar/events`, {
      params: {
        month: currentDate.value.month() + 1,
        year: currentDate.value.year(),
        division: selectedDivision.value,  // Use selected division or 'all' if none selected
        name: 'all',
      },
    })
    console.log(response.data.events)

    events.value = response.data.events.map((item, index) => {
      let tooltip = ''
      let travelType = ''
      
      if (item.record_type === 'travel') {
        tooltip = `${item.purpose}\nDestination: ${item.destination}`
        travelType = 'Travel ' // Assuming `travel_type` is available
      } else if (item.record_type === 'leave') {
        tooltip = `${item.detail || ''}\nDays: ${item.days}`
        travelType = 'Leave' // Special case for leave
      }

      return {
        id: index,
        title: item.title,
        name_id: item.name_id,
        travelType, // Add the travel type
        start: item.start,
        end: item.end,
        tooltip,
      }
    })

    console.log(events.value)
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }
}

// Fetch names dynamically when needed
const getPersonName = (name_id) => {
  // Check if the name is already fetched
  const name = namesMap.value.find(name => name_id === name.name_id);
  
  if (name) {
    return `${name.first_name} ${name.middle_init} ${name.last_name}`;
  }

  // If not found, fetch the name from the API
  fetchName().then(() => {
    const newName = namesMap.value.find(name => name_id === name.name_id);
    if (newName) {
      return `${newName.first_name} ${newName.middle_init} ${newName.last_name}`;
    }
    return 'Unknown Person';
  }).catch(() => {
    return 'Unknown Person';
  });

  return 'Unknown Person'; // Default value if name is not found yet
}

// Fetch names from the server and populate namesMap
const fetchName = () => {
  return axios.get(`${API_BASE_URL}/get_names_json`)
    .then((response) => {
      const nameData = response.data;
      if (nameData) {
        namesMap.value = nameData; // Update namesMap with fetched data
      }
    })
    .catch((error) => {
      console.error('Failed to fetch name:', error);
    });
}

// Auto-fetch
onMounted(() => {
  fetchEvents() // Fetch events when the component is mounted
  fetchName()
})

watch(currentDate, fetchEvents)

// Watch for division change and trigger fetchEvents
watch(selectedDivision, fetchEvents)
</script>


<style scoped>
.calendar-container {
  max-width: 900px;
  margin: 2rem auto;
  font-family: 'Segoe UI', sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0px;
  grid-template-rows: auto;
}

.day-name {
  text-align: center;
  font-weight: bold;
  background: #f5f5f5;
  padding: 8px 0;
}

.day-cell {
  min-height: 100px;
  border: 1px solid #eee;
  padding: 4px;
  position: relative;
}

.today {
  background-color: #e3f2fd;
  border: 2px solid #2196f3;
}

.date-number {
  font-size: 0.9rem;
  text-align: right;
  margin-bottom: 4px;
  color: #333;
}

/* Horizontal bar for each event */
.event-bar {
  height: 25px;
  border-radius: 4px;
  margin-bottom: 3px;
  cursor: pointer;
  transition: transform 0.2s;
  grid-column: span 1;
}

.event-bar:hover {
  transform: scale(1.05);
}

/* Styling for the event info (person and travel type) */
.event-info {
  font-size: 10px;
  color: white;
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
