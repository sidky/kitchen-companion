import {Client, Pool} from "pg";
import {logger} from "../common/logger";

logger.log('info', process.env.DATABASE_URL);

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});