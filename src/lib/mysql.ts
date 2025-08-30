import mysql from 'mysql2/promise';

// Database configuration for XAMPP
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // XAMPP default has no password for root
  database: 'neti_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
let pool: mysql.Pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Test database connection
export async function testConnection() {
  try {
    const connection = await getPool().getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Execute query helper
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const [rows] = await getPool().execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
}