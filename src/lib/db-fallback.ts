// Fallback database operations for local development
import { DatabaseResult } from './db';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: 'super_admin' | 'events_manager' | 'news_manager' | 'user_manager';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  created_by?: string;
}

// In-memory storage for local development
const users: Map<string, User> = new Map();
const events: Map<string, any> = new Map();

// Initialize default admin user  
async function initializeDefaultData() {
  if (!users.has('admin@neti.com.ph')) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 12);
    
    const adminUser: User = {
      id: '1',
      email: 'admin@neti.com.ph',
      name: 'NETI Super Administrator',
      password: hashedPassword,
      role: 'super_admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.set('admin@neti.com.ph', adminUser);
    users.set('1', adminUser);
  }
}

// Fallback user operations
export const fallbackUserOperations = {
  async getUserByEmail(email: string): Promise<DatabaseResult<User>> {
    initializeDefaultData();
    const user = users.get(email);
    
    if (!user || !user.is_active) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: user };
  },

  async getUserById(id: string): Promise<DatabaseResult<User>> {
    initializeDefaultData();
    const user = users.get(id);
    
    if (!user || !user.is_active) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: user };
  },

  async authenticateUser(email: string, password: string): Promise<DatabaseResult<User>> {
    initializeDefaultData();
    const user = users.get(email);
    
    if (!user || !user.is_active || !user.password) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const bcrypt = await import('bcryptjs');
    const isValidPassword = bcrypt.compareSync(password, user.password);
    
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Update last login
    user.last_login = new Date().toISOString();
    users.set(email, user);
    users.set(user.id, user);
    
    // Return user without password
    const { password: _, ...userResponse } = user;
    return { success: true, data: userResponse as User };
  },

  async getAllUsers(): Promise<DatabaseResult<User[]>> {
    initializeDefaultData();
    const allUsers = Array.from(users.values()).filter((user, index, self) => 
      self.findIndex(u => u.id === user.id) === index && user.is_active
    );
    
    return { success: true, data: allUsers };
  },

  async createUser(userData: any): Promise<DatabaseResult<User>> {
    initializeDefaultData();
    
    if (users.has(userData.email)) {
      return { success: false, error: 'User with this email already exists' };
    }
    
    const bcrypt = await import('bcryptjs');
    const hashedPassword = bcrypt.hashSync(userData.password, 12);
    
    const newUser: User = {
      id: (users.size + 1).toString(),
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      role: userData.role,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: userData.created_by
    };
    
    users.set(userData.email, newUser);
    users.set(newUser.id, newUser);
    
    const { password: _, ...userResponse } = newUser;
    return { success: true, data: userResponse as User };
  },

  async updateUser(id: string, userData: any): Promise<DatabaseResult<User>> {
    initializeDefaultData();
    const user = users.get(id);
    
    if (!user || !user.is_active) {
      return { success: false, error: 'User not found' };
    }
    
    // Update user data
    const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() };
    
    if (userData.password) {
      const bcrypt = await import('bcryptjs');
      updatedUser.password = bcrypt.hashSync(userData.password, 12);
    }
    
    users.set(id, updatedUser);
    users.set(updatedUser.email, updatedUser);
    
    const { password: _, ...userResponse } = updatedUser;
    return { success: true, data: userResponse as User };
  },

  async deleteUser(id: string): Promise<DatabaseResult<boolean>> {
    initializeDefaultData();
    const user = users.get(id);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    user.is_active = false;
    user.updated_at = new Date().toISOString();
    users.set(id, user);
    users.set(user.email, user);
    
    return { success: true, data: true };
  }
};

// Fallback event operations  
export const fallbackEventOperations = {
  async getAllEvents(): Promise<DatabaseResult<any[]>> {
    const defaultEvents = [
      {
        id: "1",
        title: "Maritime Safety Symposium 2025",
        date: "2025-01-15",
        time: "9:00 AM - 5:00 PM",
        location: "NETI Training Center, Calamba",
        description: "Join industry experts for comprehensive discussions on the latest maritime safety protocols.",
        category: "Symposium",
        attendees: "200+",
        image: "/assets/images/nttc.jpg",
        status: "registration-open",
        max_capacity: 250,
        current_registrations: 45,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Bridge Simulation Training Workshop",
        date: "2025-01-22",
        time: "8:00 AM - 4:00 PM",
        location: "NETI Simulation Center",
        description: "Hands-on training using our state-of-the-art bridge simulation technology.",
        category: "Workshop",
        attendees: "30",
        image: "/assets/images/nyk.png",
        status: "registration-open",
        max_capacity: 30,
        current_registrations: 12,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    
    return { success: true, data: defaultEvents };
  }
};

export function isDevelopmentFallback(): boolean {
  return process.env.NODE_ENV === 'development' && !process.env.POSTGRES_URL;
}