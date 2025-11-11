import path from "path";
import * as fs from "fs";
import { randomBytes } from "crypto";

const envPath = path.resolve(__dirname, "../.env");

if (!fs.existsSync(envPath)) {
    console.log('.env file not found, creating a default one.');
    
    const jwtSecret = randomBytes(32).toString('hex');
    const cookieSecret = randomBytes(32).toString('hex');

    const defaultEnv = ['# CIPILAB Backend .env file',
        'API_PORT=3000',
        'AUTH_SALT_ROUNDS=12',
        `JWT_SECRET=${jwtSecret}`,
        `JWT_EXPIRES=60s`,
        `REFRESH_EXPIRES_DAYS=7`,
        `REFRESH_IDLE_EXPIRES_DAYS=30`,
        `REFRESH_TMP_EXPIRES_HOURS=6`,
        `REFRESH_TMP_IDLE_EXPIRES_MINUTES=12`,
        `COOKIE_SECRET=${cookieSecret}`,
    ].join('\n');

    fs.writeFileSync(envPath, defaultEnv);
}