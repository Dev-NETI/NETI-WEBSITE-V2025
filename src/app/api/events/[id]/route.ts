import { NextRequest, NextResponse } from 'next/server';
import { getEventById, updateEvent, deleteEvent } from '@/lib/events-db';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/events/[id] - Get a specific event
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event ID is required' 
        },
        { status: 400 }
      );
    }

    const result = await getEventById(id);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Event not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch event' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update a specific event
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event ID is required' 
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Remove fields that shouldn't be updated directly
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: bodyId, createdAt, ...updateData } = body;

    const result = await updateEvent(id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Event not found' 
        },
        { status: result.error === 'Event not found' ? 404 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Event updated successfully',
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update event' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete a specific event
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event ID is required' 
        },
        { status: 400 }
      );
    }

    const result = await deleteEvent(id);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Event not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete event' 
      },
      { status: 500 }
    );
  }
}