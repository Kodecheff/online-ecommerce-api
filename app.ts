import express from "express";
import { env } from "process";
import cors from 'cors';
import dotEnv from 'dotenv';
import mongoose from "mongoose";
import fileupload from 'express-fileupload'
import upload from "./middlewares/uploadProduct";
import session, { Session } from 'express-session';
import MongoStore from "connect-mongo";

import productRoutes from "./routes/products/index";
import userRoutes from "./routes/user/index";
import loginRoutes from "./routes/login/index";
import signupRoutes from "./routes/signup/index";

import appLogger from "./middlewares/logger";

const app: express.Application = express();

// configure cors
app.use(cors())

// configure dotenv
dotEnv.config({path: './.env'})


const hostname = process.env.HOST_NAME as string
const port = process.env.PORT as any


// configure middleware
app.use(appLogger);

// configure express to receive form data
// app.use(bodyParser.json())
// app.use(upload.single('coverImage'))
app.use(upload.fields([{name: 'coverImage', maxCount: 1}, {name: 'otherImages', maxCount: 3}]))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sessioning
export interface CustomSession extends Session {
  adminId: string
  userId: string;
  cartId: string
}

app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_DB_LOCAL_URL as string,
    autoRemove: 'native',
    ttl: 12 * 60 * 60
  }),
  secret: 'some-secret-key',
  cookie: {maxAge: 12 * 60 * 60 * 1000},
  saveUninitialized: false,
  resave: false,
}))

// connect to mongodb
let mongo_url: string = process.env.MONGO_DB_LOCAL_URL

if(mongo_url)
  mongoose.connect(mongo_url).then((res) => {
    console.log(`Database is up and running...`)
  }).catch((err) => {
    console.log(err)
    process.exit(1) //Stops the nodejs process
  })

// configure routes
app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/login", loginRoutes);
app.use("/signup", signupRoutes);

app.use('/uploads', express.static('uploads'))

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send("<h2>Welcome to my Express App</h2>");
});

if(hostname && port){
  app.listen(port, hostname, () => {
    console.log(`Now running server on http://${hostname}:${port}`);
  });
}
