const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// app.use(bodyParser.urlencoded({ extended: false }))  
app.use(bodyParser.json())

require('./src/routes/slot')(app);
require('./src/routes/bookingRoutes')(app);
require('./src/routes/pembayaranRoutes')(app);

app.listen(8080, ()=>{
    console.log('Server Berjalan di Port : 8080');
});