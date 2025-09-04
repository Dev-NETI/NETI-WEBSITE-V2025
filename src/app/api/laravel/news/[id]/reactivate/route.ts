import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_URL = 'http://localhost:8000/api';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PATCH /api/laravel/news/[id]/reactivate - Reactivate news article (proxy to Laravel with auth)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Get the Laravel Sanctum token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required - no bearer token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const response = await fetch(`${LARAVEL_API_URL}/news/${id}/reactivate`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Laravel News REACTIVATE proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}