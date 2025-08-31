import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, createEvent } from '@/lib/events-db';
import { initializeDatabase } from '@/lib/db';
import type { Event } from '@/lib/events-db';

// GET /api/events - Get all events or filtered events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    // Initialize database if needed
    await initializeDatabase();
    
    const result = await getAllEvents();
    let events = result.success ? result.data || [] : [];

    // Filter by status if provided
    if (status) {
      events = events.filter(event => event.status === status);
    }

    // Sort by date (upcoming first)
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Limit results if specified
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        events = events.slice(0, limitNum);
      }
    }

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch events' 
      },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'date', 'time', 'location', 'description', 'category'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Set defaults for optional fields
    const eventData: Omit<Event, 'id'> = {
      title: body.title,
      date: body.date,
      time: body.time,
      location: body.location,
      description: body.description,
      category: body.category,
      attendees: body.attendees || '0',
      image: body.image || '/assets/images/nttc.jpg',
      status: body.status || 'upcoming',
      max_capacity: body.maxCapacity || 100,
      current_registrations: body.currentRegistrations || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await createEvent(eventData);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to create event' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Event created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create event' 
      },
      { status: 500 }
    );
  }
}