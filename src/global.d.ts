/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    readonly AUTH0_DOMAIN: string;
    readonly MONGODB_URI: string;
    readonly CLOUD_NAME: string;
    readonly API_KEY: string;
    readonly API_SECRET: string;
  }
}
