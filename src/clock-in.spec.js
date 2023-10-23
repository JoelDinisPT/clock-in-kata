require('assert');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const serverUrl = "http://127.0.0.1:3000"

function gpsIsNotAvailable() {
    return new Promise(function (resolve, reject) {
        reject('GPS data is not available...');
    });
}

function gpsIsAvailable() {
    return new Promise(function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    // Resolve the promise with the response text
                    resolve(this.responseText);
                } else {
                    reject(this.responseText);
                }
            }
        };
        xhttp.open('GET', serverUrl + "/gps-coordinates", true);
        xhttp.send();
    });
}

function clockIn(sendGpsData, gpsDataRequired, test) {

    // if gps data is required
    if (gpsDataRequired) {
        gpsIsNotAvailable()
            .then((value) => {
                return sendClockInRequest(value, test);
            }, (error) => {
                return Promise.reject(error);
            })
            .then((coordinates) => {
                // handles clockIn response from the server if GPS data is available
                handleResolve(coordinates);
            }, (error) => {
                handleReject("TEST " + test + " - Clock in not sent. " + error);
            })
            .catch((error) => {
                console.error("TEST " + test + " - The following error occurred: " + error);
            });
    } else if (sendGpsData) {
        // get gps data from server
        gpsIsAvailable()
            .then((value) => {
                // clocks in sending the gps data
                return sendClockInRequest(value, test);
            }, (error) => {
                handleReject("TEST " + test + " - Clock in not sent. " + error);
            })
            .then((value) => {
                // handles clockIn response from the server
                handleResolve(value);
            }, (error) => {
                handleReject("TEST " + test + " - Clock in not sent. " + error);
            })
            .catch((error) => {
                console.error("TEST " + test + " - The following error occurred: " + error);
            });
    } else {
        // make simple clock in request without gps data
        sendClockInRequest('', test)
            .then((value) => {
                // handles clockIn response from the server
                handleResolve(value);
            }, (error) => {
                handleReject("TEST " + test + " - Clock in not sent. " + error);
            })
            .catch((error) => {
                console.error("TEST " + test + " - Error: " + error);
            });
    }
}

function sendClockInRequest(gpsData, testNbr) {
    return new Promise(function (resolve, reject) {
        let data = "gpsData=" + gpsData + "&testNbr=" + testNbr;

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    // Resolve the promise with the response text
                    resolve(this.responseText);
                } else {
                    // Reject the promise with an error message
                    reject("TEST " + testNbr + " - Request failed with status: " + this.status);
                }
            }
        };
        xhttp.open('post', serverUrl + "/clock-in", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(data);
    });
}

function handleResolve(value) {
    console.log(value);
}

function handleReject(reason) {
    console.error(reason);
}

describe('time tracking', () => {
    let testRan = 0;

    context('GPS is required', () => {

        beforeEach(function () {
            testRan++;
            console.log("TEST " + testRan + " - Initializing...");
        });

        // Test 1
        it('sends clock-in when GPS is available', () => {
            clockIn(true, false, testRan);
        });

        // Test 2
        it('does NOT send clock-in when no GPS is available', () => {
            clockIn(true, true, testRan);
        });

        // Test 3
        it('warns the user when no GPS is available', () => {
            clockIn(true, true, testRan);
        });
    });

    context('GPS is optional', () => {
        beforeEach(function () {
            testRan++;
            console.log("TEST " + testRan + " - Initializing...");
        });

        // Test 4
        it('does NOT send GPS data when no GPS is available', () => {
            clockIn(false, false, testRan);
        });
    });
});
