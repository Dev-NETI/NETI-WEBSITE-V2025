import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/mysql';

// GET /api/test-db - Test database connection
export async function GET(request: NextRequest) {
  try {
    console.log('Testing MySQL database connection...');
    
    const isConnected = await testConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to neti_db database',
        database: 'neti_db',
        host: 'localhost',
        port: 3306
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to database',
        error: 'Connection failed'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}