import { executeQuery } from './mysql';

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
  maxCapacity?: number;
  currentRegistrations?: number;
  createdAt: string;
  updatedAt: string;
}

// Fallback default events if database connection fails

// Default events for fallback
function getDefaultEvents(): Event[] {
  return [
    {
      id: "1",
      title: "Maritime Safety Symposium 2025",
      date: "2025-01-15",
      time: "9:00 AM - 5:00 PM",
      location: "NETI Training Center, Calamba",
      description:
        "Join industry experts for comprehensive discussions on the latest maritime safety protocols, regulations, and best practices. This symposium will feature keynote speakers from leading maritime organizations.",
      category: "Symposium",
      attendees: "200+",
      image: "/assets/images/nttc.jpg",
      status: "registration-open",
      maxCapacity: 250,
      currentRegistrations: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Bridge Simulation Training Workshop",
      date: "2025-01-22",
      time: "8:00 AM - 4:00 PM",
      location: "NETI Simulation Center",
      description:
        "Hands-on training using our state-of-the-art bridge simulation technology. Perfect for maritime officers looking to enhance their navigation and decision-making skills.",
      category: "Workshop",
      attendees: "30",
      image: "/assets/images/nyk.png",
      status: "registration-open",
      maxCapacity: 30,
      currentRegistrations: 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Digital Maritime Education Conference",
      date: "2025-02-05",
      time: "10:00 AM - 6:00 PM",
      location: "Virtual Event",
      description:
        "Explore the future of maritime education through digital technologies, VR training, and e-learning platforms. Network with educators and technology providers.",
      category: "Conference",
      attendees: "500+",
      image: "/assets/images/tdg.png",
      status: "upcoming",
      maxCapacity: 500,
      currentRegistrations: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "NETI Open House 2025",
      date: "2025-02-12",
      time: "9:00 AM - 3:00 PM",
      location: "NETI Training Center, Calamba",
      description:
        "Tour our facilities, meet our instructors, and learn about our comprehensive maritime training programs. Information sessions for prospective students and their families.",
      category: "Open House",
      attendees: "150+",
      image: "/assets/images/nttc.jpg",
      status: "registration-open",
      maxCapacity: 200,
      currentRegistrations: 34,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}


// Read all events from MySQL database
export async function getAllEvents(): Promise<Event[]> {
  try {
    console.log('Fetching events from MySQL database...');
    
    const query = `
      SELECT 
        id,
        title,
        date,
        time,
        location,
        description,
        category,
        attendees,
        image,
        status,
        maxCapacity,
        currentRegistrations,
        createdAt,
        updatedAt
      FROM events 
      ORDER BY date ASC
    `;
    
    const events = await executeQuery<Event>(query);
    
    // Convert database results to proper format
    const formattedEvents: Event[] = events.map(event => ({
      ...event,
      id: event.id.toString(),
      attendees: event.attendees.toString(),
      maxCapacity: event.maxCapacity || 100,
      currentRegistrations: event.currentRegistrations || 0,
      createdAt: new Date(event.createdAt).toISOString(),
      updatedAt: new Date(event.updatedAt).toISOString(),
    }));
    
    console.log(`Successfully fetched ${formattedEvents.length} events from database`);
    return formattedEvents;
    
  } catch (error) {
    console.error("Error fetching events from database:", error);
    
    // Fallback to default events if database fails
    console.log("Falling back to default events...");
    return getDefaultEvents();
  }
}

// Get event by ID from MySQL database
export async function getEventById(id: string): Promise<Event | null> {
  try {
    console.log(`Fetching event with ID: ${id} from MySQL database...`);
    
    const query = `
      SELECT 
        id,
        title,
        date,
        time,
        location,
        description,
        category,
        attendees,
        image,
        status,
        maxCapacity,
        currentRegistrations,
        createdAt,
        updatedAt
      FROM events 
      WHERE id = ?
      LIMIT 1
    `;
    
    const events = await executeQuery<Event>(query, [id]);
    
    if (events.length === 0) {
      return null;
    }
    
    const event = events[0];
    const formattedEvent: Event = {
      ...event,
      id: event.id.toString(),
      attendees: event.attendees.toString(),
      maxCapacity: event.maxCapacity || 100,
      currentRegistrations: event.currentRegistrations || 0,
      createdAt: new Date(event.createdAt).toISOString(),
      updatedAt: new Date(event.updatedAt).toISOString(),
    };
    
    console.log(`Successfully fetched event: ${formattedEvent.title}`);
    return formattedEvent;
    
  } catch (error) {
    console.error("Error getting event by ID from database:", error);
    return null;
  }
}

// Create new event in MySQL database
export async function createEvent(
  eventData: Omit<Event, "id" | "createdAt" | "updatedAt">
): Promise<Event> {
  try {
    console.log('Creating new event in MySQL database...');
    
    const now = new Date();
    const query = `
      INSERT INTO events (
        title,
        date,
        time,
        location,
        description,
        category,
        attendees,
        image,
        status,
        maxCapacity,
        currentRegistrations,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      eventData.title,
      eventData.date,
      eventData.time,
      eventData.location,
      eventData.description,
      eventData.category,
      eventData.attendees || '0',
      eventData.image || '/assets/images/nttc.jpg',
      eventData.status || 'upcoming',
      eventData.maxCapacity || 100,
      eventData.currentRegistrations || 0,
      now,
      now
    ];
    
    const result = await executeQuery(query, values);
    
    // Get the created event
    const insertId = (result as any).insertId;
    const createdEvent = await getEventById(insertId.toString());
    
    if (!createdEvent) {
      throw new Error('Failed to retrieve created event');
    }
    
    console.log(`Successfully created event: ${createdEvent.title}`);
    return createdEvent;
    
  } catch (error) {
    console.error("Error creating event in database:", error);
    throw error;
  }
}

// Update event in MySQL database
export async function updateEvent(
  id: string,
  eventData: Partial<Omit<Event, "id" | "createdAt">>
): Promise<Event | null> {
  try {
    console.log(`Updating event with ID: ${id} in MySQL database...`);
    
    const now = new Date();
    const updateFields: string[] = [];
    const values: any[] = [];
    
    // Build dynamic update query
    Object.entries(eventData).forEach(([key, value]) => {
      if (key !== 'updatedAt' && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (updateFields.length === 0) {
      console.log('No fields to update');
      return await getEventById(id);
    }
    
    // Add updatedAt field
    updateFields.push('updatedAt = ?');
    values.push(now);
    values.push(id); // for WHERE clause
    
    const query = `
      UPDATE events 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    await executeQuery(query, values);
    
    // Get the updated event
    const updatedEvent = await getEventById(id);
    
    if (updatedEvent) {
      console.log(`Successfully updated event: ${updatedEvent.title}`);
    }
    
    return updatedEvent;
    
  } catch (error) {
    console.error("Error updating event in database:", error);
    throw error;
  }
}

// Delete event from MySQL database
export async function deleteEvent(id: string): Promise<boolean> {
  try {
    console.log(`Deleting event with ID: ${id} from MySQL database...`);
    
    const query = 'DELETE FROM events WHERE id = ?';
    const result = await executeQuery(query, [id]);
    
    // Check if any rows were affected (event existed and was deleted)
    const affectedRows = (result as any).affectedRows;
    
    if (affectedRows === 0) {
      console.log(`No event found with ID: ${id}`);
      return false; // Event not found
    }
    
    console.log(`Successfully deleted event with ID: ${id}`);
    return true;
    
  } catch (error) {
    console.error("Error deleting event from database:", error);
    return false;
  }
}

// Get events by status
export async function getEventsByStatus(
  status: Event["status"]
): Promise<Event[]> {
  try {
    const events = await getAllEvents();
    return events.filter((event) => event.status === status);
  } catch (error) {
    console.error("Error getting events by status:", error);
    return [];
  }
}

// Get upcoming events (sorted by date)
export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  try {
    const events = await getAllEvents();
    const now = new Date();

    const upcomingEvents = events
      .filter((event) => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
  } catch (error) {
    console.error("Error getting upcoming events:", error);
    return [];
  }
}
