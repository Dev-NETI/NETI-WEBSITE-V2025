import { NextRequest, NextResponse } from 'next/server';

const LARAVEL_API_URL = 'http://localhost:8000/api';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/laravel/news/[id] - Get specific news article (proxy to Laravel with auth)
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const response = await fetch(`${LARAVEL_API_URL}/news/${id}${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Laravel News GET proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news article' },
      { status: 500 }
    );
  }
}

// POST /api/laravel/news/[id] - Handle FormData updates with method spoofing
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    
    // Handle FormData with method spoofing
    const formData = await request.formData();
    formData.append('_method', 'PUT'); // Laravel method spoofing for file uploads

    const response = await fetch(`${LARAVEL_API_URL}/news/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        // Don't set Content-Type for FormData, let fetch handle it
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Laravel News POST (method spoofing) proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/laravel/news/[id] - Update news article (proxy to Laravel with auth)
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    
    // Get the request body (could be FormData or JSON)
    const contentType = request.headers.get('content-type');
    let body;
    let method = 'PUT';
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle FormData for file uploads - use POST with _method=PUT for Laravel
      body = await request.formData();
      body.append('_method', 'PUT'); // Laravel method spoofing
      method = 'POST';
    } else {
      // Handle JSON for regular updates
      body = await request.json();
      body = JSON.stringify(body);
    }

    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    };

    // Don't set Content-Type for FormData, let fetch handle it
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${LARAVEL_API_URL}/news/${id}`, {
      method,
      headers,
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Laravel News PUT proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/laravel/news/[id] - Delete news article (proxy to Laravel with auth)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const response = await fetch(`${LARAVEL_API_URL}/news/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Laravel News DELETE proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}