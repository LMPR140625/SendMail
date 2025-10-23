const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const { Resend} = require('resend');
const port = process.env.PORT || 3009;

app.use(express.json());
const corsOptions = {
  origin: ['https://joseluisplatagonzalezservices.com'], // Specify allowed origins
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions)); // Enable CORS with specified options


app.get("/", (req, res) => {
    res.send("Hello, World lililililililililili!!");
});

app.post('/sendEmail',async (req,res) => {
    console.log("API",process.env.API_KEY_RESEND);
const resend = new Resend(process.env.API_KEY_RESEND);
    console.log("REQUES",req);

    const { data, error } = await resend.emails.send({
     from: 'Acme <onboarding@resend.dev>',
    to: 'jlpg.lrm.lmpr@gmail.com',
    subject: `Nuevo correo de ${req.body.nombre} desde la página web`,
    html: `<p>Se recibió el mensaje ${req.body.mensaje} de parte de parte de ${req.body.nombre} del correo ${req.body.correo}</p>`,
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