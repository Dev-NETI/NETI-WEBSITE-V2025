import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, createEvent, Event } from '@/lib/database';

// GET /api/events - Get all events or filtered events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    let events = await getAllEvents();

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
    const eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = {
      title: body.title,
      date: body.date,
      time: body.time,
      location: body.location,
      description: body.description,
      category: body.category,
      attendees: body.attendees || '0',
      image: body.image || '/assets/images/nttc.jpg',
      status: body.status || 'upcoming',
      maxCapacity: body.maxCapacity || 100,
      currentRegistrations: body.currentRegistrations || 0,
    };

    const newEvent = await createEvent(eventData);

    return NextResponse.json({
      success: true,
      data: newEvent,
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