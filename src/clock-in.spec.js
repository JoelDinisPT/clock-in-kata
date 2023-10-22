require('assert');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const serverUrl = "http://127.0.0.1:3000"

// promise that returns the gps coordinates
const gpsIsAvailable = new Promise((resolve, reject) => {
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

// promise that returns an error when gps coordinates are not available
const gpsIsNotAvailable = new Promise(function (resolve, reject) {
    reject('GPS data is not available...');
});

function clockIn(sendGpsData, gpsDataRequired, test) {

    // checks if gps data is required
    if (gpsDataRequired) {
        gpsIsNotAvailable.then((value) => {
            console.log("this will not be called...");
        }).catch((error) => {
            console.error("Error: " + error);
        });
    } else if (sendGpsData) {
        // get gps data from server
        gpsIsAvailable
            .then((value) => {
                // clock in sending the gps data
                return sendClockInRequest(value, test);
            })
            .then((value) => {
                handleResolve(value);
            })
            .catch((error) => {
                console.error("Error: " + error);
            });
    } else {
        // make simple clock in request without gps data
        sendClockInRequest('', test)
            .then((value) => {
                console.log("Resolved...");
                handleResolve(value);
            })
            .catch((error) => {
                console.error("Error: " + error);
            });
    }
}

function sendClockInRequest(gpsData, testNbr) {
    return new Promise(function (resolve, reject) {
        let data = '';
        // if (gpsData !== '')
            data = "gpsData=" + gpsData + "&testNbr=" + testNbr;

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    // Resolve the promise with the response text
                    resolve(this.responseText);
                } else {
                    // Reject the promise with an error message
                    reject("Request failed with status: " + this.status);
                }
            }
        };
        xhttp.open('post', serverUrl + "/clock-in", true);
        // xhttp.send(data);
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

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

describe('time tracking', () => {
    let testRan = 0;

    context('GPS is required', () => {

        beforeEach(function () {
            testRan++;
            console.log("Initializing... Test " + testRan);
        });

        it('sends clock-in when GPS is available', () => {
            clockIn(true, false, testRan);
        });

        it('does NOT send clock-in when no GPS is available', () => {
            clockIn(true, true);
        });

        it('warns the user when no GPS is available', () => {
            gpsIsNotAvailable.catch((error) => {
                console.error(error);
            })
        });
    });

    context('GPS is optional', () => {
        beforeEach(function () {
            testRan++;
            console.log("Initializing... Test " + testRan);
        });

        it('does NOT send GPS data when no GPS is available', () => {
            clockIn(false, false, testRan);
        });
    });
});
