const nodemailer = require('nodemailer')

async function sendEmail(to, subject , text) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        }

        await transporter.sendMail(mailOptions)
    }
    catch(err) {
        console.error("Error sending mail: ", err)
    }
}

module.exports = sendEmail