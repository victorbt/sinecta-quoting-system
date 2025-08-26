import { ApiServerConfig } from './api.config'

interface ENV {
    NODE_ENV: string | undefined;
    HOST: string | undefined;
    PORT: number | undefined;
    JWT_SECRET: string | undefined;
}

const getConfig = (): ENV => {
    return {
        //API Configs
        NODE_ENV: process.env.NODE_ENV,
        HOST: process.env.HOST,
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        JWT_SECRET: process.env.JWT_SECRET,
    };
};

interface Configs {
    NODE_ENV: string;
    API: ApiServerConfig
}

//(apiConfig:ApiServerConfig,databseConfig:DatabaseConfig)
const getSanitzedConfigs = (config: ENV): Configs => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in .env`);
        }
    }

    return {
        NODE_ENV: config.NODE_ENV as string,
        API: config as ApiServerConfig,
    };
};

const config = getConfig();
const sanitizatedConfigs = getSanitzedConfigs(config)

export const APIConfig = sanitizatedConfigs.API;
export const NODE_ENV = sanitizatedConfigs.NODE_ENV;

export * from './api.config'