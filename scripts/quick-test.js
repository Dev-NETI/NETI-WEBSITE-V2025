const { sql } = require('@vercel/postgres');

async function quickTest() {
  console.log('🔍 Quick connection test with sql template...');
  
  // Set the connection string directly  
  process.env.POSTGRES_URL = "postgres://9e05d09b82479451a659264c3977e30d099c3f97f1431e7fc13f000a6b471aed:sk_xOICESIUgNVmpZmeWwPx2@db.prisma.io:5432/postgres?sslmode=require";
  
  const startTime = Date.now();
  console.log('🚀 Starting query with sql template...');
  
  try {
    // Simple test query
    const result = await sql`SELECT 1 as test`;
    const endTime = Date.now();
    console.log(`✅ Query successful in ${endTime - startTime}ms`);
    console.log('Result:', result.rows[0]);
  } catch (error) {
    const endTime = Date.now();
    console.error(`❌ Query failed after ${endTime - startTime}ms:`, error);
    
    // Try createClient approach as fallback
    console.log('Trying createClient approach...');
    const { createClient } = require('@vercel/postgres');
    process.env.POSTGRES_URL_NON_POOLING = process.env.POSTGRES_URL;
    
    try {
      const client = createClient();
      const result2 = await client.sql`SELECT 1 as test`;
      const endTime2 = Date.now();
      console.log(`✅ createClient successful in ${endTime2 - startTime}ms`);
      console.log('Result:', result2.rows[0]);
    } catch (error2) {
      const endTime2 = Date.now();
      console.error(`❌ createClient also failed after ${endTime2 - startTime}ms:`, error2);
    }
  }
}

quickTest();