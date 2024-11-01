const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send', async (req, res) => {
    const { to, subject, text } = req.body;

    // Configurar transporte
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nonreplycomision@gmail.com',
            pass: 'corx qacf zaaz ihhf'
        }
    });

    // Configurar correo
    const mailOptions = {
        from: 'Comisión de equiparación de oportunidades',
        to: to,
        subject: subject,
        html: text
    };

    try {
        // Enviar correo
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error enviando correo:', error);
        res.status(500).json({ error: 'Error enviando el correo.' });
    }
});

module.exports = router;
