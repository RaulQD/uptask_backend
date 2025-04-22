import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'UpTask - Confirma tu cuenta',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4; color: #333;">
                    <div style="max-width: 600px; margin: auto; background-color: white; padding: 40px; border-radius: 8px;">
                        <h1 style="font-size: 32px;">¡Estás a un clic de confirmar tu cuenta!</h1>
                        <div style="background-color: #ff6600; padding: 20px ">
                            <h1 style="color: white;">Hola ${user.name},</h1>
                            <p>Has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                        </div>
                        <p>Visita el siguiente enlace:</p>
                        <a href="${process.env.FRONTEND_URL}/auth/confirm-account" style="display: inline-block; background-color: #ffe6d5; color: white; padding: 12px 20px; font-size: 16px; border-radius: 4px; text-decoration: none; margin-top: 20px;">Confirmar cuenta</a>
                        <p>E ingresa el código: <b>${user.token}</b></p>
                        <p>Este token expira en 10 minutos</p>
                    </div>
                </div>
           
              
            `
        })

        console.log('Mensaje enviado', info.messageId)
    }

    static sendPasswordResetToken = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Reestablece tu password',
            text: 'UpTask - Reestablece tu password',
            html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        })

        console.log('Mensaje enviado', info.messageId)
    }
}