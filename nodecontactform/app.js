const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

const PORT = 3000;

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

 
  let transporter = nodemailer.createTransport({  //use SMTP
    host: 'mail.YOURDOMAIN.com',
    port: 587,
    secure: false,
    auth: {
        user: 'YOUR email', 
        pass: 'YOURPASSWORD' 
    },
    tls:{
      rejectUnauthorized:false
    }
  });

 
  let mailOptions = {
      from: '"Nodemailer Contact" <your@email.com>', 
      to: 'RECEIVEREMAILS', 
      subject: 'Node Contact Request',
      text: 'Hello world?',
      html: output 
  };


  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(PORT, () => console.log('Server started...'));