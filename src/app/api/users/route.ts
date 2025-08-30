import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createUser } from '@/lib/user-db';
import { initializeDatabase } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Initialize the database on server start
let dbInitialized = false;

async function ensureDatabaseInitialized() {
  if (!dbInitialized) {
    try {
      const result = await initializeDatabase();
      if (result.success) {
        dbInitialized = true;
      } else {
        console.error('Failed to initialize database:', result.error);
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }
}

// GET /api/users - Get all users
export async function GET() {
  try {
    await ensureDatabaseInitialized();
    
    // Check authentication
    const cookieStore = cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const admin = await verifyToken(token);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if user has permission to view users
    if (admin.role !== 'super_admin' && admin.role !== 'user_manager') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const result = await getAllUsers();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      users: result.data
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseInitialized();
    
    // Check authentication
    const cookieStore = cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const admin = await verifyToken(token);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if user has permission to create users
    if (admin.role !== 'super_admin' && admin.role !== 'user_manager') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { email, name, password, role } = body;
    
    // Validate required fields
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Validate role
    const validRoles = ['super_admin', 'events_manager', 'news_manager', 'user_manager'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Only super_admin can create other super_admins
    if (role === 'super_admin' && admin.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Only super administrators can create other super administrators' },
        { status: 403 }
      );
    }
    
    const result = await createUser({
      email,
      name,
      password,
      role,
      created_by: admin.id
    });
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: result.data
    }, { status: 201 });
    
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}