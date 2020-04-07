export const node_env = process.env.NODE_ENV as string;
export const port = parseInt(process.env.PORT as string, 10);
export const api_secret = process.env.API_SECRET as string;

// DB Configuration
export const db_url = process.env.DB_URL as string;