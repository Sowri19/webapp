const express = require("express");
const app = express();
const router = express.Router();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
// const customCss = fs.readFileSync(process.cwd() + "/swagger.css", "utf8");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded());
// app.use(cors());
let tasks = [
  {
    id: 1,
    task: "get milk",
    assignee: "assignment 1",
    status: "finished",
  },
];

app.get("/cloud", (req, res) => {
  console.log("api called");
  res.json(tasks);
});

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
app.listen(3080, () => {
  console.log(`Server listening on the port:::::: 3080`);
});
