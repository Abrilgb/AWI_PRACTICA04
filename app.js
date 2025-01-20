//exportacion de librerias 
import express from 'express';
import session from 'express-session';
import bodyPatser from 'body-parse';
import {v4 as uuidv4} from 'uuid';
import os from 'os';

const app=express();
const PORT=3000;

app.listen(PORT,()=>{
    console.log(`Server iniciado en http://localhost:${PORT}`);
});

app.use(express.json());
app.use(express.urlenconded({extended:true}));

//Sesiones almacenadas de Memoria RAM 

//const sessions ={}
app.use({
    secret: "P4-AGB#yinyerina-sesionesHTTP-VariablesDeSesion",
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:5*60*1000}
});

app.get('/',(req,res)=>{
    return res.status(200).json({
        message: 'Bienvenido al API de control de Sesiones',
        author: 'Abril Guzmán Barrera'
    });
});

//funcion de utilida que nos permite acceder a la informacion de la interfaz de red 
const getLocalIp=()=>{
    const networkInterfaces=os.networkInterfaces();
    for (const interfaceName in networkInterfaces){
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces ){
            //verificamos si la interfaz es internba y si es iPv4
            if (iface.family === "IPv4" && !iface.internal){
                return iface.address;
            } 
        }
    }
    return null ; // returnamos null si no se encuentra una interfaz de red valida 
};

app.post('/login',(req,res)=>{
    const { email, nickname, macAddress } = req.body;
    if (!email || !nickname || !macAddress) {
        return res.status(400).json({
            message: "Se esperan campos requeridos" });
      }
      const sessionId = uuidv4();
      const now = new Date();
    
      sessions[sessionId] = {
        sessionId,
        email,
        nickname,
        macAddress,
        ip: getLocalIp(req),
        createdAt: now,
        lastAccessedAt: now
    };

    res.status(200).json({
        message: "Inicio de sesión exitoso",
        sessionId
      });
});


app.post("/logout", (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId || !sessions[sessionId]) {
      return res.status(404).json({ 
        message: "No se ha encontrado una sesión activa." });
    }
    delete sessions[sessionId];
    res.status(200).json({ 
        message: "Logout echo" });
  });
 


app.post("/update", (req, res) => {
});

app.get("status",(req,res)=>{
    const sessionId= req.query.sessionId
    if (!sessionId || !sessions[sessionId]) {
      return res.status(404).json({ 
        message: "No hay una sesion activa" });
    }
  
    res.status(200).json({
      message: "Sesión actualizada correctamente",
      session: sessions[sessionId]
    });
});