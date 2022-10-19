// const mysql = require("mysql");
// // const bcrypt = require("bcryptjs");

// // let mysql = require("mysql");
// const connect = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Password",
// });

// connect.connect((connectionError, res) => {
//   if (connectionError) throw connectionError;
//   console.log("Connected");
// });

// connect.query("SELECT * FROM sys.sys_config", (queryError, result) => {
//   if (queryError) throw queryError;
//   console.log("Query Executed Successfully");
// });

// // let id = 01;
// // let EmailID = "Tiger@gmail.com";
// // let Password = "Password";
// // let FirstName = "Tiger";
// // let LastName = "Shrof";
// // let Account_Created = "2022-01-01 11:00:00";
// // let LastUpdated = "2022-01-01 01:01:01";

// // let addDataObject = {
// //   id: "01",
// //   EmailID: EmailID,
// //   Password: Password,
// //   FirstName: FirstName,
// //   LastName: LastName,
// //   Account_Created: Account_Created,
// //   LastUpdated: LastUpdated,
// // };

// // Adding the data to the database
// const addData = (addDataObject) => {
//   let addData = `INSERT INTO first_schema.account_table (EmailID, Password, FirstName, LastName, AccountCreated, LastUpdated) VALUES ("${addDataObject.EmailID}", "${addDataObject.Password}", "${addDataObject.FirstName}", "${addDataObject.LastName}", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
//   connect.query(addData, (Error, result) => {
//     if (Error) throw Error;
//     console.log("added data into database");
//     console.log(result);
//     return result;
//   });
// };

// // Get the data from the database
// // let getDataObject = { EmailID: EmailID, Password: Password };

// const getData = (getDataObject) => {
//   let getData = `SELECT * FROM first_schema.account_table where EmailID="${getDataObject.EmailId}";`;
//   console.log(getData);
//   return new Promise(function (resolve, reject) {
//     connect.query(getData, (Error, result) => {
//       if (Error) throw Error;
//       // console.log("get data successfully completed ");
//       // console.log(result);
//       return resolve(result);
//     });
//   });
// };

// // Update the data from the database
// // let putDataObject = {
// //   FirstNameChanged: FirstName,
// //   LastNameChanged: LastName,
// //   PasswordChanged: Password,
// // };

// const putData = (putDataObject) => {
//   let putData = `UPDATE first_schema.account_table SET FirstName="${putDataObject.FirstNameChanged}", LastName="${putDataObject.LastNameChanged}", Password= "${putDataObject.PasswordChanged}", AccountUpdated=CURRENT_TIMESTAMP WHERE (EmailID = "${putDataObject.EmailID}";`;
//   console.log(putData, "updated data in mysql");
//   return new Promise(function (resolve, reject) {
//     connect.query(putData, (Error, result) => {
//       if (Error) throw Error;
//       // console.log("data is been updated");
//       // console.log(result);
//       return resolve(result);
//     });
//   });
// };

// module.exports = {
//   addData,
//   getData,
//   putData,
// };
