import { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validations/content";
import { ok, handleError } from "@/lib/api";
import { sendMail } from "@/lib/mail";
import { SITE } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const data = contactSchema.parse(await req.json());

    await sendMail({
      to: SITE.email,
      subject: `رسالة تواصل جديدة من ${data.name}`,
      html: `
        <div dir="rtl" style="font-family:Tahoma,Arial">
          <h3>رسالة جديدة عبر نموذج التواصل</h3>
          <p><b>الاسم:</b> ${data.name}</p>
          <p><b>البريد:</b> ${data.email}</p>
          <p><b>الهاتف:</b> ${data.phone || "—"}</p>
          <p><b>الرسالة:</b></p>
          <p>${data.message.replace(/\n/g, "<br/>")}</p>
        </div>`,
    });

    return ok({ message: "تم استلام رسالتك، سنتواصل معك قريباً." });
  } catch (err) {
    return handleError(err);
  }
}
