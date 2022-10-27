// describe("Sample Test Case 1 ", () => {
//   it("This test should check that true === true", () => {
//     expect(true).toBe(true);
//   });
// });

var mysql = require('mysql2');
require("dotenv").config();
const express = require("express");
const app = express();
const {
  User,
  Document
} = require("./models");
User.sequelize.sync();
// Document.sequelize.sync();
const bcrypt = require("bcrypt");
// const app = express.Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});

const BUCKET = process.env.BUCKET
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: BUCKET,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname)
    }
  })
});

const basicAuth = require("express-basic-auth");
app.use(basicAuth);


//Adding Basic Authentication  
function Basicauthentication(req, res, next) {
  var authenticationHeader = req.headers.authorization || null;
  if (!authenticationHeader) {
    return res.status(400);
  }
  var auth = new Buffer.from(authenticationHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  return auth;
}

//Health check point 
app.get("/healthz", (req, res) => {
  res.status(200).send();
});


//get user data with sequalize 
app.get("/v1/account/:id", async (req, res) => {
  try {
    auth = Basicauthentication(req, res);
    var userName = auth[0];
    var passWord = auth[1];
    const client = await User.findOne({
      where: {
        username: userName,
      },

    });
    if (client) {
      const validPass = bcrypt.compareSync(passWord, client.password);
      if (validPass) {
        if (req.params.id === client.id) {
          client.password = undefined;
          return res.status(200).send(client);
        } else {
          return res.status(403).send("Forbidden");
        }
      } else {
        return res.status(401).send("Unauthorized");
      }
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (err) {

    console.log(err);
    return res.status(400).send("Bad Request");
  }
});



// create new user end point with sequelize 
app.post("/v1/account", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const newuser = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hash,
    });

    newuser.password = undefined;
    return res.status(201).send(newuser);
  } catch (err) {

    return res.status(400).send(err);
  }
});


app.put("/v1/account/:id", async (req, res) => {
  // Checking  any other fields than the editable fields
  try {
    const bodyfields = req.body;
    for (let x in bodyfields) {
      if (
        x != "first_name" &&
        x != "last_name" &&
        x != "password" &&
        x != "username"
      ) {
        return res.status(400).send("Bad Request");
      }
    }

    auth = Basicauthentication(req, res);
    var user = auth[0];
    var pass = auth[1];

    const dbAcc = await User.findOne({
      where: {
        username: user,
      },
    });
    if (dbAcc) {

      const validPass = bcrypt.compareSync(pass, dbAcc.password);
      if (validPass) {
        if (req.params.id === dbAcc.id) {
          const Hpassword = req.body.password || pass
          const first = req.body.first_name || dbAcc.first_name
          const last = req.body.last_name || dbAcc.last_name

          const hash = bcrypt.hashSync(Hpassword, 10);
          const Accu = await User.update({
            first_name: first,
            last_name: last,
            password: hash
          }, {
            where: {
              username: user,
            },
          });

          return res.status(200).send("");

        } else {
          return res.status(403).send("Forbidden");
        }
      } else {
        return res.status(401).send("Unauthorized");
      }
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Bad Request");
  }
});



// Starting of document endpoints/////////////////////////////////////////////////////////////

// endpoint to upload the document 
const Ufile = upload.single("file");
app.post("/v1/documents", async (req, res) => {
  try {
    auth = Basicauthentication(req, res);
    var userName = auth[0];
    var passWord = auth[1];
    const client = await User.findOne({
      where: {
        username: userName,
      },
    });
    if (client) {
      const CorrectPass = bcrypt.compareSync(passWord, client.password);
      if (CorrectPass) {
        Ufile(req, res, async (err) => {
          if (err) {
            res.status(400).send("Bad Request");
          }
          const docx = await Document.create({
            user_id: client.id,
            name: req.file.key,
            s3_bucket_path: req.file.location
          });

          res.status(201).send(docx);

        });
      } else {
        return res.status(401).send("Unauthorized");
      }
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (err) {

    console.log(err);
    return res.status(400).send("Bad Request");
  }
});

User.sequelize.sync().then((req) => {
  app.listen(3080, () => {
    console.log(`Server listening on the port:::::: 3080`);
  });
});