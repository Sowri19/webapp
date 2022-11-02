// // connecting the cloud infrastructure file
// const process = require('process');

// const RDS=process.env.host;
// const SQL_ROOT=process.env.user;
// const SQL_PASS=process.env.password;
// const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
// const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
// const BUCKET= process.env.BUCKET;
// const DB=process.env.database;
// const REGION=process.env.region;

// const config={
//     RDSConnection:RDS,
//     SQL_ROOTConnection:SQL_ROOT,
//     SQL_PASSConnection:SQL_PASS,
//     ACCESS_KEYConnection:AWS_ACCESS_KEY_ID,
//     ACCESS_SECRETConnection:AWS_SECRET_ACCESS_KEY,
//     BUCKETConnection:BUCKET,
//     DBConnection:DB,
//     REGIONConnection:REGION
// };

// module.exports = config;
require("dotenv").config();
module.exports ={
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    dialect: "mysql",
    pool:{
        max: 5,
        min: 0,
        Idle: 10000
    },
};


