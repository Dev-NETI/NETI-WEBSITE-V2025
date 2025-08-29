import { promises as fs } from "fs";
import path from "path";

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

const DB_PATH = path.join(process.cwd(), "data");
const EVENTS_FILE = path.join(DB_PATH, "events.json");

// Environment variable for events (as JSON string)
const EVENTS_DATA = process.env.EVENTS_DATA;

// In-memory storage for production when file system is not available
let memoryEvents: Event[] | null = null;

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

// Ensure database directory exists
async function ensureDbPath() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true });
  }
}

// Initialize events database with sample data
async function initializeEventsDb() {
  const initialEvents: Event[] = [
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

  try {
    await fs.writeFile(EVENTS_FILE, JSON.stringify(initialEvents, null, 2));
  } catch (error) {
    console.error("Error initializing events database:", error);
    throw error;
  }
}

// Read all events
export async function getAllEvents(): Promise<Event[]> {
  // Try environment variable first (for production)
  if (EVENTS_DATA) {
    try {
      return JSON.parse(EVENTS_DATA);
    } catch (error) {
      console.error("Error parsing EVENTS_DATA environment variable:", error);
    }
  }

  // Use memory storage if available (for production after write operations)
  if (memoryEvents !== null) {
    return memoryEvents;
  }

  // Try file system (for development)
  try {
    await ensureDbPath();

    try {
      const data = await fs.readFile(EVENTS_FILE, "utf8");
      const events = JSON.parse(data);
      memoryEvents = events; // Cache in memory
      return events;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        // File doesn't exist, initialize it
        await initializeEventsDb();
        const data = await fs.readFile(EVENTS_FILE, "utf8");
        const events = JSON.parse(data);
        memoryEvents = events; // Cache in memory
        return events;
      }
      throw error;
    }
  } catch (error) {
    console.error("Error reading events:", error);

    // Fallback to default events if everything fails
    const defaultEvents = getDefaultEvents();
    memoryEvents = defaultEvents;
    return defaultEvents;
  }
}

// Get event by ID
export async function getEventById(id: string): Promise<Event | null> {
  try {
    const events = await getAllEvents();
    return events.find((event) => event.id === id) || null;
  } catch (error) {
    console.error("Error getting event by ID:", error);
    return null;
  }
}

// Create new event
export async function createEvent(
  eventData: Omit<Event, "id" | "createdAt" | "updatedAt">
): Promise<Event> {
  try {
    const events = await getAllEvents();
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedEvents = [...events, newEvent];

    // Update memory storage
    memoryEvents = updatedEvents;

    // Try to write to file system (will work in development)
    try {
      await fs.writeFile(EVENTS_FILE, JSON.stringify(updatedEvents, null, 2));
    } catch (error) {
      console.log("File system write failed (expected in production):", error);
    }

    return newEvent;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

// Update event
export async function updateEvent(
  id: string,
  eventData: Partial<Omit<Event, "id" | "createdAt">>
): Promise<Event | null> {
  try {
    const events = await getAllEvents();
    const eventIndex = events.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
      return null;
    }

    const updatedEvents = [...events];
    updatedEvents[eventIndex] = {
      ...updatedEvents[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString(),
    };

    // Update memory storage
    memoryEvents = updatedEvents;

    // Try to write to file system (will work in development)
    try {
      await fs.writeFile(EVENTS_FILE, JSON.stringify(updatedEvents, null, 2));
    } catch (error) {
      console.log("File system write failed (expected in production):", error);
    }

    return updatedEvents[eventIndex];
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

// Delete event
export async function deleteEvent(id: string): Promise<boolean> {
  try {
    const events = await getAllEvents();
    const filteredEvents = events.filter((event) => event.id !== id);

    if (filteredEvents.length === events.length) {
      return false; // Event not found
    }

    // Update memory storage
    memoryEvents = filteredEvents;

    // Try to write to file system (will work in development)
    try {
      await fs.writeFile(EVENTS_FILE, JSON.stringify(filteredEvents, null, 2));
    } catch (error) {
      console.log("File system write failed (expected in production):", error);
    }

    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
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
