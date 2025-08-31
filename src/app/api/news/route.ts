import { NextRequest, NextResponse } from 'next/server';
import { getAllNews, createNews, NewsArticle } from '@/lib/news-db';
import { verifyToken } from '@/lib/auth';
import { hasPermission } from '@/lib/middleware';

// GET /api/news - Get all news articles (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    console.log('News API: Getting news with limit:', limitNumber);

    const result = await getAllNews(limitNumber);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to fetch news articles' },
        { status: 500 }
      );
    }

    console.log(`News API: Found ${result.data.length} news articles`);

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('News API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/news - Create new news article (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!hasPermission(decoded.role, 'news_manager')) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'excerpt', 'content', 'category', 'author', 'author_title', 'date', 'readTime', 'image'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const newsData: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at' | 'views'> = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      author: body.author,
      author_title: body.author_title,
      date: body.date,
      readTime: body.readTime,
      image: body.image,
      featured: body.featured || false,
      status: body.status || 'draft',
      tags: body.tags || []
    };

    const result = await createNews(newsData);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create news article' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    }, { status: 201 });

  } catch (error) {
    console.error('Create news error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}