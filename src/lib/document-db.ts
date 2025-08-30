import fs from 'fs';
import path from 'path';
import { DatabaseResult } from './db';

// Base path for data files
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Generic file operations for document database
export class DocumentDB<T extends { id: string }> {
  private filePath: string;

  constructor(fileName: string) {
    ensureDataDir();
    this.filePath = path.join(DATA_DIR, fileName);
    
    // Initialize file if it doesn't exist
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]', 'utf8');
    }
  }

  // Read all documents
  async readAll(): Promise<DatabaseResult<T[]>> {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      const documents = JSON.parse(data) as T[];
      return { success: true, data: documents };
    } catch (error) {
      console.error('Error reading documents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read documents'
      };
    }
  }

  // Write all documents (overwrites entire file)
  async writeAll(documents: T[]): Promise<DatabaseResult<boolean>> {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(documents, null, 2), 'utf8');
      return { success: true, data: true };
    } catch (error) {
      console.error('Error writing documents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to write documents'
      };
    }
  }

  // Find document by ID
  async findById(id: string): Promise<DatabaseResult<T>> {
    const result = await this.readAll();
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    const document = result.data.find(doc => doc.id === id);
    if (!document) {
      return { success: false, error: 'Document not found' };
    }

    return { success: true, data: document };
  }

  // Find documents by condition
  async findWhere(condition: (doc: T) => boolean): Promise<DatabaseResult<T[]>> {
    const result = await this.readAll();
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    const documents = result.data.filter(condition);
    return { success: true, data: documents };
  }

  // Find single document by condition
  async findOne(condition: (doc: T) => boolean): Promise<DatabaseResult<T>> {
    const result = await this.readAll();
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    const document = result.data.find(condition);
    if (!document) {
      return { success: false, error: 'Document not found' };
    }

    return { success: true, data: document };
  }

  // Create new document
  async create(document: Omit<T, 'id'> & { id?: string }): Promise<DatabaseResult<T>> {
    const result = await this.readAll();
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    // Generate ID if not provided
    const newId = document.id || Date.now().toString();
    const newDocument = { ...document, id: newId } as T;

    // Check if ID already exists
    if (result.data.find(doc => doc.id === newId)) {
      return { success: false, error: 'Document with this ID already exists' };
    }

    const updatedDocuments = [...result.data, newDocument];
    const writeResult = await this.writeAll(updatedDocuments);

    if (!writeResult.success) {
      return { success: false, error: writeResult.error };
    }

    return { success: true, data: newDocument };
  }

  // Update document by ID
  async update(id: string, updates: Partial<Omit<T, 'id'>>): Promise<DatabaseResult<T>> {
    const result = await this.readAll();
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    const documentIndex = result.data.findIndex(doc => doc.id === id);
    if (documentIndex === -1) {
      return { success: false, error: 'Document not found' };
    }

    const updatedDocument = { ...result.data[documentIndex], ...updates } as T;
    const updatedDocuments = [...result.data];
    updatedDocuments[documentIndex] = updatedDocument;

    const writeResult = await this.writeAll(updatedDocuments);
    if (!writeResult.success) {
      return { success: false, error: writeResult.error };
    }

    return { success: true, data: updatedDocument };
  }

  // Delete document by ID
  async delete(id: string): Promise<DatabaseResult<boolean>> {
    const result = await this.readAll();
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    const originalLength = result.data.length;
    const updatedDocuments = result.data.filter(doc => doc.id !== id);

    if (updatedDocuments.length === originalLength) {
      return { success: false, error: 'Document not found' };
    }

    const writeResult = await this.writeAll(updatedDocuments);
    if (!writeResult.success) {
      return { success: false, error: writeResult.error };
    }

    return { success: true, data: true };
  }

  // Count documents
  async count(condition?: (doc: T) => boolean): Promise<DatabaseResult<number>> {
    const result = await this.readAll();
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    const count = condition 
      ? result.data.filter(condition).length 
      : result.data.length;

    return { success: true, data: count };
  }
}

// Type definitions for our collections
export interface UserDocument {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'super_admin' | 'events_manager' | 'news_manager' | 'user_manager';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  createdBy?: string;
}

export interface EventDocument {
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
  max_capacity: number;
  current_registrations: number;
  created_at: string;
  updated_at: string;
}

// Database instances
export const usersDB = new DocumentDB<UserDocument>('users.json');
export const eventsDB = new DocumentDB<EventDocument>('events.json');