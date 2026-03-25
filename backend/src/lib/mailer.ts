import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;

const canSendEmail = !!smtpHost && !!smtpUser && !!smtpPass && !!smtpFrom;

const transporter = canSendEmail
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : null;

export const sendPasswordResetEmail = async (to: string, userName: string, resetUrl: string) => {
  if (!transporter || !smtpFrom) {
    console.warn('SMTP não configurado: e-mail de redefinição não enviado.');
    return;
  }

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject: 'Redefinição de senha - Plataforma de Vídeos',
    text: `Olá, ${userName}!\n\nRecebemos uma solicitação para redefinir sua senha.\n\nAcesse este link para criar uma nova senha:\n${resetUrl}\n\nEste link expira em 1 hora.\n\nSe você não solicitou essa alteração, ignore este e-mail.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="margin-bottom: 12px;">Redefinição de senha</h2>
        <p>Olá, <strong>${userName}</strong>!</p>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#0f4c81;color:#fff;text-decoration:none;border-radius:8px;">
            Redefinir minha senha
          </a>
        </p>
        <p style="font-size: 13px; color: #555;">Ou copie e cole este link no navegador:</p>
        <p style="font-size: 13px; word-break: break-all; color: #555;">${resetUrl}</p>
        <p style="font-size: 12px; color: #777;">Este link expira em 1 hora. Se você não solicitou, ignore este e-mail.</p>
      </div>
    `,
  });
};
