import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' });

const DISCORD_PREFIX = process.env.PREFIX
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const SERVER_PORT = process.env.SERVER_PORT

const SERVER_CONFIG = {
    token: DISCORD_BOT_TOKEN,
    prefix: DISCORD_PREFIX,
    port: SERVER_PORT
};

const config = { server: SERVER_CONFIG };

export default config;
