CREATE TABLE IF NOT EXISTS destinations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  rating REAL NOT NULL,
  budget INTEGER NOT NULL,
  description TEXT
);
CREATE TABLE IF NOT EXISTS tourist_places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  cost INTEGER NOT NULL DEFAULT 0,
  duration REAL NOT NULL DEFAULT 1,
  priority INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY(destination_id) REFERENCES destinations(id)
);
CREATE TABLE IF NOT EXISTS trips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  destination TEXT NOT NULL,
  travel_date TEXT,
  days INTEGER NOT NULL,
  people INTEGER NOT NULL,
  budget INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination TEXT NOT NULL,
  rating INTEGER NOT NULL,
  text TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL
);
INSERT OR IGNORE INTO destinations(name,category,rating,budget,description) VALUES
('Ooty','Hill Station',4.7,2200,'Cool hills, gardens and viewpoints.'),
('Kodaikanal','Hill Station',4.6,2300,'Lakes, pine forests and easy hill walks.'),
('Munnar','Nature',4.8,2600,'Tea gardens and mountain scenery.'),
('Coorg','Adventure',4.7,2400,'Coffee estates, waterfalls and trails.'),
('Chennai','Beach',4.4,1800,'Coastal views, food and city attractions.'),
('Madurai','Historical',4.6,1700,'Historic temples and local culture.'),
('Mysuru','Historical',4.7,1900,'Palaces, markets and heritage walks.'),
('Kochi','Food',4.5,2100,'Food, waterfronts and colonial streets.'),
('Bandipur','Wildlife',4.6,2500,'Wildlife viewing and forest landscapes.');
