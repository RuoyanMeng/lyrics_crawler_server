const nodemailer = require('nodemailer');
const router = require('express').Router();

let transport = nodemailer.createTransport({
    service: 'qq',
    port: 465,
    auth: {
        user: process.env.MAIL_SENDER_ID,
        pass: process.env.MAIL_SENDER_PASS
    }
});


router.route('/send_feedback').post((req, res) => {

    let message = {
        from: process.env.MAIL_SENDER_ID, // Sender address
        to: process.env.MAIL_RECEIVER_ID,        // List of recipients
        subject: req.body.subject, // Subject line
        text: req.body.text // Plain text body
    };

    transport.sendMail(message)
    .then(info=>{
        res.send('Message sent: ' + info.response);
    })
    .catch(err => {
        res.send(err);
    })          
})     





module.exports = router;