import nodemailer from "nodemailer";
import { env } from "./env";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!env.isSmtpEnabled()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    });
  }
  return transporter;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  const t = getTransporter();
  if (!t) {
    // SMTP not configured — log so dev flow still works.
    console.warn(
      `[MAIL] SMTP disabled. Would send to ${opts.to}: ${opts.subject}`,
    );
    return { skipped: true };
  }
  await t.sendMail({ from: env.SMTP_FROM, ...opts });
  return { skipped: false };
}

export function resetEmailTemplate(name: string, link: string) {
  return `
  <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#faf5ec;padding:32px">
    <div style="max-width:520px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee">
      <div style="background:#5a2828;color:#fff;padding:24px;text-align:center">
        <h2 style="margin:0">مؤسسة النخبة للعلوم الصينية</h2>
      </div>
      <div style="padding:28px;color:#333;line-height:1.9">
        <p>مرحباً ${name}،</p>
        <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. اضغط على الزر أدناه لإتمام العملية. الرابط صالح لمدة ساعة واحدة.</p>
        <p style="text-align:center;margin:28px 0">
          <a href="${link}" style="background:#5a2828;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;display:inline-block">إعادة تعيين كلمة المرور</a>
        </p>
        <p style="color:#888;font-size:13px">إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة بأمان.</p>
      </div>
    </div>
  </div>`;
}
