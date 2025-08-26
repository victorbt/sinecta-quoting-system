declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string;
        HOST: string
        PORT: string;

        DB_HOST: string;
        DB_PORT: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;
    }
}
