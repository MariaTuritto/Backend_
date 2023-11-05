import MailingService from './service/mailingService.js';

//APLICANDO NODE MAILER:
app.get('/mails', async (req,res)=>{
const mailService = new MailingService();
  //ENVIAMOS CORREO:
  const mailRequest ={
    from: 'YO MISMO',
    to: ['turittomaria@gmail.com'],
    subject: 'PRUEBA MAIL',
    html: `
    <div>
    <h1>Hola, Bienvenido a mi ecommerce</h1>
    <br/>
    <p>Gracias por suscribirte</p>
    </div>
    `
  }

  const mailResult = await mailService.sendMail(mailRequest);

  res.sendStatus(200);

  console.log(mailResult);
})

//LUEGO DONDE APLICO EL LLAMADO DEL MAILREQUEST???
//AL REGISTRARTE O AL FINALIZAR LA COMPRA?? 