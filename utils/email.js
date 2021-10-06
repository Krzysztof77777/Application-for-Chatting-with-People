import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            html: text,
        });
    } catch (error) {
        console.log("email not sent", error);
    }
};

export {
    sendEmail,
}