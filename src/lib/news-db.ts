import { DatabaseResult } from './user';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  author_title: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  views: number;
  created_at: string;
  updated_at: string;
}

// This function only runs on the server side
async function getNewsData(): Promise<NewsArticle[]> {
  if (typeof window !== 'undefined') {
    throw new Error('News database operations can only be performed on the server side');
  }

  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const dataPath = path.join(process.cwd(), 'data', 'news.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data) as NewsArticle[];
  } catch (error) {
    console.error('Error reading news data:', error);
    return [];
  }
}

async function saveNewsData(news: NewsArticle[]): Promise<void> {
  if (typeof window !== 'undefined') {
    throw new Error('News database operations can only be performed on the server side');
  }

  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const dataPath = path.join(process.cwd(), 'data', 'news.json');
    await fs.writeFile(dataPath, JSON.stringify(news, null, 2));
  } catch (error) {
    console.error('Error saving news data:', error);
    throw error;
  }
}

export async function getAllNews(limit?: number): Promise<DatabaseResult<NewsArticle[]>> {
  try {
    const news = await getNewsData();
    const publishedNews = news
      .filter(article => article.status === 'published')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    const result = limit ? publishedNews.slice(0, limit) : publishedNews;
    
    return {
      success: true,
      data: result,
      count: result.length
    };
  } catch (error) {
    console.error('Error getting all news:', error);
    return {
      success: false,
      error: 'Failed to fetch news articles'
    };
  }
}

export async function getNewsById(id: string): Promise<DatabaseResult<NewsArticle>> {
  try {
    const news = await getNewsData();
    const article = news.find(n => n.id === id);
    
    if (!article) {
      return {
        success: false,
        error: 'News article not found'
      };
    }

    return {
      success: true,
      data: article
    };
  } catch (error) {
    console.error('Error getting news by ID:', error);
    return {
      success: false,
      error: 'Failed to fetch news article'
    };
  }
}

export async function getNewsBySlug(slug: string): Promise<DatabaseResult<NewsArticle>> {
  try {
    const news = await getNewsData();
    const article = news.find(n => n.slug === slug);
    
    if (!article) {
      return {
        success: false,
        error: 'News article not found'
      };
    }

    return {
      success: true,
      data: article
    };
  } catch (error) {
    console.error('Error getting news by slug:', error);
    return {
      success: false,
      error: 'Failed to fetch news article'
    };
  }
}

export async function getFeaturedNews(limit: number = 3): Promise<DatabaseResult<NewsArticle[]>> {
  try {
    const news = await getNewsData();
    const featuredNews = news
      .filter(article => article.status === 'published' && article.featured)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
    
    return {
      success: true,
      data: featuredNews,
      count: featuredNews.length
    };
  } catch (error) {
    console.error('Error getting featured news:', error);
    return {
      success: false,
      error: 'Failed to fetch featured news articles'
    };
  }
}

export async function createNews(newsData: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at' | 'views'>): Promise<DatabaseResult<NewsArticle>> {
  try {
    const news = await getNewsData();
    const newArticle: NewsArticle = {
      ...newsData,
      id: `news_${Date.now()}`,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    news.push(newArticle);
    await saveNewsData(news);

    return {
      success: true,
      data: newArticle
    };
  } catch (error) {
    console.error('Error creating news:', error);
    return {
      success: false,
      error: 'Failed to create news article'
    };
  }
}

export async function updateNews(id: string, updates: Partial<NewsArticle>): Promise<DatabaseResult<NewsArticle>> {
  try {
    const news = await getNewsData();
    const index = news.findIndex(n => n.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'News article not found'
      };
    }

    news[index] = {
      ...news[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    await saveNewsData(news);

    return {
      success: true,
      data: news[index]
    };
  } catch (error) {
    console.error('Error updating news:', error);
    return {
      success: false,
      error: 'Failed to update news article'
    };
  }
}

export async function deleteNews(id: string): Promise<DatabaseResult<boolean>> {
  try {
    const news = await getNewsData();
    const index = news.findIndex(n => n.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'News article not found'
      };
    }

    news.splice(index, 1);
    await saveNewsData(news);

    return {
      success: true,
      data: true
    };
  } catch (error) {
    console.error('Error deleting news:', error);
    return {
      success: false,
      error: 'Failed to delete news article'
    };
  }
}

export async function incrementNewsViews(id: string): Promise<DatabaseResult<NewsArticle>> {
  try {
    const news = await getNewsData();
    const index = news.findIndex(n => n.id === id);
    
    if (index === -1) {
      return {
        success: false,
        error: 'News article not found'
      };
    }

    news[index].views += 1;
    news[index].updated_at = new Date().toISOString();

    await saveNewsData(news);

    return {
      success: true,
      data: news[index]
    };
  } catch (error) {
    console.error('Error incrementing news views:', error);
    return {
      success: false,
      error: 'Failed to increment news views'
    };
  }
}

export async function getNewsByCategory(category: string, limit?: number): Promise<DatabaseResult<NewsArticle[]>> {
  try {
    const news = await getNewsData();
    const categoryNews = news
      .filter(article => article.status === 'published' && article.category === category)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    const result = limit ? categoryNews.slice(0, limit) : categoryNews;
    
    return {
      success: true,
      data: result,
      count: result.length
    };
  } catch (error) {
    console.error('Error getting news by category:', error);
    return {
      success: false,
      error: 'Failed to fetch news articles by category'
    };
  }
}