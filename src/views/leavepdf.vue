<template>
    <div style="display: flex; flex-direction: row;">
        <img v-if="leaveshowhome" @click="closeaddleave"
            style="cursor: pointer; height: 30px; width: 30px; margin-top: -6px; margin-right: 5px;"
            src="../assets/dashboard.png" title="Back to Dashboard">
        <label v-if="leaveshowhome" @click="closeaddleave" style="cursor: pointer;">Back to Dashboard</label>
    </div>

    <div class="a4-container">
        <div class="a4-content">
            <div style="display: flex; flex-direction: row; justify-content: center;">
                <img :src="image1" alt="Background Image" class="pic1">
                <div style="text-align: center;">
                    <p style=" font-size: 11px;">Republic of the Philippines</p>
                    <p style=" font-size: 11px;">Department of Environment and Natural Resources</p>
                    <p style=" font-size: 13px; font-weight: bold;">MINES ABD GEOSCIENCE BUREAU REGIONAL OFFICE NO. X
                    </p>
                    <p style=" font-size: 11px;">DENR-X Compound, Puntod, cagayan de Oro City</p>
                </div>
                <img :src="image2" alt="Bago Image" class="pic2">
            </div>
            <h3 style="text-align: center">APPLICATION FOR LEAVE </h3>
            <div>
                <div style="border: 2px solid black; padding: 5px;">
                    <div
                        style="display: flex; flex-direction: row; font-size: 10px; justify-content: space-evenly; margin-top: -10px; margin-bottom: -15px;">
                        <p style="margin-left: -30px;">1. OFFICE/DEPARTMENT</p>
                        <p style="margin-left: 70px;">2. NAME</p>
                        <p style="margin-left: 70px;">(Last)</p>
                        <p style="margin-left: 120px;">(First)</p>
                        <p style="margin-left: 100px;">(Middle)</p>
                    </div>
                    <div style="display: flex; flex-direction: row; align-items: center;  margin-bottom: -10px;">
                        <p style="font-size: 10px;">Mines and Geosciences Bereau Regional Office No. X</p>
                        <text style="margin-left: auto; font-size: 12px; font-weight: bold">{{ name.last_name }}</text>
                        <text style="margin-left: auto; font-size: 12px; font-weight: bold">{{ name.first_name }}</text>
                        <text style="margin-left: auto; margin-right: 5%; font-size: 12px; font-weight: bold">{{
            name.middle_init
        }}</text>
                    </div>
                </div>
                <div
                    style="display: flex; flex-direction: row; border: 2px solid black; margin-top: -2px; justify-content: space-between; font-size: 10px; padding: 1px">
                    <p style="margin-left: 5px">3. DATE OF FILING:
                        <label style="border: none; border-bottom: 1px solid black;">{{ datetoday }}</label>
                    </p>

                    <p>4. POSITION: <label style="border: none; border-bottom: 1px solid black;">{{ position }}</label>
                    </p>

                    <p style="margin-right: 5px">5. SALARY:
                        <input
                            style="height: 10px; width: 100px; outline: none; border: none; border-bottom: 1px solid black; font-size: 10px; "
                            v-model="salary" @input="formatCurrency" />
                    </p>
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

                            <!-- vacation -->
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[0]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Vacation Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[1]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Mandatory/Forced Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[2]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Sick Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[3]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Maternity Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[4]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Paternity Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[5]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Special Privilege Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[6]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Solo Parent Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[7]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Study Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[8]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>10-Day VAWC Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[9]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Rehabilitation Privilege</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[10]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Special Leave Benefits for Women</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[11]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Special Emergency(Calamity) Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[12]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Adoption Leave</p>f
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <p style="margin-left: 15px; margin-top: 15px;font-style: italic;">Others:</p>
                            </div>

                            <input :disabled="selectedLeavetype != ''"
                                style="height: 10px; width: 300px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-left: 10px; margin-right: 33px; font-size: 10px"
                                v-model="LeaveType">
                        </div>

                    </div>
                    <div style="border: 2px solid black;margin-top: 2px;font-size: 10px; margin-left: -2px;">
                        <p style="margin-left: 10px">6.B TYPE OF LEAVE TO BE AVAILED OF</p>
                        <div style="margin-left: 20px;">
                            <p style="margin-left: 5px; margin-top: -5px;font-style: italic;">In case of
                                Vacation/Special Privilege Leave:</p>
                            <div
                                style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <label class="containerlist"
                                        :class="{ 'not': ![0, 5].some(value => selectedLeavetype.includes(value)) }">
                                        <input type="checkbox"
                                            :disabled="![0, 5].some(value => selectedLeavetype.includes(value))"
                                            v-model="vacationleavedetails" :value="vacationdetails[0]">
                                        <svg viewBox="0 0 64 64" height="2em" width="2em">
                                            <path
                                                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                                pathLength="575.0541381835938" class="path"></path>
                                        </svg>
                                    </label>
                                    <p>Within the Philippines</p>
                                </div>

                                <div>
                                    <input
                                        style="height: 10px; width: 100px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                        :disabled="![0, 5].some(value => selectedLeavetype.includes(value)) || !vacationleavedetails.includes(1)"
                                        v-model="vacation1"
                                        :class="{ 'not': ![0, 5].some(value => selectedLeavetype.includes(value)) || !vacationleavedetails.includes(1) }">
                                </div>
                            </div>
                            <div
                                style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <label class="containerlist"
                                        :class="{ 'not': ![0, 5].some(value => selectedLeavetype.includes(value)) }">
                                        <input type="checkbox"
                                            :disabled="![0, 5].some(value => selectedLeavetype.includes(value))"
                                            v-model="vacationleavedetails" :value="vacationdetails[1]">
                                        <svg viewBox="0 0 64 64" height="2em" width="2em">
                                            <path
                                                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                                pathLength="575.0541381835938" class="path"></path>
                                        </svg>
                                    </label>
                                    <p>Abroad(Specify)</p>
                                </div>

                                <div>
                                    <input
                                        style="height: 10px; width: 100px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                        :disabled="![0, 5].some(value => selectedLeavetype.includes(value)) || !vacationleavedetails.includes(2)"
                                        v-model="vacation2"
                                        :class="{ 'not': ![0, 5].some(value => selectedLeavetype.includes(value)) || !vacationleavedetails.includes(2) }">
                                </div>
                            </div>
                            <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Sick Leave:</p>
                            <div
                                style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <label class="containerlist" :class="{ 'not': !selectedLeavetype.includes(2) }">
                                        <input type="checkbox" :disabled="!selectedLeavetype.includes(2)"
                                            v-model="sickleavedetails" :value="sickdetails[0]">
                                        <svg viewBox="0 0 64 64" height="2em" width="2em">
                                            <path
                                                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                                pathLength="575.0541381835938" class="path"></path>
                                        </svg>
                                    </label>
                                    <p>In Hospital (Specify Illness)</p>
                                </div>

                                <div>
                                    <input
                                        style="height: 10px; width: 100px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                        :disabled="!selectedLeavetype.includes(2) || !sickleavedetails.includes(1)"
                                        v-model="sick1"
                                        :class="{ 'not': !selectedLeavetype.includes(2) || !sickleavedetails.includes(1) }">
                                </div>
                            </div>
                            <div
                                style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <label class="containerlist" :class="{ 'not': !selectedLeavetype.includes(2) }">
                                        <input type="checkbox" :disabled="!selectedLeavetype.includes(2)"
                                            v-model="sickleavedetails" :value="sickdetails[1]">
                                        <svg viewBox="0 0 64 64" height="2em" width="2em">
                                            <path
                                                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                                pathLength="575.0541381835938" class="path"></path>
                                        </svg>
                                    </label>
                                    <p>Out Patient (Specify Illness)</p>
                                </div>

                                <div>
                                    <input
                                        style="height: 10px; width: 100px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                        :disabled="!selectedLeavetype.includes(2) || !sickleavedetails.includes(2)"
                                        v-model="sick2"
                                        :class="{ 'not': !selectedLeavetype.includes(2) || !sickleavedetails.includes(2) }">
                                </div>
                            </div>

                            <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Special Leave
                                Benefits for Women:</p>
                            <div style="display: flex; flex-direction: row; justify-content: space-between">
                                <p style="margin-left: 5px; margin-top: -0px">(Specify Illness)</p>
                                <input
                                    style="height: 10px; width: 150px; margin-top: -3px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                    :disabled="!selectedLeavetype.includes(10)" v-model="leaveforwoman"
                                    :class="{ 'not': !selectedLeavetype.includes(10) }">
                            </div>

                            <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Study Leave:
                            </p>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist" :class="{ 'not': !selectedLeavetype.includes(7) }">
                                    <input type="checkbox" :disabled="!selectedLeavetype.includes(7)"
                                        v-model="studyleavedetails" :value="studydetails[0]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Completion of Master's Degree</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist" :class="{ 'not': !selectedLeavetype.includes(7) }">
                                    <input type="checkbox" :disabled="!selectedLeavetype.includes(7)"
                                        v-model="studyleavedetails" :value="studydetails[1]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>BAR/Board Examination Review Other</p>
                            </div>

                            <div style="display: flex; flex-direction: row; justify-content: space-between">
                                <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">Other purpose:</p>

                                <input
                                    style="height: 10px; width: 150px; margin-top: -3px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                    v-model="otherPurpose" :disabled="!selectedLeavetype.includes(7)"
                                    :class="{ 'not': !selectedLeavetype.includes(7) }">
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -5px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="monetization" :value="terminalleave[0]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Monetization of Leave Credits</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="monetization" :value="terminalleave[1]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Terminal Leave</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr);">
                    <div style="border: 2px solid black;margin-top: -2px;font-size: 10px;">
                        <p style="margin-left: 10px; margin-bottom: 5px">6.C Number OF WORKING DAYS APPLIED FOR</p>
                        <div style="margin-left: 20px;">
                            <!-- pag naay value pero isa ra kabuok -->
                            <p style="margin-top: 25px;"></p>
                            <input v-if="!isSingleDate" v-model="weekdaysCountWithSuffix" readonly
                                style="position: relative; left:24px;top: -10px; margin-bottom: -20px; font-size: 10px; border:none; outline: none ">
                            <p
                                style="height: 10px; width: 300px; border: none; border-bottom: 1.5px solid black; outline: none; margin-right: 10px; font-size: 10px; position: relative; left:10px; margin-top: -15px;">
                            </p>


                            <p style=" margin-bottom: 5px">INCLUSIVE DATES</p>

                            <p v-if="!isSingleDate && startDate && !endDate && selectedDate"
                                style="margin-right: 10px; font-size: 10px; margin-bottom: -20px; position: relative; left:10px;">
                                <input v-model="formattedDateRange"
                                    style="border:none; background-color: transparent; font-size: 10px; margin-bottom: -20px; position: relative; left: 10px " />
                            </p>


                            <!-- pag naa nay value -->
                            <p v-if="!isSingleDate && startDate && !endDate && selectedDate"
                                style="height: 10px; width: 300px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px; position: relative; left:10px">
                            </p>

                            <p v-if="!selectedDate"
                                style="height: 10px; width: 300px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px; position: relative; left:10px;">
                            </p>

                            <p v-if="!isSingleDate && startDate && endDate"
                                style="margin-right: 10px; font-size: 10px; margin-bottom: -20px; position: relative; left:10px;  ">
                                <input v-model="formattedDateRange"
                                    style="border:none; background-color: transparent; font-size: 10px; margin-bottom: -20px; position: relative; left: 10px " />
                            </p>

                            <p v-if="!isSingleDate && startDate && endDate"
                                style="height: 10px; width: 300px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px; position: relative; left: 10px">
                            </p>


                            <div>
                                <input type="date" id="date-input" v-model="selectedDate" @change="handleDateChange"
                                    style="width: 16px; height: 20px; outline: none; border: none; position: relative; top: -32px; left:290px;" />
                            </div>
                        </div>
                    </div>
                    <div style="border: 2px solid black;margin-top: -2px;font-size: 10px;margin-left: -2px;">
                        <p style="margin-left: 10px;">6.D COMMUTATION</p>
                        <div style="margin-left: 20px;">
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="commutationLeavetype" :value="commutationtype[0]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Not Requested</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="commutationLeavetype" :value="commutationtype[1]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Requested</p>
                            </div>

                        </div>
                        <input
                            style="border:1px solid black; border:none; outline:none; border-bottom:1.5px solid black; width:330px; position: relative; left:35px;" />
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
                            <input
                                style="height: 10px; width: 230px; border: none; border-bottom: 1.5px solid black;outline: none; font-size: 10px; margin-top: 7px; margin-left: 3px"
                                v-model="leavecredits" disabled>
                        </div>
                        <div>   
                            <div class="grid-container">
                                <div class="grid-item"></div>
                                <div class="grid-item">Vacation Leave</div>
                                <div class="grid-item">Sick Leave</div>
                                <div class="grid-item">Total Earned</div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits" v-model="totalvacation" disabled>
                                </div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits" disabled v-model="totalsick">
                                </div>
                                <div class="grid-item">Less this Application</div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits" disabled v-model="lessvacation">
                                </div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits" disabled v-model="lesssick">
                                </div>
                                <div class="grid-item">Balance</div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits" disabled v-model="balancevacation">
                                </div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits" disabled v-model="balancesick">
                                </div>
                            </div>
                        </div>
                        <p
                            style="text-align: center; margin-top: 15px; border: none; outline: none; width: auto; z-index: 9; font-size: 10px; font-weight: bold;">
                            {{ secch }}
                        </p>
                        <p
                            style="height: 10px; width: 350px; margin-top: -19px; z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px">
                        </p>
                        <p style="text-align: center; position: relative; top:-6px; font-size:9px;">{{ secchpos }}</p>
                    </div>
                    <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;margin-left: -2px;">
                        <p style="margin-left: 10px;">7.B RECOMMENDATION</p>
                        <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
                            <label class="containerlist">
                                <input type="checkbox" disabled v-model="recommendationLeavetype" :value="recommendationtype[0]">
                                <svg viewBox="0 0 64 64" height="2em" width="2em">
                                    <path
                                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                        pathLength="575.0541381835938" class="path"></path>
                                </svg>
                            </label>
                            <p>For approval</p>
                        </div>

                        <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
                            <label class="containerlist">
                                <input type="checkbox" disabled v-model="recommendationLeavetype" :value="recommendationtype[1]">
                                <svg viewBox="0 0 64 64" height="2em" width="2em">
                                    <path
                                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                        pathLength="575.0541381835938" class="path"></path>
                                </svg>
                            </label>
                            <p>For disapproval due to:</p>
                        </div>

                        <textarea @keydown.enter.prevent v-model="text" id="myTextarea" :rows="rows" disabled
                            
                            :disabled="!recommendationLeavetype.includes(2)"
                            style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 350px; margin-left: 20px; font-size: 10px; text-decoration: underline;"></textarea>
                        <p style="text-align: center;margin-bottom: -20px;z-index: 9;">{{ reco }}</p>

                        <p
                            style="height: 10px; width: 350px; z-index: 1; border: none; border-bottom: 1px solid black;outline: none; margin-left: 20px; font-size: 10px; color: transparent;">
                        </p>
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
                                    <input disabled
                                        style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                        v-model="withpay">
                                    <p style="font-size: 10px;">days with pay</p>
                                </div>
                                <div style="display: flex; flex-direction: row; margin-top: -5px;">
                                    <input disabled
                                        style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                        v-model="withoutpay">
                                    <p>days without pay</p>
                                </div>
                                <div style="display: flex; flex-direction: row; margin-top: -5px;">
                                    <input disabled
                                        style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                        v-model="othersSpecify">
                                    <p>others (Specify)</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p style="margin-left: 10px;">7.D DISAPPROVED DUE TO:</p>
                            <textarea @keydown.enter.prevent v-model="text2" id="myTextarea" :rows="rows2" disabled
                                style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 350px; margin-left: 20px; font-size: 10px; text-decoration: underline;"></textarea>
                        </div>
                    </div>
                </div>
                <div>
                    <p style="text-align: center">{{ rd }}</p>
                    <p style="text-align: center">{{ rdpos }}</p>
                </div>
            </div>
            <div v-if="loadis" class="leaveloadid">
                <div class="leaveloader"></div>
            </div>
            <div class="leavebuttonss">


                <button class="leavebutton" @click="validation"> Submit
                </button>


            </div>

        </div>

    </div>
</template>

<script>
import modeCtrGladman from 'crypto-js/mode-ctr-gladman';
import image1 from '../assets/background_image.png'
import image2 from '../assets/bago.png'
import axios from 'axios';
import { isaddleave } from './leaveform.vue';
import { showleavehome } from './leaveform.vue';




export default {
    data() {
        return {
            leaveshowhome: true,
            image1: image1,
            image2: image2,
            datetoday: '',
            secch: 'JOANNE ROSE O. ALVAREZ',
            secchpos: 'Administrative Officer V (HRMO)',
            reco: 'LIBERTY B. DAITIA',
            recopost: 'Chief FAD',
            rd: 'RODANTE B. FELINA',
            rdpos: 'OIC, REGIONAL DIRECTOR',
            name: {
                last_name: '',
                first_name: '',
                middle_init: '',
            },
            text: '',
            rows: 1,
            text2: '',
            rows2: 1,
            isSingleDate: true,
            selectedDate: '',
            startDate: null,
            endDate: null,
            weekdaysCount: 1,

            selectedLeavetype: [],
            vacationleavedetails: [],
            sickleavedetails: [],
            studyleavedetails: [],
            commutationLeavetype: [],
            recommendationLeavetype: [],
            monetization: [],

            LeaveType: '',
            leavetype: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

            vacationdetails: [1, 2],
            vacation1: '',
            vacation2: '',

            sickdetails: [1, 2],
            sick1: '',
            sick2: '',
            studydetails: [1, 2],
            otherPurpose: '',

            leaveforwoman: '',

            commutationtype: [1, 2],

            recommendationtype: [1, 2],
            terminalleave: [1, 2],

            totalvacation: '',
            totalsick: '',
            lessvacation: '',
            lesssick: '',
            balancevacation: '',
            balancesick: '',
            withpay: '',
            withoutpay: '',
            othersSpecify: '',
            leavecredits: '',


            accounts: [],
            accountIdz: localStorage.getItem('accountId'),
            name: [],
            names: [],
            position: '',
            positions: [],
            employees: [],
            name_id: '',
            salary: '',
            division: '',
            signatories: [
                "JANICE B. FUROG",
                "LIBERTY B. DAITIA",
                "OSIN A. SINSUAT JR.",
                "ALVIN M. VILLANUEVA",
                "RODANTE B. FELINA",
            ],
            designations: [
                "Chief, MMD",
                "Chief, FAD",
                "Chief, GD",
                "Chief, MSESDD",
                "OIC, Regional Director",
            ],
            loadis: false
        };
    },
    watch: {
        text() {
            this.updateRows();
        },
        text2() {
            this.updateRows2();
        },
        selectedLeavetype(newValue, oldValue) {
            this.LeaveType = '';
            if (newValue.length > 1) {
                this.selectedLeavetype = [newValue[newValue.length - 1]]
                this.vacationleavedetails = [];
                this.sickleavedetails = [];
                this.monetization = [];
                this.vacation1 = '';
                this.vacation2 = '';
                this.sick1 = '';
                this.sick2 = '';
                this.leaveforwoman = '';
                this.otherPurpose = ''

            }
        },
        vacationleavedetails(newValue, oldValue) {
            if (newValue.length > 1) {
                this.vacationleavedetails = [newValue[newValue.length - 1]]
                this.vacation1 = '';
                this.vacation2 = '';
            }
        },

        sickleavedetails(newValue, oldValue) {
            if (newValue.length > 1) {
                this.sickleavedetails = [newValue[newValue.length - 1]]
                this.sick1 = '';
                this.sick2 = '';

            }
        },

        studyleavedetails(newValue, oldValue) {
            if (newValue.length > 1) {
                this.studyleavedetails = [newValue[newValue.length - 1]]
                this.study1 = '';
                this.otherPurpose = ''

            }
        },
        commutationLeavetype(newValue, oldValue) {
            if (newValue.length > 1) {
                this.commutationLeavetype = [newValue[newValue.length - 1]]
            }
        },

        recommendationLeavetype(newValue, oldValue) {
            if (newValue.length > 1) {
                this.recommendationLeavetype = [newValue[newValue.length - 1]]
                this.text = '';
            }
        },

        monetization(newValue, oldValue) {
            if (newValue.length > 1) {
                this.monetization = [newValue[newValue.length - 1]]
                this.selectedLeavetype = [];
            }
        },
    },

    mounted() {
        this.getTodayDate();
        this.fetchAccounts();
        this.fetchNames();
        this.fetchemployee();
    },

    methods: {

        validation() {
            if (this.selectedLeavetype.length === 0) {
                console.log('mali ni siya')

            } else {
                console.log('sakto')
                if (this.selectedLeavetype.includes(0) || this.selectedLeavetype.includes(5)) {
                    console.log('nag choose na siya og vacation leave')

                    if (this.vacationleavedetails.length === 0) {
                        console.log('pili sa dinha')

                    } else {

                    }

                } else if (this.selectedLeavetype.includes(2)) {
                    console.log('nag choose na siya og sick leave')
                }

                
               this.submitForm()
            }
        },

        submitForm() {

                if (this.getLeaveType() && this.getLeaveDetails() && this.weekdaysCountWithSuffix && this.formattedDateRange && this.salary && this.getCommutation()){
                    const formData = {
                    name_id: this.name_id,
                    position_id: this.employees[0]?.position_id || null,

                    type: this.getLeaveType() || this.LeaveType,

                    detail: this.getLeaveDetails(),
                    description: this.otherPurpose || '',
                    days: this.weekdaysCountWithSuffix || '',
                    dates: this.formattedDateRange || '',
                    commutation: this.getCommutation() || '',
                    applicant: this.salary || '', // Assuming salary is the applicant identifier
                    asof: this.leavecredits || '',
                    tevl: this.totalvacation || 0,
                    tesl: this.totalsick || 0,
                    ltavl: this.lessvacation || 0,
                    ltasl: this.lesssick || 0,
                    bvl: this.balancevacation || 0,
                    vsl: this.balancesick || 0,
                    certification: '', // Add your certification value here
                    reco: this.getRecommendation() || '',
                    recodesc: this.text || '',
                    recommendation: '', // Add your recommendation value here
                    dayswpay: this.withpay || 0,
                    dayswopay: this.withoutpay || 0,
                    others: this.othersSpecify || '',
                    disapproved: this.text2 || '',
                };

                console.log(formData);

                axios.post('http://172.21.96.1:8000/addleave_form', formData)
                    .then(response => {
                        console.log('Data saved successfully:', response.data);
                        this.loadis = true
                        this.resetForm();
                        setTimeout(() => {
                            this.loadis = false
                            window.location.reload();
                        }, 3000);
                    })
                    .catch(error => {
                        if (error.response && error.response.data) {
                            console.error('Error saving data:', error.response.data);
                        } else {
                            console.error('Error saving data:', error);
                        }
                    });
                }
                else {
                    console.log(this.getLeaveDetails())
                }


                
            
        },

        resetForm() {
            this.name_id = null;
            this.employees = [];
            this.selectedLeavetype = [];
            this.vacationleavedetails = [];
            this.vacation1 = '';
            this.vacation2 = '';
            this.sick1 = '';
            this.sick2 = '';
            this.studyleavedetails = [];
            this.leaveforwoman = '';
            this.otherPurpose = '';
            this.weekdaysCountWithSuffix = '';
            this.formattedDateRange = '';
            this.commutationLeavetype = [];
            this.salary = '';
            this.leavecredits = '';
            this.totalvacation = '';
            this.totalsick = '';
            this.lessvacation = '';
            this.lesssick = '';
            this.balancevacation = '';
            this.balancesick = '';
            this.recommendationLeavetype = [];
            this.text = '';
            this.withpay = '';
            this.withoutpay = '';
            this.othersSpecify = '';
            this.text2 = '';
            // Add any other fields that need to be reset
        },
        getLeaveType() {
            if (this.selectedLeavetype.includes(0)) {
                return 'Vacation Leave';
            } else if (this.selectedLeavetype.includes(1)) {
                return 'Mandatory/Forced Leave';
            } else if (this.selectedLeavetype.includes(2)) {
                return 'Sick Leave';
            } else if (this.selectedLeavetype.includes(3)) {
                return 'Maternity Leave';
            } else if (this.selectedLeavetype.includes(4)) {
                return 'Paternity Leave';
            } else if (this.selectedLeavetype.includes(5)) {
                return 'Special Privilege Leave';
            } else if (this.selectedLeavetype.includes(6)) {
                return 'Solo Parent Leave';
            } else if (this.selectedLeavetype.includes(7)) {
                return 'Study Leave';
            } else if (this.selectedLeavetype.includes(8)) {
                return '10-Day VAWC Leave';
            } else if (this.selectedLeavetype.includes(9)) {
                return 'Rehabilitation Privilege';
            } else if (this.selectedLeavetype.includes(10)) {
                return 'Special Leave Benefits for Women';
            } else if (this.selectedLeavetype.includes(11)) {
                return 'Special Emergency(Calamity) Leave';
            } else if (this.selectedLeavetype.includes(12)) {
                return 'Adoption Leave';
            } else {
                return 'Others - ' + this.LeaveType;
            }
        },
        getLeaveDetails() {
            if (this.selectedLeavetype.includes(0)) {
                if (this.vacationleavedetails.includes(1)) {
                    return `Within the Philippines, ${this.vacation1}`;
                } else if (this.vacationleavedetails.includes(2)) {
                    return `Abroad(Specify), ${this.vacation2}`;
                }
            } else if (this.selectedLeavetype.includes(2)) {
                if (this.sickleavedetails.includes(1)) {
                    return `In Hospital (Specify Illness), ${this.sick1}`;
                    
                } else if (this.sickleavedetails.includes(2)) {
                    return `Out Patient (Specify Illness), ${this.sick2}`;
                }
            } else if (this.selectedLeavetype.includes(7)) {
                if (this.studyleavedetails.includes(1)) {
                    return `Completion of Master's Degree, ${this.otherPurpose}`;
                } else if (this.studyleavedetails.includes(2)) {
                    return `BAR/Board Examination Review Other, ${this.otherPurpose}`;
                } else {
                    return this.otherPurpose
                }
            } else if (this.selectedLeavetype.includes(10)) {
                return this.leaveforwoman;
            } else {
                if (this.monetization.includes(1)) {
                    return 'Monetization of Leave Credits';
                }
                else if (this.monetization.includes(2)) {
                    return 'Terminal Leave';
                }
            }
            return '';
        },
        getCommutation() {
            if (this.commutationLeavetype.includes(1)) {
                return 'Not Requested';
            } else if (this.commutationLeavetype.includes(2)) {
                return 'Requested';
            }
            return '';
        },
        getRecommendation() {
            if (this.recommendationLeavetype.includes(1)) {
                return 'For approval';
            } else if (this.recommendationLeavetype.includes(2)) {
                return `For disapproval due to: ${this.text}`;
            }
            return '';
        },

        closeaddleave() {
            isaddleave.value = false;
            showleavehome.value = true
        },

        formatCurrency(event) {
            let value = event.target.value.replace(/[^\d.]/g, '');
            let parts = value.split('.');
            let wholePart = parts[0].replace(/\D/g, '');
            let formattedWholePart = Number(wholePart).toLocaleString();
            let formattedValue = '₱' + ' ' + formattedWholePart;


            if (parts.length > 1) {
                let decimalPart = parts[1].slice(0, 2);
                formattedValue += '.' + decimalPart;
            }

            event.target.value = formattedValue;
        },


        async fetchAccounts() {

            try {
                const response = await axios.get('http://172.21.96.1:8000/get_accounts_json');

                this.accounts = response.data;
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        },

        async fetchNames() {
            try {
                const response = await axios.get('http://172.21.96.1:8000/get_names_json');
                this.names = response.data;


                const account = this.accounts.find(acc => acc.account_id === parseInt(this.accountIdz));

                if (account) {
                    const nameId = account.name_id;
                    this.name_id = account.name_id;
                    const foundName = this.names.find(name => name.name_id === nameId);
                    if (foundName) {
                        this.name = foundName;
                        this.nameLoaded = true;
                    } else {
                        // Handle case where name is not found
                    }
                } else {
                    // Handle case where account is not found
                }
            } catch (error) {
                console.error('Error fetching names:', error);
            }
        },
        getPositionById(id, arrayName) {
            const array = this[arrayName];
            if (!array) {
                return ''; // Return an empty string if the array is not found
            }
            const item = array.find(item => item.position_id === id);
            return item ? item.position_name : '';
        },
        fetchemployee() {
            fetch('http://172.21.96.1:8000/get_employees_json/')
                .then(response => response.json())
                .then(data => {
                    this.employees = data.filter(det => det.name_id == this.name_id);
                    this.division = this.employees[0].division_id
                    if (this.division == 1) {
                        {
                            this.reco = this.signatories[0]
                            this.recopost = this.designations[0]
                        }
                    } else if (this.division == 2) {
                        {
                            this.reco = this.signatories[1]
                            this.recopost = this.designations[1]
                        }
                    } else if (this.division == 3) {
                        {
                            this.reco = this.signatories[2]
                            this.recopost = this.designations[2]
                        }
                    } else if (this.division == 4) {
                        {
                            this.reco = this.signatories[3]
                            this.recopost = this.designations[3]
                        }
                    } else if (this.division == 5) {
                        {
                            this.reco = ''
                            this.recopost = ''
                        }
                    } else {
                        this.reco = ''
                        this.recopost = ''
                        this.rd = ''
                        this.rdpos = ''
                    }
                    if ([15, 21, 45, 48].includes(this.name_id)) {
                        this.reco = this.signatories[4]
                        this.recopost = this.designations[4]
                        this.rd = ''
                        this.rdpos = ''
                    } else if (this.name_id == 20) {
                        this.reco = ''
                        this.recopost = ''
                        this.rd = ''
                        this.rdpos = ''
                    }
                })
                .catch(error => {
                    console.error('Error fetching employees:', error);
                });
            // Fetch positions data
            fetch('http://172.21.96.1:8000/get_positions_json/')
                .then(response => response.json())
                .then(data => {
                    this.positions = data.filter(detz => detz.position_id == this.employees[0].position_id);
                    this.position = this.positions[0].position_name
                })
                .catch(error => {
                    console.error('Error fetching positions:', error);
                });
        },
        getTodayDate() {
            const now = new Date();
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            this.datetoday = now.toLocaleDateString('en-US', options);
        },
        getPositionById(id, arrayName) {
            const array = this[arrayName];
            if (!array) {
                return ''; // Return an empty string if the array is not found
            }
            const item = array.find(item => item.position_id === id);
            return item ? item.position_name : '';
        },

        updateRows() {
            this.rows = this.text.length / 63 + 1
        },
        updateRows2() {
            this.rows2 = this.text2.length / 63 + 1
        },
        handleDateChange() {
            const selectedDate = new Date(this.selectedDate);
            if (!this.startDate) {
                this.startDate = selectedDate;
                this.isSingleDate = false; // Switch to date range mode
            } else if (this.isSingleDate) {
                this.startDate = selectedDate;
                this.endDate = null;
            } else {
                if (selectedDate < this.startDate) {
                    this.startDate = selectedDate;
                    this.endDate = null;
                } else if (selectedDate > this.startDate) {
                    this.endDate = selectedDate;
                    this.weekdaysCount = this.calculateWeekdays(this.startDate, this.endDate);
                } else {
                    this.startDate = selectedDate;
                    this.endDate = null;
                    this.weekdaysCount = 0;
                }
            }
            if (this.startDate && this.endDate) {
                this.weekdaysCount = this.calculateWeekdays(this.startDate, this.endDate);
            } else {
                this.weekdaysCount = 1; // Reset to 1 for a single date or incomplete range
            }
        },
        calculateWeekdays(startDate, endDate) {
            let count = 0;
            let currentDate = new Date(startDate);
            endDate = new Date(endDate);
            while (currentDate <= endDate) {
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    count++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return count;
        },
    },

    computed: {

        weekdaysCountWithSuffix: {
            get() {
                return `${this.weekdaysCount} ${this.weekdaysCount === 1 ? 'Day' : 'Days'}`;
            },
            set(value) {
                const count = parseInt(value, 10);
                if (!isNaN(count)) {
                    this.weekdaysCount = count;
                }
            }
        },


        formattedDate() {
            if (!this.selectedDate) return '';
            const date = new Date(this.selectedDate);
            return `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
        },
        formattedStartDate() {
            if (!this.startDate) return '';
            const startDate = new Date(this.startDate);
            const endDate = this.endDate ? new Date(this.endDate) : null;

            if (endDate && startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
                return `${startDate.toLocaleString('en-US', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
            } else {
                return `${startDate.toLocaleString('en-US', { month: 'long' })} ${startDate.getDate()}, ${startDate.getFullYear()}`;
            }
        },
        // formattedEndDate() {
        //     if (!this.endDate) return '';
        //     const endDate = new Date(this.endDate);
        //     return `${endDate.toLocaleString('en-US', { month: 'long' })} ${endDate.getDate()}, ${endDate.getFullYear()}`;
        // },

        formattedDateRange() {
            if (!this.startDate) return '';

            const startDate = new Date(this.startDate);
            const endDate = this.endDate ? new Date(this.endDate) : null;

            const formattedStart = `${startDate.toLocaleString('en-US', { month: 'long' })} ${startDate.getDate()}, ${startDate.getFullYear()}`;

            if (endDate) {
                if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
                    return `${startDate.toLocaleString('en-US', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
                } else {
                    const formattedEnd = `${endDate.toLocaleString('en-US', { month: 'long' })} ${endDate.getDate()}, ${endDate.getFullYear()}`;
                    return `${formattedStart} - ${formattedEnd}`;
                }
            } else {
                return formattedStart;
            }
        }
    },
};


</script>

<style>
.leaveloadid {
    display: flex;
    position: relative;
    flex-direction: row;
    height: 10px;
    justify-content: space-around;
}

.leaveloader {
    display: flex;
    --height-of-loader: 4px;
    --loader-color: black;
    width: 285px;
    height: 4px;
    border-radius: 30px;
    background-color: rgba(0, 0, 0, 0.2);
    position: relative;
    margin-top: 10px;
}

.leaveloader::before {
    content: "";
    position: absolute;
    background: var(--loader-color);

    width: 0%;
    height: 100%;
    border-radius: 30px;
    animation: moving 1s ease-in-out infinite;
}

.leavebuttonss {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: space-around;

}

.leavebutton {
    border-radius: 10px;
    width: 20%;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
}



.containerlist {
    cursor: pointer;
    position: relative;
    left: 4px;
    top: 10px;
    margin-right: 8px;

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
    cursor: pointer;
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

.not {
    cursor: not-allowed;
}

@keyframes moving {
    50% {
        width: 100%;
    }

    100% {
        width: 0;
        right: 0;
        left: unset;
    }
}
</style>