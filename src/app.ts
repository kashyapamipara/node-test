import compression from 'compression';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { Config } from './config';
import { ApplicationConfig } from './config/application.config';
import { customLogger, getLogger } from './services/logger';
import { IProperty } from './components/property/property.model';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            property: IProperty;
        }
    }
}

config();
const { PORT, mongoDBConnectionUrl: mongoUrl } = Config.server;
const isLocalServer = !!(Config.SERVER_ENV && Config.SERVER_ENV === 'local');
const BODY_PAYLOAD_LIMIT = 100 * 100000; // 1 MB

const MODULE_NAME_FOR_LOG = 'app';
const log = getLogger(MODULE_NAME_FOR_LOG);

export class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        const server = http.createServer(this.app);
        if (process.env.NODE_ENV !== 'test') {
            server.listen(PORT, () => {
                log.warn(`Server is running on port: ${PORT}`);
            });
        }
        this.config();
        this.mongoSetup();
    
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  

    private config(): void {
        this.app.use(compression());
        this.app.use(customLogger[Config.SERVER_ENV]);
        if (!isLocalServer) {
            this.app.use(helmet());
        }
        this.app.use(
            cors({
                origin: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowedHeaders: [
                    'Origin',
                    ' X-Requested-With',
                    ' Content-Type',
                    ' Accept ',
                    ' Authorization',
                    'x-ms-bot-agent',
                    'user-Agent',
                    'isPreviewLink',
                    'x-user-identity',
                ],
                credentials: true,
            }),
        );
        this.app.use(express.json({ limit: BODY_PAYLOAD_LIMIT }));
        this.app.use(
            express.urlencoded({
                extended: false,
                limit: BODY_PAYLOAD_LIMIT,
            }),
        );
        // Allow static serving
        this.app.use(express.static(path.join(__dirname, '../media')));

        // Register Routers.
        ApplicationConfig.registerRoute(this.app);
    }

    private mongoSetup(): void {
        mongoose.connection.on('connected', () => {
            log.warn(`DATABASE - Connected`);
        });

        mongoose.connection.on('error', err => {
            log.error(err, `DATABASE - Error`);
        });

        mongoose.connection.on('disconnected', () => {
            log.warn(`DATABASE - disconnected  Retrying....`);
        });

        const dbOptions: mongoose.ConnectOptions = {
            autoIndex: true,
        };
        try {
             mongoose.connect(mongoUrl, dbOptions);
        } catch (err) {
            log.fatal({ Error: err }, `DATABASE - Error`);
        }
    }
}

export const appInstance = new App();
