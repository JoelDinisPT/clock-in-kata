const express = require('express')
const app = express()

app.use(express.urlencoded({
    extended: true
}))

app.post('/clock-in', (req, res) => {
    var gpsData = req.body.gpsData;
    var testNbr = req.body.testNbr;

    // console.log('Test ' + testNbr + ' - Called clock-in');

    // if (gpsData !== '')
        // console.log("TEST " + testNbr + " - GPS data received from the client: " + gpsData);

    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const miliseconds = String(now.getMilliseconds()).padStart(2, '0');
    res.status(200);
    res.send('TEST ' + testNbr + ' - Clocked in at ' + hours + ':' + minutes + ':' + seconds + ':' + miliseconds);
    // console.log('TEST ' + testNbr + ' - Clocked in at ' + hours + ':' + minutes + ':' + seconds + ':' + miliseconds);
});

app.get('/gps-coordinates', (req, res) => {
    var coordinates = "42.61, 1.53";
    res.status(200);
    res.send(coordinates);
});

app.listen(3000, () => {
    console.log(`Server is running on 127.0.0.1:3000`);
});