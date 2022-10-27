
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

let bCrypting = (Password) => {
  return bcrypt.hashSync(Password, bcrypt.genSaltSync(10));
};

app.get("/healthz", async (req, res) => {
  res.send({ message: "The server is running" });
  res.status(200);
});

app.post("/v1/account", async (req, res) => {
  try {
    const NewClient = await User.create({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      EmailId: req.body.EmailID,
      Password: bCrypting(req.body.Password),
    });
    NewClient.Password = undefined;
    return res.status(201).send(NewClient);
  } catch (Error) {
    return res.status(400).send(Error);
  }
});

app.get("/v1/account/:id", (req, res) => {
  try {
    const ClientID = req.params.id;
    const EncodedUserPass = req.headers.authorization.split(" ")[1];
    const DecodedUserPass = Buffer.from(EncodedUserPass, "base64").toString(
      "ascii"
    );
    const DecodedUser = DecodedUserPass.split(":")[0];
    const DecodedPass = DecodedUserPass.split(":")[1];
    User.findOne({ where: { EmailId: DecodedUser, id: ClientID } }).then(
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
                result.dataValues.Password = undefined;
                res.status(200).send(result);
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

// // const basicAuth = require("express-basic-auth");
// // app.use(basicAuth);


// //Adding Basic Authentication  
// // function Basicauthentication(req, res, next) {
// //   var authenticationHeader = req.headers.authorization || null;
// //   if (!authenticationHeader) {
// //     return res.status(400);
// //   }
// //   var auth = new Buffer.from(authenticationHeader.split(" ")[1], "base64")
// //     .toString()
// //     .split(":");
// //   return auth;
// // }

// // //get user data with sequalize 
// // app.get("/v1/account/:id", async (req, res) => {
// //   try {
// //     auth = Basicauthentication(req, res);
// //     var userName = auth[0];
// //     var passWord = auth[1];
// //     const client = await User.findOne({
// //       where: {
// //         username: userName,
// //       },

// //     });
// //     if (client) {
// //       const validPass = bcrypt.compareSync(passWord, client.password);
// //       if (validPass) {
// //         if (req.params.id === client.id) {
// //           client.password = undefined;
// //           return res.status(200).send(client);
// //         } else {
// //           return res.status(403).send("Forbidden");
// //         }
// //       } else {
// //         return res.status(401).send("Unauthorized");
// //       }
// //     } else {
// //       return res.status(401).send("Unauthorized");
// //     }
// //   } catch (err) {

// //     console.log(err);
// //     return res.status(400).send("Bad Request");
// //   }
// // });



// // // create new user end point with sequelize 
// // app.post("/v1/account", async (req, res) => {
// //   try {
// //     const hash = await bcrypt.hash(req.body.password, 10);
// //     const newuser = await User.create({
// //       FirstName: req.body.FirstName,
// //       LastName: req.body.LastName,
// //       EmailId: req.body.EmailID,
// //       password: hash,
// //     });

// //     newuser.password = undefined;
// //     return res.status(201).send(newuser);
// //   } catch (err) {

// //     return res.status(400).send(err);
// //   }
// // });

// // app.put("/v1/account/:id", async (req, res) => {
// //   // Checking  any other fields than the editable fields
// //   try {
// //     const bodyfields = req.body;
// //     for (let x in bodyfields) {
// //       if (
// //         x != "first_name" &&
// //         x != "last_name" &&
// //         x != "password" &&
// //         x != "username"
// //       ) {
// //         return res.status(400).send("Bad Request");
// //       }
// //     }

// //     auth = Basicauthentication(req, res);
// //     var user = auth[0];
// //     var pass = auth[1];

// //     const dbAcc = await User.findOne({
// //       where: {
// //         username: user,
// //       },
// //     });
// //     if (dbAcc) {

// //       const validPass = bcrypt.compareSync(pass, dbAcc.password);
// //       if (validPass) {
// //         if (req.params.id === dbAcc.id) {
// //           const Hpassword = req.body.password || pass
// //           const first = req.body.first_name || dbAcc.first_name
// //           const last = req.body.last_name || dbAcc.last_name

// //           const hash = bcrypt.hashSync(Hpassword, 10);
// //           const Accu = await User.update({
// //             first_name: first,
// //             last_name: last,
// //             password: hash
// //           }, {
// //             where: {
// //               username: user,
// //             },
// //           });

// //           return res.status(200).send("");

// //         } else {
// //           return res.status(403).send("Forbidden");
// //         }
// //       } else {
// //         return res.status(401).send("Unauthorized");
// //       }
// //     } else {
// //       return res.status(401).send("Unauthorized");
// //     }
// //   } catch (err) {
// //     console.log(err);
// //     return res.status(400).send("Bad Request");
// //   }
// // });
// app.put("/v1/account/:id", (req, res) => {
//   try {
//     const ClientID = req.params.id;
//     const EncodedUserPass = req.headers.authorization.split(" ")[1];
//     const DecodedUserPass = Buffer.from(EncodedUserPass, "base64").toString(
//       "ascii"
//     );
//     const DecodedUser = DecodedUserPass.split(":")[0];
//     const DecodedPass = DecodedUserPass.split(":")[1];
//     User.findOne({ where: { EmailId: DecodedUser, id: ClientID } }).then(
//       (result) => {
//         if (result === null) {
//           res.status(200);
//           res.send({ Output: "Client Not Found" });
//         } else {
//           bcrypt.compare(
//             DecodedPass,
//             result.dataValues.Password,
//             function async(err, authenticated) {
//               if (authenticated) {
//                 User.update(req.body, { where: { id: ClientID } }).then(
//                   (result) => {
//                     User.findOne({
//                       where: { EmailId: DecodedUser, id: ClientID },
//                     }).then((UpdatedResult) => {
//                       console.log(UpdatedResult);
//                       UpdatedResult.dataValues.Password = undefined;
//                       res.status(200).send(UpdatedResult);
//                     });
//                   }
//                 );
//               } else {
//                 res.status(200);
//                 res.send({ Output: "Wrong password" });
//               }
//             }
//           );
//         }
//       }
//     );
//   } catch (err) {
//     return res.status(400).send("Client Not Found");
//   }
// });

  app.post('/upload', upload.single('file'), (req, res)=> {
    // console.log(req.file);
    res.send("File Uploaded"+ req.file.location+ ' Location!');
  });

// Document upload End point

// endpoint to upload the document 
const Ufile = upload.single("file");
app.post("/v1/upload", async (req, res) => {
  try {
    const ClientID = req.params.id;
    const EncodedUserPass = req.headers.authorization.split(" ")[1];
    const DecodedUserPass = Buffer.from(EncodedUserPass, "base64").toString(
      "ascii"
    );
    const DecodedUser = DecodedUserPass.split(":")[0];
    const DecodedPass = DecodedUserPass.split(":")[1];
    User.findOne({ where: { EmailId: DecodedUser, id: ClientID } }).then(
      (result) => {
        if (result === null) {
          res.status(200);
          res.send({ Output: "Client Not Found" });
        } else {
          bcrypt.compare(
            DecodedPass,
            result.dataValues.Password,
            function async(err, authenticated) {
              if (authenticated) {
                Ufile(req, res, async (err) => {
                  if (err) {
                    res.status(400)
                    res.send({ Output: "Error in uploading the file" });
                  } else {
                    const newDoc = await Document.create({
                      ClientId: ClientID,
                      DocumentName: req.file.originalname,
                      DocumentType: req.file.mimetype,
                      DocumentData: req.file.buffer,
                    });
                    res.status(201)
                    res.send(newDoc, { Output: "File Uploaded Successfully" });
                  }
                });
              }else {
                res.status(200);
                res.send({ Output: "Wrong password" });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    return res.status(400).send("Client Not Found");
  }
//   try {
//     auth = Basicauthentication(req, res);
//     var userName = auth[0];
//     var passWord = auth[1];
//     const client = await User.findOne({
//       where: {
//         username: userName,
//       },
//     });
//     if (client) {
//       const CorrectPass = bcrypt.compareSync(passWord, client.password);
//       if (CorrectPass) {
//         Ufile(req, res, async (err) => {
//           if (err) {
//             res.status(400).send("Bad Request");
//           }
//           const docx = await Document.create({
//             user_id: client.id,
//             name: req.file.key,
//             s3_bucket_path: req.file.location
//           });

//           res.status(201).send(docx);

//         });
//       } else {
//         return res.status(401).send("Unauthorized");
//       }
//     } else {
//       return res.status(401).send("Unauthorized");
//     }
//   } catch (err) {

//     console.log(err);
//     return res.status(400).send("Bad Request");
//   }
}
);

User.sequelize.sync().then((req) => {
  app.listen(3080, () => {
    console.log(`Server listening on the port:::::: 3080`);
  });
});