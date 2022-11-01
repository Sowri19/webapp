const express = require("express");
require("dotenv").config();
const app = express();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
let mysql = require('mysql2');
const {
  User,
  Document
} = require("./models");
User.sequelize.sync();
Document.sequelize.sync();

const bcrypt = require("bcrypt"); 
const { response } = require("express");

// const basicAuth = require("express-basic-auth");
// app.use(basicAuth);

// Configuring the AWS environment
aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});

// configuring the Bucket
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

// Checking the End Point
app.get("/healthz", async (req, res) => {
  res.send({ message: "The server is running" });
  res.status(200);
});

// Testing the post Method
app.post('/upload', upload.single('file'), (req, res)=> {
  console.log(req.file);
  res.send("File Uploaded"+ req.file.location+ ' Location!');
});

// Implementing the Post Method
const Ufile = upload.single("file");
app.post("/v1/document", (req, res) => {
  try {
    const EncodedUserPass = req.headers.authorization.split(" ")[1];
    const DecodedUserPass = Buffer.from(EncodedUserPass, "base64").toString(
      "ascii"
    );
    const DecodedUser = DecodedUserPass.split(":")[0];
    const DecodedPass = DecodedUserPass.split(":")[1];
    User.findOne({ where: { EmailId: DecodedUser} }).then(
      (result) => {
        if (result === null) {
          res.status(200);
          res.send({ Output: "Client Not Found" });
        } else {
          bcrypt.compare(
            DecodedPass,
            result.dataValues.Password,
            function (err, authenticated) {
              if (authenticated) {
                console.log("Authenticated........................>", authenticated);
                Ufile(req, res, async (err) => {
                  if (err) {
                    res.status(400).send("Bad Request");
                  }
                  const docx = await Document.create({
                    user_id: result.dataValues.id,
                    name: req.file.key,
                    s3_bucket_path: req.file.location
                  });
                  res.status(201).send(docx);
                });
              } else {
                res.status(200);
                res.send({ Output: "Wrong Password" });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    return res.status(400).send("Client Not Found");
  }
});

app.get("/v1/document/:doc_id", (req, res) => {
  try {
    const DocId = req.params.doc_id;
    const EncodedUserPass = req.headers.authorization.split(" ")[1];
    const DecodedUserPass = Buffer.from(EncodedUserPass, "base64").toString(
      "ascii"
    );
    const DecodedUser = DecodedUserPass.split(":")[0];
    const DecodedPass = DecodedUserPass.split(":")[1];
    User.findOne({ where: { EmailId: DecodedUser} }).then(
      (result) => {
        if (result === null) {
          res.status(200);
          res.send({ Output: "Client Not Found" });
        } else {
          
          bcrypt.compare(
            DecodedPass,
            result.dataValues.Password,
            function (err, authenticated) {
              if (authenticated) {
                console.log("Authenticated........................>", authenticated);
  
                // const DocId = DocID; 
                Document.findOne({
                where: {
                user_id: result.dataValues.id, 
                doc_id: DocId
              },
              }).then(
              (DocResult)=>{ 
                // console.log(DocResult, "...............>>>>>id");
              if(DocResult){
                res.status(200).send(DocResult);
              }
              else{
                return res.status(403).send("Forbidden");
              }
            }
            )
              } else {
                res.status(200);
                res.send({ Output: "Wrong Password" });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    return res.status(400).send("Client Not Found");
  }
});

app.delete("/v1/document/:doc_id", async (req, res) => {
  try{
    // const DocId = req.params.doc_id;
    const EncodedUserPass = req.headers.authorization.split(" ")[1];
    const DecodedUserPass = Buffer.from(EncodedUserPass, "base64").toString(
      "ascii"
    );
    const DecodedUser = DecodedUserPass.split(":")[0];
    const DecodedPass = DecodedUserPass.split(":")[1];
    console.log(DecodedUser, "pass user");
    console.log(DecodedPass, "pass pass");
   const Client = await User.findOne({
    where: {
      EmailId: DecodedUser,
    },
  });
      if (Client) {
        const CorrectPass = bcrypt.compareSync(DecodedPass, Client.Password);
        if (CorrectPass) {    
          const document_id = req.params.doc_id; 
            const docx = await Document.findOne({
              where: {
                user_id: Client.id,
                doc_id:document_id,
              },
            });
            if (docx) {
              await s3.deleteObject({Bucket:BUCKET,Key: docx.name}).promise();
              const del = await Document.destroy({
                where: {
                  user_id: Client.id,
                  doc_id: document_id,
                },
              });
               if(del){
                res.status(200).send("Document Deleted");
               }
            }
            else{
              return res.status(404).send("Not Found");
            }
         } else {
          return res.status(401).send("Unauthorized");
        }
      } else {
        return res.status(401).send("Unauthorized");
      }
    }
    catch(err) {
        console.log(err);
        return res.status(400).send("Bad Request");
    }
    });




User.sequelize.sync().then((req) => {
  app.listen(3080, () => {
    console.log(`Server listening on the port:::::: 3080`);
  });
});