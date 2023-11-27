//MODIFICANDO PARA CORREGIR ERRORES
export default {
    app:{
        PERSISTENCE: process.env.PERSISTENCE || 'MONGO',
        PORT: process.env.PORT||8080,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    },
    mongo:{
        URL: process.env.MONGO_URL||'localhost:27017'
    },
    jwt: {
        COOKIE: process.env.JWT_COOKIE,
        SECRET: process.env.JWT_SECRET
    },
      mailer: {
        USER: process.env.GMAIL_USER,
        PASS: process.env.GMAIL_PASSWORD,
      },
    google: {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      }
}

