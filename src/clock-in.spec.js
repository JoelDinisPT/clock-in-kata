require('assert');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const serverUrl = "http://127.0.0.1:3000"

// promise that returns the gps coordinates
const gpsIsAvailable = new Promise((resolve, reject) => {
    resolve();
});

// promise that returns an error when gps coordinates are not available
// const gpsIsNotAvailable = new Promise((resolve, reject) => {
//   reject();
// });

async function clockIn() {
    return new Promise(function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    // Resolve the promise with the response text
                    resolve(this.responseText);
                } else {
                    // Reject the promise with an error message
                    reject("Request failed with status: " + this.status);
                }
            }
        };
        xhttp.onerror = function() {
            reject("Request failed");
        };
        xhttp.open('GET', serverUrl+"/clock-in", true);
        xhttp.send();
    });
}

function displayMsg(msg){
  console.log(msg);
}

describe('time tracking', () => {
    context('GPS is required', () => {
        it('sends a simple clock in', () => {
            clockIn()
                .then(
                    function(value) {displayMsg(value);},
                    function(error){displayMsg(error);}
                );
        });

        // it('sends clock-in when GPS is available', () =>
        //   sendClockIn(gpsIsAvailable).then((gpsCoordinates) => {
        //     // gps coordinates are available, send clockin to server
        //     console.log('Clock-in sent to server with GPS coordinates:', gpsCoordinates);
        //   })
        // );

        // it('sends clock-in with coordinates when GPS is available', (done) => {
        // });
        //
        // it('does NOT send clock-in when no GPS is available', (done) => {
        //   sendClockIn(gpsIsNotAvailable)
        //     .then(() => assert(false, 'Promise should have been rejected'))
        //     .catch(done);
        // });
        //
        // it('warns the user when no GPS is available', () => {
        //
        // });
    });

    // context('GPS is optional', () => {
    //   // it('does NOT send GPS data when no GPS is available', () => {
    //   //
    //   // });
    // });
});
