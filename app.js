require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { body, validationResult } = require('express-validator')
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

// use public folder
app.use("/public", express.static(path.join(__dirname, "public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

const corsOptions = {
  origin: ["https://amitywarme.com", "http://localhost:4321"],
  optionsSuccessStatus: 200,
};

app.options("/contact", cors(corsOptions));
app.post(
  "/contact", 
  cors(corsOptions), 
  // validate and sanitize fields
  // has to happen before the function!
  body('first_name', "Please provide your name.").trim().notEmpty().escape(),
  body('family_name', "Please provide your family name.").trim().escape(),
  body('email', "Please provide a valid email address.").isEmail().escape(),
  body('message', "Please include a message in your contact request.").trim().notEmpty().escape(),
  (req, res) => {
  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    res.json({ errors: errors.array(), contact: req.body })
    return
  }

  const output = `
    <p>You have a new contact request.</p>
    <h3>Contact Details</h3>
    <ul>
      <li>First Name: ${req.body.first_name}</li>
      <li>Family Name: ${req.body.family_name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message Content</h3>
    <p>${req.body.message}</p>
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.AUTH_A_USER,
      pass: process.env.AUTH_A_PASS,
    },
  });
  
  const mailOptions = {
    from: '"Contact Amity" <contact@amitywarme.com>', // sender address
    to: "amity@amitywarme.com", // list of receivers
    subject: "New Contact Request", // subject line
    html: output, // html body
    replyTo: req.body.email // respond to user
  };
    // async..await is not allowed in global scope, must use a wrapper
  async function main() {
      // send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
  
    console.log("Message sent: %s", info.messageId);
    res.json({ contact: req.body })
  }
  
  main().catch(console.error);
  })

  const corsOptionsC = {
    origin: ["http://localhost:5173", "https://connorwarme.github.io"],
    optionsSuccessStatus: 200,
  };
  
  app.options("/contactconnor", cors(corsOptionsC));
  app.post(
    "/contactconnor", 
    cors(corsOptionsC), 
    body('email').isEmail().normalizeEmail().escape(),
    body('message').trim().notEmpty().escape(),
    (req, res) => {
    const errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() })
      return
    }
  
    const output = `
      <p>You have a new contact request.</p>
      <h3>Contact Details</h3>
      <p>${req.body.email}</p>
      <h3>Message Content</h3>
      <p>${req.body.message}</p>
    `;
  
    const transporterC = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.AUTH_C_USER,
        pass: process.env.AUTH_C_PASS,
      },
    });
    // still need to update these mail options (from, to)
    // still need to set it up with my email, and with domain...
    const mailOptionsC = {
      from: '"Contact Connor" <connorwarme@gmail.com>', // sender address
      to: "connorwarme@gmail.com", // list of receivers
      subject: "New Contact Request", // subject line
      html: output, // html body
      replyTo: req.body.email // respond to user
    };
      // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // send mail with defined transport object
      const info = await transporterC.sendMail(mailOptionsC);
    
      console.log("Message sent: %s", info.messageId);
      res.json({ contact: req.body })
    }
    
    main().catch(console.error);
    })

// mailer for Dad's "Departing Life" site
const corsOptionsD = {
  // needs to be updated with the correct domain
  origin: ["http://localhost:5173", "https://connorwarme.github.io"],
  optionsSuccessStatus: 200,
};

app.options("/contactauthor", cors(corsOptionsD));
app.post(
  "/contactauthor", 
  cors(corsOptionsD), 
  body('email').isEmail().normalizeEmail().escape(),
  body('message').trim().notEmpty().escape(),
  (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.json({ errors: errors.array() })
    return
  }

  const output = `
    <p>You have a new contact request.</p>
    <h3>Contact Details</h3>
    <p>${req.body.email}</p>
    <h3>Message Content</h3>
    <p>${req.body.message}</p>
  `;

  const transporterD = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.AUTH_C_USER,
      pass: process.env.AUTH_C_PASS,
    },
  });
  // still need to update these mail options (from, to)
  // still need to set it up with my email, and with domain...
  const mailOptionsD = {
    from: '"Contact" <connorwarme@gmail.com>', // sender address
    to: "connor.warme@gmail.com", // list of receivers
    subject: "New Contact Request", // subject line
    html: output, // html body
    replyTo: req.body.email // respond to user
  };
    // async..await is not allowed in global scope, must use a wrapper
  async function main() {
      // send mail with defined transport object
    const info = await transporterD.sendMail(mailOptionsD);
  
    console.log("Message sent: %s", info.messageId);
    res.json({ contact: req.body })
  }
  
  main().catch(console.error);
  })
// fly.io port is 8080
const port = process.env.PORT || "8080";

app.listen(port);
