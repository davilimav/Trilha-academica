const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendResetPasswordEmail(to, name, resetToken) {
        const resetLink = `http://localhost:3000/resetar.html?token=${resetToken}`;
        
        const mailOptions = {
            from: `"Trilha Acadêmica" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Recuperação de Senha - Trilha Acadêmica',
            html: `
                <h2>Olá, ${name}!</h2>
                <p>Recebemos uma solicitação para redefinir sua senha.</p>
                <p>Clique no link abaixo para criar uma nova senha:</p>
                <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; display: inline-block;">
                    Redefinir Senha
                </a>
                <p>Este link é válido por <strong>1 hora</strong>.</p>
                <p>Se você não solicitou, ignore este email.</p>
                <hr>
                <p style="font-size: 12px; color: #666;">Trilha Acadêmica - Seu caminho para o conhecimento</p>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email enviado!');
            console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar email:', error.message);
            return false;
        }
    }

    async sendPasswordChangedEmail(to, name) {
        const mailOptions = {
            from: `"Trilha Acadêmica" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Senha Alterada - Trilha Acadêmica',
            html: `
                <h2>Olá, ${name}!</h2>
                <p>Sua senha foi alterada com sucesso.</p>
                <p>Se você não realizou esta alteração, entre em contato conosco imediatamente.</p>
                <hr>
                <p style="font-size: 12px; color: #666;">Trilha Acadêmica - Seu caminho para o conhecimento</p>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email de confirmação enviado!');
            console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar email:', error.message);
            return false;
        }
    }
}

module.exports = new EmailService();