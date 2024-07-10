const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use(express.json()); // parse the data coming from the frontend fecth
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    next();
});

app.post('/referrals', async (req, res) => {
    const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const referral = await prisma.referral.create({
            data: { referrerName, referrerEmail, refereeName, refereeEmail },
        });

        // Send email notification (set up your email details here)
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'your-email@gmail.com',
        //         pass: 'your-email-password',
        //     },
        // });

        // const mailOptions = {
        //     from: 'your-email@gmail.com',
        //     to: refereeEmail,
        //     subject: 'You have been referred!',
        //     text: `Hi ${refereeName},\n\n${referrerName} has referred you to our platform. Please check it out!\n\nBest regards,\nYour Company`,
        // };

        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error('Error sending email:', error);
        //     } else {
        //         console.log('Email sent:', info.response);
        //     }
        // });

        res.status(201).json(referral);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
