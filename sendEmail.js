import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    service:"Mailgun",
    auth: {
        user:process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASS
    }
})

const sendContactEmail = async (name, email, message,next) => {
    const mailOptions = {
        from: "Dev Dou "+process.env.MAILGUN_USER,
        to: "DevDou180@gmail.com",
        subject: `Contact Message from ${name}`,
        text: `You have received a contact email from ${name}. \nEmail: ${email}\nMessage: ${message}`,
        html: `
        <h2>Contact Email Received</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <hr>
        <p><em>This message was sent via the contact form on your website.</em></p>
        `   
    }
    
    try {
        await transporter.sendMail(mailOptions);
    } catch (e) {
        next(e)
    }
}

const sendConfirmationEmail = async (email,next) => {
    const mailOptions = {
        from: "Dev Dou "+process.env.MAILGUN_USER,
        to: email,
        subject: "Confirmation of Your Contact Request",
        text: "Thank you for reaching out. Your contact request has been successfully received. We will respond to you shortly.",
        html: `
        <h2>Your Contact Request Has Been Successfully Submitted</h2>
        <p><strong>Thank you for reaching out to DevDou.</strong><br> We have successfully received your contact request and will get back to you as soon as possible.</p>
        <hr>
        `
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (e) {
        next(e)
    }
}


export {sendContactEmail,sendConfirmationEmail}               