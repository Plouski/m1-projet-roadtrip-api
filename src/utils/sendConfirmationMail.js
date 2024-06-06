const nodemailer = require("nodemailer");
const config = require("../config/config");

async function sendConfirmationEmail(email) {
    try {
        // Créer un transporteur SMTP
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: config.gmail,
                pass: config.gpwd,
            },
        });

        // Définir le contenu de l'e-mail
        let mailOptions = {
            from: config.gmail,
            to: email,
            subject: "Confirmation d'inscription",
            text: "Bonjour, vous êtes maintenant inscrit sur notre site. Merci de votre inscription.",
        };

        // Envoyer l'e-mail
        let info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé : %s', info.messageId);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation', error);
        throw new Error('Erreur lors de l\'envoi de l\'email de confirmation');
    }
}

module.exports = { sendConfirmationEmail };
