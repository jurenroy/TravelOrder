<template>
    <div class="a4-container">
        <div class="a4-content">
            <div style="display: flex; flex-direction: row; justify-content: center;">
                <img :src="image1" alt="Background Image" class="pic1">
                <div style="text-align: center;">
                    <p style=" font-size: 11px;">Republic of the Philippines</p>
                    <p style=" font-size: 11px;">Department of Environment and Natural Resources</p>
                    <p style=" font-size: 13px; font-weight: bold;">MINES ABD GEOSCIENCE BUREAU REGIONAL OFFICE NO. X</p>
                    <p style=" font-size: 11px;">DENR-X Compound, Puntod, cagayan de Oro City</p>
                </div>
                <img :src="image2" alt="Bago Image" class="pic2">
            </div>
            <h3 style="text-align: center">APPLICATION FOR LEAVE</h3>
            <div>
                <div style="border: 2px solid black; padding: 5px;">
                    <div style="display: flex; flex-direction: row; font-size: 10px; justify-content: space-evenly; margin-top: -10px; margin-bottom: -15px;">
                            <p style="margin-left: -30px;">1. OFFICE/DEPARTMENT</p>
                            <p style="margin-left: 70px;">2. NAME</p>
                            <p style="margin-left: 70px;">(Last)</p>
                            <p style="margin-left: 120px;">(First)</p>
                            <p style="margin-left: 100px;">(Middle)</p>
                    </div>
                    <div style="display: flex; flex-direction: row; align-items: center;  margin-bottom: -10px;">
                        <p style="font-size: 10px;">Mines and Geosciences Bereau Regional Office No. X</p>
                        <p style="margin-left: auto; font-size: 12px; font-weight: bold">{{ lastname }}</p>
                        <p style="margin-left: auto; font-size: 12px; font-weight: bold">{{ firstname }}</p>
                        <p style="margin-left: auto; margin-right: 5%; font-size: 12px; font-weight: bold">{{ middleinit }}</p>
                    </div>
                </div>
                <div style="display: flex; flex-direction: row; border: 2px solid black; margin-top: -2px; justify-content: space-between; font-size: 10px; padding: 1px">
                    <p style="margin-left: 5px">3. DATE OF FILING <span>{{ datetoday }}</span></p>
                    <p>4. POSITION <span>{{position}}</span></p>
                    <p style="margin-right: 5px">5. SALARY <span>{{salary}}</span></p>
                </div>
            </div>
            <div style="border: 2px solid black;margin-top: 2px;text-align: center; font-size: 12px; font-weight: bold">
                <p style="margin: 0.5px;">6. DETAILS OF APPLICATION</p>
            </div>
            <div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); ">
                    <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;">
                        <p style="margin-left: 10px">6.A TYPE OF LEAVE TO BE AVAILED OF</p>
                        <div style="margin-left: 20px;">
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Vacation Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Mandatory/Forced Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Sick Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Maternity Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Paternity Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Special Privilege Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Solo Parent Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Study Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>10-Day VAWC Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Rehabilitation Privilege</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Special Leave Benefits for Women</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Special Emergency(Calamity) Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Adoption Leave</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Others:</p>
                            </div>
                            <input style="height: 10px; width: 350px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                        </div>
                        
                    </div>
                    <div style="border: 2px solid black;margin-top: 2px;font-size: 10px; margin-left: -2px;">
                        <p style="margin-left: 10px">6.B TYPE OF LEAVE TO BE AVAILED OF</p>
                        <div style="margin-left: 20px;">
                            <p style="margin-left: 5px; margin-top: -5px;font-style: italic;">In case of Vacation/Special Privilege Leave:</p>
                            <div style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <input type="checkbox"></input>
                                    <p>Within the Philippines</p>
                                </div>
                                <div>
                                <input style="height: 10px; width: 100px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                                </div>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <input type="checkbox"></input>
                                    <p>Abroad(Specify)</p>
                                </div>
                                <div>
                                    <input style="height: 10px; width: 100px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                                </div>
                            </div>
                            <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Sick Leave:</p>
                            <div style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <input type="checkbox"></input>
                                    <p>In Hospital (Specify Illness)</p>
                                </div>
                                <div>
                                    <input style="height: 10px; width: 100px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                                </div>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <input type="checkbox"></input>
                                    <p>Out Patient (Specify Illness)</p>
                                </div>
                                <div>
                                    <input style="height: 10px; width: 100px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                                </div>
                            </div>
                            <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Special Leave Benefits for Women:</p>
                            <div style="display: flex; flex-direction: row; justify-content: space-between">
                                <p style="margin-left: 5px; margin-top: -0px">(Specify Illness)</p>
                                <input style="height: 10px; width: 150px; margin-top: -3px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                            </div>
                            <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Study Leave:</p>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Completion of Master's Degree</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>BAR/Board Examination Review Other</p>
                            </div>
                            <div style="display: flex; flex-direction: row; justify-content: space-between">
                                <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">Other purpose:</p>
                                <input style="height: 10px; width: 150px; margin-top: -3px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -5px">
                                <input type="checkbox"></input>
                                <p>Monetization of Leave Credits</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Terminal Leave</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr);">
                    <div style="border: 2px solid black;margin-top: -2px;font-size: 10px;">
                        <p style="margin-left: 10px; margin-bottom: 5px">6.C Number OF WORKING DAYS APPLIED FOR</p>
                        <div style="margin-left: 20px;">
                            <input style="height: 10px; width: 350px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                            <p style=" margin-bottom: 5px">INCLUSIVE DATES</p>
                            <input style="height: 10px; width: 350px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                        </div>
                    </div>
                    <div style="border: 2px solid black;margin-top: -2px;font-size: 10px;margin-left: -2px;">
                        <p style="margin-left: 10px;">6.D COMMUTATION</p>
                        <div style="margin-left: 20px;">
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Not Requested</p>
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <input type="checkbox"></input>
                                <p>Requested</p>
                            </div>
                        </div>
                        <p style="text-align: center;">(Signature of Applicant)</p>
                    </div>
                </div>
            </div>
            <div style="border: 2px solid black;margin-top: 2px;text-align: center; font-size: 12px; font-weight: bold">
                <p style="margin: 0.5px;">7. DETAILS OF ACTION ON APPLICATION</p>
            </div>
            <div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); font-size: 10px;">
                    <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;">
                        <p style="margin-left: 10px;">7.A CERTIFICATION OF LEAVE CREDITS</p>
                        <div style="display: flex;flex-direction: row; justify-content: center; margin-left: 90px">
                            <p>As of</p>
                            <input style="height: 10px; width: 230px; border: none; border-bottom: 1.5px solid black;outline: none; font-size: 10px; margin-top: 7px; margin-left: 3px">
                        </div>
                        <div>
                            <div class="grid-container">
                            <div class="grid-item"></div>
                            <div class="grid-item">Vacation Leave</div>
                            <div class="grid-item">Sick Leave</div>
                            <div class="grid-item">Total Earned</div>
                            <div class="grid-item"></div>
                            <div class="grid-item"></div>
                            <div class="grid-item">Less this Application</div>
                            <div class="grid-item"></div>
                            <div class="grid-item"></div>
                            <div class="grid-item">Balance</div>
                            <div class="grid-item"></div>
                            <div class="grid-item"></div>
                            </div>
                        </div>
                        <p style="text-align: center; margin-bottom: -15px;z-index: 9;">{{ secch }}</p>
                        <input disabled style="height: 10px; width: 350px; margin-top: 8px;z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px">
                        <p style="text-align: center">{{ secchpos }}</p>
                    </div>
                    <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;margin-left: -2px;">
                        <p style="margin-left: 10px;">7.B RECOMMENDATION</p>
                        <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
                            <input type="checkbox"></input>
                            <p>For approval</p>
                        </div>
                        <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
                            <input type="checkbox"></input>
                            <p>For disapproval due to:</p>
                        </div>
                        <textarea @keydown.enter.prevent v-model="text" id="myTextarea" :rows="rows" style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 350px; margin-left: 20px; font-size: 10px; text-decoration: underline;"></textarea>
                        <p style="text-align: center;margin-bottom: -10px;z-index: 9;">{{ reco }}</p>
                        <input disabled style="height: 10px; width: 350px; z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px; color: transparent;">
                        <p style="text-align: center">{{ recopost }}</p>
                    </div>
                </div> 
            </div>
            <div style="border: 2px solid black;margin-top: -2px; font-size: 10px;">
                <div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr);">
                        <div>
                            <p style="margin-left: 10px;">7.C APPROVED FOR</p>
                            <div style="margin-left: 20px;">
                                <div style="display: flex; flex-direction: row; margin-top: -5px;">
                                    <input style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                                    <p style="font-size: 10px;">days with pay</p>
                                </div>
                                <div  style="display: flex; flex-direction: row; margin-top: -5px;">
                                    <input style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                                    <p>days without pay</p>
                                </div>
                                <div  style="display: flex; flex-direction: row; margin-top: -5px;">
                                    <input style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                                    <p>others (Specify)</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p style="margin-left: 10px;">7.D DISAPPROVED DUE TO:</p>
                            <textarea @keydown.enter.prevent v-model="text2" id="myTextarea" :rows="rows2" style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 350px; margin-left: 20px; font-size: 10px; text-decoration: underline;"></textarea>
                        </div>
                    </div>
                </div>
                <div>
                    <p style="text-align: center" >{{ rd }}</p>
                    <p style="text-align: center">{{ rdpos }}</p>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import image1 from '../assets/background_image.png'
  import image2 from '../assets/bago.png'

  export default {
    data() {
      return {
        image1: image1,
        image2: image2,
        lastname: 'ABRAGAN',
        firstname: 'JUREN ROY',
        middleinit: 'R.',
        datetoday: '2024-05-30',
        position: 'Administrative Assistant II',
        salary: '30,000',
        secch: 'JOANNE ROSE O. ALVAREZ',
        secchpos: 'Administrative Officer V (HRMO)',
        reco: 'LIBERTY B. DAITIA',
        recopost: 'Chief FAD',
        rd: 'RODANTE B. FELINA',
        rdpos: 'OIC, REGIONAL DIRECTOR',
        text: '',
        rows: 1,
        text2: '',
        rows2: 1,
      };
    },
    watch: {
      text() {
        this.updateRows();
      },
      text2() {
        this.updateRows2();
      }
    },
    methods: {
      updateRows() {
        this.rows = this.text.length / 63 + 1
      },
      updateRows2() {
        this.rows2 = this.text2.length / 63 +1 
      },
    }
  };
  </script>
  
<style>
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
.pic1{
    height: 80px;
    width: auto;
    margin: auto;
}
.pic2{
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
  text-align: center;
}

</style>