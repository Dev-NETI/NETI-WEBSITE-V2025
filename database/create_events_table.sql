-- Create the events table in neti_db database
USE neti_db;

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  attendees VARCHAR(20) DEFAULT '0',
  image VARCHAR(255) DEFAULT '/assets/images/nttc.jpg',
  status ENUM('upcoming', 'registration-open', 'completed', 'cancelled') DEFAULT 'upcoming',
  maxCapacity INT DEFAULT 100,
  currentRegistrations INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date),
  INDEX idx_status (status)
);

-- Insert sample data (similar to your JSON data)
INSERT INTO events (
  title, date, time, location, description, category, attendees, image, status, maxCapacity, currentRegistrations
) VALUES 
(
  'NETI''s Silver Anniversary',
  '2025-10-24',
  '1:30 AM - 4:00 PM',
  'NETI',
  'Maxime autem laudant',
  'Conference',
  '0',
  '/assets/images/nttc.jpg',
  'upcoming',
  100,
  0
),
(
  'NETI''s Gold Anniversary',
  '2025-10-25',
  '1:30 AM - 4:00 PM',
  'NETI',
  'Maxime autem laudant',
  'Conference',
  '0',
  '/assets/images/nttc.jpg',
  'upcoming',
  100,
  0
),
(
  'NETI''s Gold Anniversary',
  '2025-10-26',
  '1:30 AM - 4:00 PM',
  'NETI',
  'Maxime autem laudant',
  'Conference',
  '0',
  '/assets/images/nttc.jpg',
  'upcoming',
  100,
  0
),
(
  'NETI''s Gold Anniversary',
  '2025-10-27',
  '1:30 AM - 4:00 PM',
  'NETI',
  'Maxime autem laudant',
  'Conference',
  '0',
  '/assets/images/nttc.jpg',
  'upcoming',
  100,
  0
);