

//import libs
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");

//connection to db
const dbConnection = require('./db/mongoose');
dotenv.config({ path: "config.env" });






//import routes
const AdminApi = require('./routes/adminRoutes');
const etudiantApi = require('./routes/etudiantRoutes');
const chefApi = require('./routes/chefRoutes');
const menuApi = require('./routes/menuRoutes');
const reserveApi = require('./routes/reservationROutes');



//create app
const app = express();


//server port
const port = process.env.PORT || 3000



//connect db
dbConnection();

//cors , json and files config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });



//routes
app.use('/chef', chefApi);
app.use('/admin', AdminApi);
app.use('/etudiant', etudiantApi);
app.use('/menu', menuApi);
app.use('/reserve', reserveApi);





//TEST API 
app.get('/', (req, res) => res.status(200).send({ message: "Welcome to the server" }))

//RUNNING SERVER
app.listen(port, () => console.log(`server works on port ${port}`));