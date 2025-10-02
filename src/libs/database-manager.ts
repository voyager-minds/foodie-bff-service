import {Pool, QueryResult, QueryResultRow} from 'pg';

let pool: Pool | undefined;

export const db = {
  getPool(): Pool {
    if (!pool) {
      pool = new Pool({
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT || 8197),
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        max: 4,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
        ssl: process.env.PGSSL === 'true' ? {rejectUnauthorized: false} : undefined,
      });
    }
    return pool;
  },

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    return db.getPool().query<T>(text, params);
  },
  async one<T extends QueryResultRow = QueryResultRow>(text: string, params?: any[]): Promise<T | null> {
    const {rows} = await db.query<T>(text, params);
    return rows[0] ?? null;
  },
};
