const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const sql = require('mssql');
const { Resend} = require('resend');
const port = process.env.PORT || 3009;

// TODO: Database configuration
const config = {
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  // Notice public keyword in the connection string 
  // if you were to host this server on Azure you wouldn't need the public part
  server: process.env.SQLSERVER_SERVER,
  database: process.env.SQLSERVER_DATABASE,
  options: {
    // THIS IS VERY IMPORTANT - Public endpoint is 3342, default is 1443
    port: 1433, 
    encrypt: true,
  },
};

// Connect to the database
sql.connect(config, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: ['https://joseluisplatagonzalezservices.com','https://blue-caribou-549039.hostingersite.com'], // Specify allowed origins
  optionsSuccessStatus: 200 // For legacy browser support
};


// Prod
app.use(cors(corsOptions)); // Enable CORS with specified options

// Desarrollo
//app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello, World lililililililililili!!");
});

app.post('/sendEmail',async (req,res) => {
const resend = new Resend(process.env.API_KEY_RESEND);
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


//invitacion logic

// Route to insert data into the database
app.get('/getPeople', async(req, res) => {
  try {
    const result = await sql.query`SELECT * FROM INVITADOS`;
    console.log("data freom validate phone",result.recordset);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/insertNewNumber', async (req, res) => {
  try {
    const { telefono } = req.body;
    // Perform the database insert
    const result = await sql.query`INSERT INTO INVITADOS(TELEFONO,FAMILIA,CANTIDADSOLICITADA,CANTIDADREAL,CANTIDADADULTOS,CANTIDADINFANTES,DESEOS,ESTATUS,FECHAREGISTRO)
                                    VALUES ( ${telefono},'',0,0,0,0,'',1,GETDATE())`;

    res.json(result.rowsAffected[0]);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/insertReservation', async (req, res) => {
  try {
    const { familia, telefono, cantidadAsistentes, cantidadAdultos, cantidadInfantes, 
      deseos} = req.body;
    // Perform the database insert
    const result = await sql.query`UPDATE INVITADOS SET FAMILIA = ${familia}, 
    CANTIDADSOLICITADA = ${cantidadAsistentes}, CANTIDADADULTOS = ${cantidadAdultos},
    CANTIDADINFANTES = ${cantidadInfantes},DESEOS = ${deseos},
     ESTATUS = 2,FECHAREGISTRO = GETDATE() WHERE TELEFONO = ${telefono}`;

    res.json(result.rowsAffected[0]);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/validateNumberPhone', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM INVITADOS WHERE TELEFONO = ${req.query.telefono}`;
    console.log("data freom validate phone",result.recordset);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen( port, () => {
    console.log("Listen on poort 3009");
});