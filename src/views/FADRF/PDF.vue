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
            <p>
              Telefax Nos. (088) 856-2110; (088) 856-1331; Email:
              region10@mgb.gov.ph
            </p>
          </div>
          <img :src="bago" alt="bago" width="auto" height="140" />
        </div>

        <div class="form-title">REQUEST SLIP FORM</div>
        <div class="admin-section">
          (Administrative Section-Procurement/Property)
        </div>

        <div class="form-content">
          <table>
            <tr>
              <td><strong>Requestor: </strong>{{ $props.name }}</td>
              <td><strong>Signature:</strong></td>
            </tr>
            <tr>
              <td>
                <strong>Division: </strong
                >{{ getDivision($props.item.division_id) }}
              </td>
              <td><img :src="$props.signature" alt="Signature" /></td>
            </tr>
            <tr>
              <td>
                <strong>Date & Time Requested: </strong
                >{{ formatDate($props.item.date) }}
              </td>
            </tr>
            <tr>
              <td colspan="4"><strong>DOCUMENT(S) REQUESTED</strong></td>
            </tr>
            <tr style="border: solid black 2px">
              <td><strong>Document Name</strong></td>
              <td><strong>Date & Time Released</strong></td>
              <td><strong>Released by</strong></td>
            </tr>
            <tr v-for="doc in $props.documents" :key="doc">
              <td
                style="
                  flex-direction: row;
                  display: flex;
                  justify-content: left;
                  align-items: center;
                "
              >
                <img
                  :src="
                    $props.item.documents &&
                    ($props.item.documents.some((item) => item.name === doc) ||
                      ($props.item.documents.some(
                        (item) => !$props.documents.includes(item.name)
                      ) &&
                        doc == 'OTHERS'))
                      ? checked
                      : unchecked
                  "
                  alt="Logo"
                  width="auto"
                  height="20"
                />
                <!-- <img :src="$props.item.documents && $props.item.documents.some(item => !$props.documents.includes(item.name)) && doc == 'Others' ? checked : unchecked" alt="Logo" width="auto" height="20"/> -->
                <p style="margin-left: 10px">
                  {{ doc }}
                  {{
                    $props.item.documents &&
                    $props.item.documents.some(
                      (item) => !$props.documents.includes(item.name)
                    ) &&
                    doc == "OTHERS"
                      ? ": " +
                        $props.item.documents.find(
                          (item) => !$props.documents.includes(item.name)
                        ).name
                      : ""
                  }}
                </p>
              </td>
              <td>
                {{
                  $props.item.documents &&
                  (() => {
                    const docItem = $props.item.documents.find(
                      (item) => item.name === doc && item.remarks === "Released"
                    );

                    const othersItem = $props.item.documents.find(
                      (item) =>
                        !$props.documents.includes(item.name) &&
                        item.remarks === "Released"
                    );

                    if (docItem) {
                      return formatDate(docItem.releaseDate);
                    } else if (doc === "OTHERS" && othersItem) {
                      return formatDate(othersItem.releaseDate);
                    } else {
                      return "";
                    }
                  })()
                }}
              </td>
              <td colspan="2">
                {{
                  $props.item.documents &&
                  (() => {
                    const docItem = $props.item.documents.find(
                      (item) => item.name === doc && item.remarks === "Released"
                    );

                    const othersItem = $props.item.documents.find(
                      (item) =>
                        !$props.documents.includes(item.name) &&
                        item.remarks === "Released"
                    );

                    if (docItem) {
                      return releasedBy;
                    } else if (doc === "OTHERS" && othersItem) {
                      return releasedBy;
                    } else {
                      return "";
                    }
                  })()
                }}
              </td>
            </tr>
            <tr>
              <td colspan="3"><strong>RATING</strong></td>
            </tr>
            <tr>
              <td colspan="3">
                <div
                  v-for="(rating, index) in ratings"
                  :key="rating.value"
                  style="display: flex; align-items: center"
                >
                  <img
                    :src="
                      rating.value <= $props.item.rating == index + 1
                        ? starz
                        : star
                    "
                    alt="Star"
                    width="auto"
                    height="20"
                  />
                  <strong style="margin-left: 10px"
                    >{{ rating.value }} - {{ rating.label }}</strong
                  >
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
import bagz from "../../assets/bago.png";
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
        { value: 4, label: "Very Satisfied" },
        { value: 3, label: "Satisfied" },
        { value: 2, label: "Dissatisfied" },
        { value: 1, label: "Very Dissatisfied" },
      ],
      logo: logz, // Assign the imported logo to a data property
      bago: bagz, // Assign the imported logo to a data property
      unchecked: unchecke, // Assign the imported logo to a data property
      checked: checke, // Assign the imported logo to a data property
      star: sta, // Assign the imported logo to a data property
      starz: staz, // Assign the imported logo to a data property
      divisions: [
        { division_id: 1, division_name: "MMD" },
        { division_id: 2, division_name: "FAD" },
        { division_id: 3, division_name: "GD" },
        { division_id: 4, division_name: "MSESDD" },
        { division_id: 5, division_name: "ORD" },
      ],
      releasedBy: "Lariza Amor R. Lucero",
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
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      return `${month} ${day}, ${year}, ${hours}:${formattedMinutes} ${ampm}`;
    },
  },
};
</script>

<style src="./CSS/PDF.css" scoped></style>