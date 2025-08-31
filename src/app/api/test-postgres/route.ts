import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('=== POSTGRES CONNECTION TEST ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
    console.log('POSTGRES_URL preview:', process.env.POSTGRES_URL?.substring(0, 50) + '...');
    
    // Try importing @vercel/postgres
    let sql: unknown;
    try {
      const { sql: sqlImport } = await import('@vercel/postgres');
      sql = sqlImport;
      console.log('@vercel/postgres imported successfully');
    } catch (error) {
      console.log('Failed to import @vercel/postgres:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to import @vercel/postgres',
        details: error instanceof Error ? error.message : 'Unknown error',
        fallback: true
      });
    }

    // Try a simple query with createClient approach with timeout
    try {
      const { createClient } = await import('@vercel/postgres');
      const client = createClient();
      
      console.log('Attempting createClient query with 10s timeout...');
      const startTime = Date.now();
      
      // Add timeout wrapper
      const queryPromise = client.sql`SELECT NOW() as current_time`;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout after 10 seconds')), 10000)
      );
      
      const result = await Promise.race([queryPromise, timeoutPromise]);
      const duration = Date.now() - startTime;
      console.log(`Database query successful with createClient in ${duration}ms:`, result);
      
      return NextResponse.json({
        success: true,
        message: 'Vercel Postgres connection successful with createClient',
        timestamp: (result as { rows: Array<{ current_time: string }> }).rows[0]?.current_time,
        duration: duration,
        fallback: false
      });
    } catch (dbError) {
      console.log('Database query failed with createClient:', dbError);
      
      // Try with sql template literal without pooling
      try {
        const result = await (sql as (template: TemplateStringsArray, ...values: unknown[]) => Promise<{ rows: Array<{ current_time: string }> }>)`SELECT NOW() as current_time`;
        console.log('Database query successful with sql template:', result);
        
        return NextResponse.json({
          success: true,
          message: 'Vercel Postgres connection successful with sql template',
          timestamp: (result as { rows: Array<{ current_time: string }> }).rows[0]?.current_time,
          fallback: false
        });
      } catch (sqlError) {
        console.log('Both connection methods failed:', sqlError);
        return NextResponse.json({
          success: false,
          error: 'All database connection methods failed',
          details: sqlError instanceof Error ? sqlError.message : 'Unknown error',
          fallback: true
        });
      }
    }
    
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test endpoint error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}