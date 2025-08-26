import 'dotenv/config';

import express, { Application } from "express";
import bodyParser from 'body-parser';
import swaggerUI from "swagger-ui-express";
import swaggerDocument from '../../docs/swagger.json';
import { RegisterRoutes } from "../routes/routes";
// import { errorHandler } from "../handlers/error.handler"

// import { connectToDatabase } from "../database/mongo.service";

import { httpLogger } from '../transport/logger';
import { corsMiddleware, helmetMiddleware, rateLimitMiddleware } from '../transport/security';
import { errorMiddleware } from '../middlewares/error.middleware';

import { logger } from '../transport/logger';

import {
    APIConfig,
    ApiServerConfig,
    // NodeENV
} from './config';
import { prisma } from '../database/prisma/client';


export class ServerApp {
    private app: Application = express();
    private apiConf: ApiServerConfig = APIConfig

    public static new(): ServerApp {
        return new ServerApp();
    }

    public async run(): Promise<void> {
        try {
            await prisma.$connect()
            logger.info('Connected to database')
            //Server
            await this.createExpressApi()
        } catch (error) {
            console.log('RUN_ERROR === ', error)
        }

    }

    public getApp(): Application {
        this.createExpressApi()
        return this.app
    }

    private async createExpressApi() {
        // Express Configs
        this.app.use(express.json({ limit: '2mb' }));
        this.app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(helmetMiddleware());
        this.app.use(corsMiddleware());
        this.app.use(rateLimitMiddleware);
        this.app.use(httpLogger);

        // Routes
        RegisterRoutes(this.app)

        //Docs
        this.serveAPIDocumentation(this.app);

        // Error Handler
        this.app.use(errorMiddleware);

        await this.app.listen(this.apiConf.PORT, this.apiConf.HOST, () => {
            this.log()
        }).on('error', (e) => console.log(e));//logger.error(e));
    }

    private serveAPIDocumentation(app: Application): void {
        if (process.env.NODE_ENV != 'production') {
            this.app.use(
                "/docs",
                swaggerUI.serve,
                swaggerUI.setup(swaggerDocument, { explorer: true })
            );
        }
    }

    private log(): void {
        logger.info(`Server started at http://${this.apiConf.HOST}:${this.apiConf.PORT}`);
    }
}