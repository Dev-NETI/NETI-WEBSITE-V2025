import mysql from 'mysql2/promise';

// Database configuration optimized for Vercel serverless
const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'neti_db',
  // Serverless-optimized settings
  waitForConnections: true,
  connectionLimit: 1, // Single connection for serverless
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  // SSL settings for production databases
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false
    }
  })
};

// Global connection cache for serverless functions
declare global {
  var mysql_pool: mysql.Pool | undefined;
}

// Create or reuse connection pool for Vercel serverless
export function getPool() {
  if (!global.mysql_pool) {
    global.mysql_pool = mysql.createPool(dbConfig);
  }
  return global.mysql_pool;
}

// Test database connection with retry logic
export async function testConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await getPool().getConnection();
      await connection.ping();
      connection.release();
      console.log('Database connected successfully');
      return true;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        return false;
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  return false;
}

// Enhanced query execution with connection management
export async function executeQuery<T = unknown>(
  query: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  let connection: mysql.PoolConnection | null = null;
  
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Query execution failed:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Special function for INSERT operations that returns insertId
export async function executeInsert(
  query: string,
  params: unknown[] = []
): Promise<{ insertId: number }> {
  const pool = getPool();
  let connection: mysql.PoolConnection | null = null;
  
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(query, params);
    return result as { insertId: number };
  } catch (error) {
    console.error('Insert execution failed:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Special function for UPDATE/DELETE operations that returns affectedRows
export async function executeUpdate(
  query: string,
  params: unknown[] = []
): Promise<{ affectedRows: number }> {
  const pool = getPool();
  let connection: mysql.PoolConnection | null = null;
  
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(query, params);
    return result as { affectedRows: number };
  } catch (error) {
    console.error('Update execution failed:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Transaction support for complex operations
export async function executeTransaction<T>(
  operations: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await operations(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error('Transaction failed:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Batch query execution for better performance
export async function executeBatch<T = unknown>(
  queries: { query: string; params?: unknown[] }[]
): Promise<T[][]> {
  const pool = getPool();
  let connection: mysql.PoolConnection | null = null;
  
  try {
    connection = await pool.getConnection();
    const results: T[][] = [];
    
    for (const { query, params = [] } of queries) {
      const [rows] = await connection.execute(query, params);
      results.push(rows as T[]);
    }
    
    return results;
  } catch (error) {
    console.error('Batch execution failed:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Utility function for safe database operations
export async function safeExecuteQuery<T = unknown>(
  query: string,
  params: unknown[] = [],
  fallbackValue: T[] = []
): Promise<T[]> {
  try {
    return await executeQuery<T>(query, params);
  } catch (error) {
    console.error('Safe query execution failed, returning fallback:', error);
    return fallbackValue;
  }
}

// Connection health check for monitoring
export async function healthCheck(): Promise<{
  status: 'healthy' | 'unhealthy';
  details: {
    connected: boolean;
    error?: string;
    timestamp: string;
  };
}> {
  try {
    const isConnected = await testConnection(1);
    return {
      status: isConnected ? 'healthy' : 'unhealthy',
      details: {
        connected: isConnected,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    };
  }
}