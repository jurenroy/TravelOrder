<template>
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
            <h3 style="text-align: center">APPLICATION FOR LEAVE</h3>
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
                            style="height: 10px; width: 100px; outline: none; border: none; border-bottom: 1px solid black; font-size: 10px; " />
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
                                <p>Adoption Leave</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" v-model="selectedLeavetype" :value="leavetype[13]">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Others:</p>
                            </div>

                            <input
                                style="height: 10px; width: 350px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                v-model="LeaveType" :disabled="!selectedLeavetype.includes(13)">
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
                                    <label class="containerlist">
                                        <input type="checkbox" :disabled="!selectedLeavetype.includes(0)">
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
                                        :disabled="!selectedLeavetype.includes(0)">
                                </div>
                            </div>
                            <div
                                style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <label class="containerlist">
                                        <input type="checkbox" :disabled="!selectedLeavetype.includes(0)">
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
                                        :disabled="!selectedLeavetype.includes(0)">
                                </div>
                            </div>
                            <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Sick Leave:</p>
                            <div
                                style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <label class="containerlist">
                                        <input type="checkbox" :disabled="!selectedLeavetype.includes(2)">
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
                                        :disabled="!selectedLeavetype.includes(2)">
                                </div>
                            </div>
                            <div
                                style="display: flex; flex-direction: row; margin-top: -15px; justify-content: space-between">
                                <div style="display: flex; flex-direction: row;">
                                    <label class="containerlist">
                                        <input type="checkbox" :disabled="!selectedLeavetype.includes(2)">
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
                                        :disabled="!selectedLeavetype.includes(2)">
                                </div>
                            </div>

                            <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Special Leave
                                Benefits for Women:</p>
                            <div style="display: flex; flex-direction: row; justify-content: space-between">
                                <p style="margin-left: 5px; margin-top: -0px">(Specify Illness)</p>
                                <input
                                    style="height: 10px; width: 150px; margin-top: -3px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px"
                                    :disabled="!selectedLeavetype.includes(2)">
                            </div>

                            <p style="margin-left: 5px; margin-top: -0px;font-style: italic;">In case of Study Leave:
                            </p>
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox" :disabled="!selectedLeavetype.includes(7)">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
                                <p>Completion of Master's Degree</p>
                            </div>

                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist" >
                                    <input type="checkbox" :disabled="!selectedLeavetype.includes(7)">
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
                                    :disabled="!selectedLeavetype.includes(7)">
                            </div>
                            <div style="display: flex; flex-direction: row; margin-top: -5px">
                                <label class="containerlist">
                                    <input type="checkbox">
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
                                    <input type="checkbox" >
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
                            <p v-if="!isSingleDate"
                                style="position: relative; left:10px;  margin-bottom: -20px; font-size: 10px;"> {{
                    weekdaysCount }} {{ weekdaysCount === 1 ? 'Day' : 'Days' }}</p>
                            <p
                                style="height: 10px; width: 350px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px;">
                            </p>

                            <p style=" margin-bottom: 5px">INCLUSIVE DATES</p>

                            <p v-if="!isSingleDate && startDate && !endDate && selectedDate"
                                style="margin-right: 10px; font-size: 10px; margin-bottom: -20px; position: relative; left:10px; ">
                                {{ formattedStartDate }}</p>
                            <p v-if="!isSingleDate && startDate && !endDate && selectedDate"
                                style="height: 10px; width: 350px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                            </p>

                            <p v-if="!selectedDate"
                                style="height: 10px; width: 350px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                            </p>


                            <p v-if="!isSingleDate && startDate && endDate"
                                style="margin-right: 10px; font-size: 10px; margin-bottom: -20px; position: relative; left:10px; ">
                                {{ formattedStartDate }}
                                <template
                                    v-if="startDate.getMonth() !== endDate.getMonth() || startDate.getFullYear() !== endDate.getFullYear()">
                                    - {{ formattedEndDate }}
                                </template>
                            </p>
                            <p v-if="!isSingleDate && startDate && endDate"
                                style="height: 10px; width: 350px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                            </p>





                            <div>
                                <input type="date" id="date-input" v-model="selectedDate" @change="handleDateChange"
                                    style="width: 16px; height: 20px; outline: none; border: none; position: relative; top: -32px; left:330px;" />
                            </div>
                        </div>
                    </div>
                    <div style="border: 2px solid black;margin-top: -2px;font-size: 10px;margin-left: -2px;">
                        <p style="margin-left: 10px;">6.D COMMUTATION</p>
                        <div style="margin-left: 20px;">
                            <div style="display: flex; flex-direction: row; margin-top: -15px">
                                <label class="containerlist">
                                    <input type="checkbox">
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
                                    <input type="checkbox">
                                    <svg viewBox="0 0 64 64" height="2em" width="2em">
                                        <path
                                            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                            pathLength="575.0541381835938" class="path"></path>
                                    </svg>
                                </label>
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
                            <input
                                style="height: 10px; width: 230px; border: none; border-bottom: 1.5px solid black;outline: none; font-size: 10px; margin-top: 7px; margin-left: 3px">
                        </div>
                        <div>
                            <div class="grid-container">
                                <div class="grid-item"></div>
                                <div class="grid-item">Vacation Leave</div>
                                <div class="grid-item">Sick Leave</div>
                                <div class="grid-item">Total Earned</div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits">
                                </div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits">
                                </div>
                                <div class="grid-item">Less this Application</div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits">
                                </div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits">
                                </div>
                                <div class="grid-item">Balance</div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits">
                                </div>
                                <div class="grid-item">
                                    <input type="text" class="leavecredits">
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
                        <p style="text-align: center">{{ secchpos }}</p>
                    </div>
                    <div style="border: 2px solid black;margin-top: 2px;font-size: 10px;margin-left: -2px;">
                        <p style="margin-left: 10px;">7.B RECOMMENDATION</p>
                        <div style="display: flex; flex-direction: row; margin-top: -5px; margin-left: 20px;">
                            <label class="containerlist">
                                <input type="checkbox">
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
                                <input type="checkbox">
                                <svg viewBox="0 0 64 64" height="2em" width="2em">
                                    <path
                                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                        pathLength="575.0541381835938" class="path"></path>
                                </svg>
                            </label>
                            <p>For disapproval due to:</p>
                        </div>

                        <textarea @keydown.enter.prevent v-model="text" id="myTextarea" :rows="rows"
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
                                    <input
                                        style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                                    <p style="font-size: 10px;">days with pay</p>
                                </div>
                                <div style="display: flex; flex-direction: row; margin-top: -5px;">
                                    <input
                                        style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                                    <p>days without pay</p>
                                </div>
                                <div style="display: flex; flex-direction: row; margin-top: -5px;">
                                    <input
                                        style="height: 10px; width: 20px; margin-top: 8px; border: none; border-bottom: 1.5px solid black;outline: none; margin-right: 10px; font-size: 10px">
                                    <p>others (Specify)</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p style="margin-left: 10px;">7.D DISAPPROVED DUE TO:</p>
                            <textarea @keydown.enter.prevent v-model="text2" id="myTextarea" :rows="rows2"
                                style="border: none; border-bottom: 1px solid #ccc; outline: none; resize: none; width: 350px; margin-left: 20px; font-size: 10px; text-decoration: underline;"></textarea>
                        </div>
                    </div>
                </div>
                <div>
                    <p style="text-align: center">{{ rd }}</p>
                    <p style="text-align: center">{{ rdpos }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import image1 from '../assets/background_image.png'
import image2 from '../assets/bago.png'
import axios from 'axios';

export default {
    data() {
        return {
            image1: image1,
            image2: image2,
            lastname: 'ABRAGAN',
            firstname: 'JUREN ROY',
            middleinit: 'R.',
            datetoday: '',
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
            isSingleDate: true,
            selectedDate: '',
            startDate: null,
            endDate: null,
            weekdaysCount: 1,
            selectedLeavetype: [],
            LeaveType: '',
            leavetype: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
            accounts: [],
            accountIdz: localStorage.getItem('accountId'),
            name: [],
            names: [],
            position: '',
            positions: [],
            employees: [],
            name_id: '',
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
            if (newValue.length > 1) {
                this.selectedLeavetype = [newValue[newValue.length - 1]]
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


        async fetchAccounts() {

            try {
                const response = await axios.get('http://172.31.10.164:8000/get_accounts_json');

                this.accounts = response.data;
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        },

        async fetchNames() {
            try {
                const response = await axios.get('http://172.31.10.164:8000/get_names_json');
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
    fetchemployee(){
        fetch('http://172.31.10.164:8000/get_employees_json/')
        .then(response => response.json())
        .then(data => {
          this.employees = data.filter(det => det.name_id == this.name_id);
        })
        .catch(error => {
          console.error('Error fetching employees:', error);
        });
      // Fetch positions data
      fetch('http://172.31.10.164:8000/get_positions_json/')
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
        formattedEndDate() {
            if (!this.endDate) return '';
            const endDate = new Date(this.endDate);
            return `${endDate.toLocaleString('en-US', { month: 'long' })} ${endDate.getDate()}, ${endDate.getFullYear()}`;
        },
    },
};
</script>

<style>
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
</style>