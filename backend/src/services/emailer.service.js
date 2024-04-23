
const fetch = require("node-fetch");
const i18n = require("i18n");
i18n.configure({
  locales: ["En", "Mn"],
  directory: __dirname + "/locales",
  defaultLocale: "En",
});

module.exports = {
  deliverEmail: async function (dest, subject, body) {
    var mailOptions = {
      from: "Acme <onboarding@resend.dev>",
      to: [dest],
      subject: subject,
      text: body,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify(mailOptions),
    });

    return res;
  },
};
