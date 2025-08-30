import { DatabaseResult } from './db';
import { eventsDB, EventDocument } from './document-db';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  attendees: string;
  image: string;
  status: "upcoming" | "registration-open" | "completed" | "cancelled";
  max_capacity?: number;
  current_registrations?: number;
  created_at: string;
  updated_at: string;
}

// Get all events - now uses document database
export async function getAllEvents(): Promise<DatabaseResult<Event[]>> {
  try {
    const result = await eventsDB.readAll();
    if (!result.success) {
      return result;
    }

    // Convert EventDocument to Event format (fixing property names)
    const events: Event[] = result.data.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      category: event.category,
      attendees: event.attendees,
      image: event.image,
      status: event.status,
      max_capacity: event.max_capacity,
      current_registrations: event.current_registrations,
      created_at: event.created_at,
      updated_at: event.updated_at
    }));

    return { success: true, data: events };
  } catch (error) {
    console.error('Error getting all events:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get events'
    };
  }
}

// Get event by ID - now uses document database
export async function getEventById(id: string): Promise<DatabaseResult<Event>> {
  try {
    const result = await eventsDB.findById(id);
    if (!result.success) {
      return result;
    }

    // Convert EventDocument to Event format
    const event: Event = {
      id: result.data.id,
      title: result.data.title,
      date: result.data.date,
      time: result.data.time,
      location: result.data.location,
      description: result.data.description,
      category: result.data.category,
      attendees: result.data.attendees,
      image: result.data.image,
      status: result.data.status,
      max_capacity: result.data.max_capacity,
      current_registrations: result.data.current_registrations,
      created_at: result.data.created_at,
      updated_at: result.data.updated_at
    };

    return { success: true, data: event };
  } catch (error) {
    console.error('Error getting event by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get event'
    };
  }
}

// Create new event - now uses document database
export async function createEvent(
  eventData: Omit<Event, "id" | "created_at" | "updated_at">
): Promise<DatabaseResult<Event>> {
  try {
    const now = new Date().toISOString();

    const newEvent: Omit<EventDocument, 'id'> = {
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      description: eventData.description,
      category: eventData.category,
      attendees: eventData.attendees,
      image: eventData.image,
      status: eventData.status,
      max_capacity: eventData.max_capacity || 100,
      current_registrations: eventData.current_registrations || 0,
      created_at: now,
      updated_at: now
    };

    const result = await eventsDB.create(newEvent);
    if (!result.success) {
      return result;
    }

    // Convert to Event format
    const event: Event = {
      id: result.data.id,
      title: result.data.title,
      date: result.data.date,
      time: result.data.time,
      location: result.data.location,
      description: result.data.description,
      category: result.data.category,
      attendees: result.data.attendees,
      image: result.data.image,
      status: result.data.status,
      max_capacity: result.data.max_capacity,
      current_registrations: result.data.current_registrations,
      created_at: result.data.created_at,
      updated_at: result.data.updated_at
    };

    return { success: true, data: event };
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create event'
    };
  }
}

// Update event - now uses document database
export async function updateEvent(
  id: string,
  eventData: Partial<Omit<Event, "id" | "created_at">>
): Promise<DatabaseResult<Event>> {
  try {
    const updates: Partial<EventDocument> = {
      updated_at: new Date().toISOString()
    };

    if (eventData.title !== undefined) updates.title = eventData.title;
    if (eventData.date !== undefined) updates.date = eventData.date;
    if (eventData.time !== undefined) updates.time = eventData.time;
    if (eventData.location !== undefined) updates.location = eventData.location;
    if (eventData.description !== undefined) updates.description = eventData.description;
    if (eventData.category !== undefined) updates.category = eventData.category;
    if (eventData.attendees !== undefined) updates.attendees = eventData.attendees;
    if (eventData.image !== undefined) updates.image = eventData.image;
    if (eventData.status !== undefined) updates.status = eventData.status;
    if (eventData.max_capacity !== undefined) updates.max_capacity = eventData.max_capacity;
    if (eventData.current_registrations !== undefined) updates.current_registrations = eventData.current_registrations;

    const result = await eventsDB.update(id, updates);
    if (!result.success) {
      return result;
    }

    // Convert to Event format
    const event: Event = {
      id: result.data.id,
      title: result.data.title,
      date: result.data.date,
      time: result.data.time,
      location: result.data.location,
      description: result.data.description,
      category: result.data.category,
      attendees: result.data.attendees,
      image: result.data.image,
      status: result.data.status,
      max_capacity: result.data.max_capacity,
      current_registrations: result.data.current_registrations,
      created_at: result.data.created_at,
      updated_at: result.data.updated_at
    };

    return { success: true, data: event };
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update event'
    };
  }
}

// Delete event - now uses document database
export async function deleteEvent(id: string): Promise<DatabaseResult<boolean>> {
  try {
    const result = await eventsDB.delete(id);
    return result;
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete event'
    };
  }
}

// Get events by status - now uses document database
export async function getEventsByStatus(status: Event["status"]): Promise<DatabaseResult<Event[]>> {
  try {
    const result = await eventsDB.findWhere(event => event.status === status);
    if (!result.success) {
      return result;
    }

    // Convert EventDocument to Event format
    const events: Event[] = result.data.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      category: event.category,
      attendees: event.attendees,
      image: event.image,
      status: event.status,
      max_capacity: event.max_capacity,
      current_registrations: event.current_registrations,
      created_at: event.created_at,
      updated_at: event.updated_at
    }));

    return { success: true, data: events };
  } catch (error) {
    console.error('Error getting events by status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get events by status'
    };
  }
}

// Get upcoming events - now uses document database
export async function getUpcomingEvents(limit?: number): Promise<DatabaseResult<Event[]>> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await eventsDB.findWhere(event => event.date >= today);
    if (!result.success) {
      return result;
    }

    // Convert EventDocument to Event format
    let events: Event[] = result.data.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      category: event.category,
      attendees: event.attendees,
      image: event.image,
      status: event.status,
      max_capacity: event.max_capacity,
      current_registrations: event.current_registrations,
      created_at: event.created_at,
      updated_at: event.updated_at
    }));

    // Sort by date
    events.sort((a, b) => a.date.localeCompare(b.date));

    // Apply limit if provided
    if (limit) {
      events = events.slice(0, limit);
    }

    return { success: true, data: events };
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get upcoming events'
    };
  }
}