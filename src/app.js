const express = require("express");

let mysql = require("mysql");
const connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password",
});

connect.connect((connectionError, res) => {
  if (connectionError) throw connectionError;
  console.log("Connected");
});

connect.query("SELECT * FROM sys.sys_config", (queryError, result) => {
  if (queryError) throw queryError;
  console.log("Query Executed Successfully");
});
