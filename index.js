require('dotenv').config();  // Ensure dotenv is required at the top


const express = require('express');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 8000;

//app.use(bodyParser.json());
app.use(express.json());

app.use(express.json()); // parse the data coming from the frontend fecth
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    next();
});

app.post('/referrals', async (req, res) => {
    const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;
    console.log(req.body);

    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const referral = await prisma.referral.create({
            data: { referrerName, referrerEmail, refereeName, refereeEmail },
        });
        console.log('Data saved:', referral);

        // Send email notification (set up your email details here)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'resetpass905@gmail.com', // email service id
                pass: 'afkrgeiwdsuhecdl', // email service Password(App Password)
            },
            host: 'smtp.gmail.com',
            secure: false
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: refereeEmail,
            subject: 'You have been referred!',
            text: `Hi ${refereeName},\n\n${referrerName} has referred you to our platform. Please check it out!\n\nBest regards,\nAccerdian`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(201).json(referral);
    } catch (error) {
        console.error('Error saving data:', error.message);
        console.error('Detailed error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
