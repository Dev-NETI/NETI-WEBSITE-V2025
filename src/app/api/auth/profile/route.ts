import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/auth/profile - Get current user profile with permissions
export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies();
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
    
    // Define permissions based on role
    const PERMISSIONS = {
      super_admin: ['users', 'events', 'news', 'settings'],
      user_manager: ['users'],
      events_manager: ['events'],
      news_manager: ['news'],
      admin: ['users', 'events', 'news', 'settings'] // Legacy admin role
    };
    
    const permissions = PERMISSIONS[admin.role as keyof typeof PERMISSIONS] || [];
    
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        lastLogin: admin.lastLogin
      },
      permissions
    });
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}