// src/index.js
import express, { Express, NextFunction,Request,Response,ErrorRequestHandler} from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm"
import {User,Admin,Chat} from './models'
const cors = require('cors')

import {initWebRoutes,initUserRoutes,initAdminRoutes} from './routes'
dotenv.config();
const bodyParser = require("body-parser");

const app: Express = express();
app.use(cors())
const port = 8087
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); 
  } else {
    bodyParser.json()(req, res, next);
  }
});



app.use("/assets", express.static("src/assets"));





initWebRoutes(app)
initUserRoutes(app)
initAdminRoutes(app)
const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: 'postgres',
  password: 'pop130982',
  database: 'extensionbackend',
  entities: [User,Admin,Chat],
  synchronize: true,
  logging: false,
})

app.use((err:ErrorRequestHandler,req:Request,res:Response,next:NextFunction)=>{
      res.status(500).send({
        message:err
      })
})

AppDataSource.initialize()
.then(() => {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})
.catch((error) => console.log(error))


//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