// import dotenv from 'dotenv'
// import { Command, Option } from 'commander'

// const program = new Command()

// program.option('-m, --mode <mode>','Modo de trabajo', 'production')
//     .option('-p <port>', 'Puerto del servidor', 8080)

// program.parse()

// dotenv.config({
//     path: program.opts().mode === 'dev' ? './.env.dev' : './.env.prod'
// })


//MODIFICANDO ENTORNOS
export default {
    app:{
        PERSISTENCE: process.env.PERSISTENCE || 'MONGO',
        PORT: process.env.PORT||8080,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        ENV: process.env.ENV
    },
    mongo:{
        URL: process.env.MONGO_URL||'localhost:27017'
    },
    jwt: {
        COOKIE: process.env.JWT_COOKIE,
        SECRET: process.env.JWT_SECRET
    },
      mailer: {
        USER: process.env.NODE_MAILER_USER,
        PASS: process.env.NODE_MAILER_PASSWORD,
      },
    google: {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        KEY_FILE: process.env.GOOGLE_KEY_FILE,
        BUCKET_NAME: process.env.GOOGLE_BUCKET_NAME
      }
}

