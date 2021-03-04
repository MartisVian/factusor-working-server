const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors')
const app = express();

const PORT = process.env.PORT || 8080; // Step 1

const routes = require('./routes/api');

// Step 2
// const MONGODB_URI = 'mongodb+srv://admin:readyAtlas72@factusorcluster.9cpsy.mongodb.net/factusor?retryWrites=true&w=majority'
const MONGODB_URI = ''

mongoose.connect(process.env.MONGODB_URI || MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});

// Data parsing
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Step 3

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('factusor/build'));
//     // app.get('*', (req, res) => {
//     //     res.sendFile(path.join(__dirname, 'factusor/build', 'index.html'));
//     //   });
// }



app.use('/api', routes);

app.listen(PORT, console.log(`Server is starting at ${PORT}`));