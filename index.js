const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const { Resend} = require('resend');
const port =3009;

app.use(express.json());

app.post('/sendEmail',async (req,res) => {
    console.log("API",process.env.API_KEY_RESEND);
const resend = new Resend(process.env.API_KEY_RESEND);
    console.log("REQUES",req);

    const { data, error } = await resend.emails.send({
     from: 'Acme <onboarding@resend.dev>',
    to: 'jlpg.lrm.lmpr@gmail.com',
    subject: `Nuevo correo de ${values.nombre} desde la página web`,
    html: `<p>Se recibió el mensaje ${values.mensaje} de parte de ${values.nombre} del correo ${values.correo}</p>`,
    text:''
        });

  if (error) {
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
});

app.listen( port, () => {
    console.log("Listen on poort 3009");
});