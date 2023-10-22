const express = require('express')
const app = express()

app.get('/clock-in', (req, res) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    res.status(200);
    res.send('Clocked in at ' + hours + ':' + minutes);
    console.log('Clocked in at ' + hours + ':' + minutes);
});

app.listen(3000, () => {
    console.log(`Server is running on 127.0.0.1:3000`);
});