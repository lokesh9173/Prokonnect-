import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // For development, we'll auto-generate a testing account if no SMTP provided in .env
    // This allows the user to click the reset link in the terminal without configuring Gmail immediately!
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    } else {
        // Fallback to ethereal.email testing
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
        console.log("⚠️ No SMTP credentials found in .env. Using Ethereal Email for testing.");
    }

    const message = {
        from: `${process.env.FROM_NAME || 'ProKonnect'} <${process.env.FROM_EMAIL || 'noreply@prokonnect.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    
    // Always log the URL so the developer can click it in the terminal
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;
