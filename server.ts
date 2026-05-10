import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("realestate.db");
const JWT_SECRET = process.env.JWT_SECRET || "calabash-secret-key-123";

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' -- 'user' or 'admin'
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    location TEXT NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    sqft INTEGER,
    parking_spaces INTEGER DEFAULT 0,
    year_built INTEGER,
    type TEXT,
    image_url TEXT,
    images TEXT, -- JSON array of image URLs
    status TEXT DEFAULT 'For Sale', -- 'For Sale', 'For Rent', 'Sold', 'Rented'
    featured BOOLEAN DEFAULT 0,
    user_id INTEGER,
    agent_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(agent_id) REFERENCES agents(id)
  );

  CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    bio TEXT,
    profile_picture_url TEXT,
    specialization TEXT,
    experience_years INTEGER
  );

  CREATE TABLE IF NOT EXISTS saved_properties (
    user_id INTEGER,
    property_id INTEGER,
    PRIMARY KEY (user_id, property_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(property_id) REFERENCES properties(id)
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    date TEXT NOT NULL,
    image_url TEXT
  );
`);

try {
  db.exec("ALTER TABLE properties ADD COLUMN status TEXT DEFAULT 'For Sale'");
} catch (e) {}

try {
  db.exec("ALTER TABLE properties ADD COLUMN agent_id INTEGER");
} catch (e) {}

// Seed data
const agentCount = db.prepare("SELECT COUNT(*) as count FROM agents").get() as { count: number };
if (agentCount.count === 0) {
  const insertAgent = db.prepare(`
    INSERT INTO agents (name, email, phone, bio, profile_picture_url, specialization, experience_years)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertAgent.run(
    "Mohamed Bangura", 
    "m.bangura@calabashsl.com", 
    "+232 76 555 012", 
    "Senior Property Advisor with over 15 years of experience in the Freetown luxury market. Specialist in high-end villas and investment portfolios.",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed",
    "Luxury Residential",
    15
  );

  insertAgent.run(
    "Fatu Kamara", 
    "f.kamara@calabashsl.com", 
    "+232 78 444 999", 
    "Expert in commercial property acquisitions and estate management throughout the Western Area. Dedicated to finding the perfect match for every client.",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatu",
    "Commercial Real Estate",
    10
  );

  insertAgent.run(
    "Ibrahim Sesay", 
    "i.sesay@calabashsl.com", 
    "+232 30 111 222", 
    "Passionate about beachfront developments and sustainable housing solutions. Leading our Tokeh and York expansion projects.",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim",
    "Beachfront Properties",
    8
  );
}

const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Admin User", "admin@calabash.com", hashedPassword, "admin"
  );
}

const propCount = db.prepare("SELECT COUNT(*) as count FROM properties").get() as { count: number };
if (propCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO properties (title, description, price, location, bedrooms, bathrooms, sqft, type, image_url, images, status, featured, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedData = [
    ["Luxury Mansion in Hill Station", "Exquisite mansion with breathtaking views of Freetown and the Atlantic Ocean.", 850000, "Hill Station, Freetown", 6, 5, 5500, "Mansion", "https://picsum.photos/seed/sl1/800/600", JSON.stringify(["https://picsum.photos/seed/sl1/800/600", "https://picsum.photos/seed/sl1b/800/600", "https://picsum.photos/seed/sl1c/800/600"]), "For Sale", 1, 1, 1],
    ["Modern Apartment in Aberdeen", "Stylish 3-bedroom apartment just minutes from Lumley Beach.", 250000, "Aberdeen, Freetown", 3, 2, 1800, "Apartment", "https://picsum.photos/seed/sl2/800/600", JSON.stringify(["https://picsum.photos/seed/sl2/800/600", "https://picsum.photos/seed/sl2b/800/600"]), "Rented", 0, 1, 2],
    ["Commercial Space in Central", "Prime office space in the heart of Freetown's business district.", 1500000, "Siaka Stevens St, Freetown", 0, 4, 3500, "Commercial", "https://picsum.photos/seed/sl3/800/600", JSON.stringify(["https://picsum.photos/seed/sl3/800/600"]), "Sold", 1, 1, 2],
    ["Beachfront Villa in Tokeh", "Serene villa on the white sands of Tokeh Beach.", 1200000, "Tokeh, Western Area", 4, 4, 3200, "Villa", "https://picsum.photos/seed/sl4/800/600", JSON.stringify(["https://picsum.photos/seed/sl4/800/600", "https://picsum.photos/seed/sl4b/800/600"]), "For Sale", 1, 1, 3],
    ["Family Home in Goderich", "Spacious family home with a large garden and modern amenities.", 450000, "Goderich, Freetown", 4, 3, 2400, "House", "https://picsum.photos/seed/sl5/800/600", JSON.stringify(["https://picsum.photos/seed/sl5/800/600"]), "For Sale", 0, 1, 1],
    ["Commercial & Residential Complex - Tombo Junction", "Prime property located at Main Highway Tombo Junction, Waterloo. Features 4 residential apartments and 5 commercial shops. Excellent investment opportunity. Price is negotiable.", 490000, "Tombo Junction, Waterloo", 8, 4, 4200, "Commercial", "https://picsum.photos/seed/tombo1/800/600", JSON.stringify(["https://picsum.photos/seed/tombo1/800/600", "https://picsum.photos/seed/tombo2/800/600", "https://picsum.photos/seed/tombo3/800/600"]), "For Sale", 1, 1, 2]
  ];

  for (const data of seedData) {
    insert.run(...data);
  }
}

// Ensure the new Tombo Junction property is added if not present
const tomboExists = db.prepare("SELECT COUNT(*) as count FROM properties WHERE title LIKE '%Tombo Junction%'").get() as { count: number };
if (tomboExists.count === 0) {
  db.prepare(`
    INSERT INTO properties (title, description, price, location, bedrooms, bathrooms, sqft, type, image_url, images, featured, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Commercial & Residential Complex - Tombo Junction", 
    "Prime property located at Main Highway Tombo Junction, Waterloo. Features 4 residential apartments and 5 commercial shops. Excellent investment opportunity. Price is negotiable.", 
    490000, 
    "Tombo Junction, Waterloo", 
    8, 4, 4200, "Commercial", 
    "https://picsum.photos/seed/tombo1/800/600", 
    JSON.stringify(["https://picsum.photos/seed/tombo1/800/600", "https://picsum.photos/seed/tombo2/800/600", "https://picsum.photos/seed/tombo3/800/600"]), 
    1, 1
  );
}

const blogCount = db.prepare("SELECT COUNT(*) as count FROM blog_posts").get() as { count: number };
if (blogCount.count === 0) {
  const insertBlog = db.prepare("INSERT INTO blog_posts (title, content, author, date, image_url) VALUES (?, ?, ?, ?, ?)");
  insertBlog.run("Real Estate Trends in Sierra Leone 2026", "The market is seeing a surge in demand for luxury beachfront properties...", "Calabash Team", "March 10, 2026", "https://picsum.photos/seed/blog1/800/600");
  insertBlog.run("Investing in Freetown: Why Now?", "With infrastructure improvements, Freetown is becoming a hub for investors...", "John Kamara", "March 5, 2026", "https://picsum.photos/seed/blog2/800/600");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const info = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, hashedPassword);
      const token = jwt.sign({ id: info.lastInsertRowid, email, name }, JWT_SECRET);
      res.json({ token, user: { id: info.lastInsertRowid, name, email, role: 'user' } });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  // API Routes
  app.get("/api/properties", (req, res) => {
    const { status } = req.query;
    let properties;
    if (status && status !== 'All') {
      properties = db.prepare(`
        SELECT p.*, a.name as agent_name, a.profile_picture_url as agent_image 
        FROM properties p 
        LEFT JOIN agents a ON p.agent_id = a.id 
        WHERE p.status = ?
      `).all(status);
    } else {
      properties = db.prepare(`
        SELECT p.*, a.name as agent_name, a.profile_picture_url as agent_image 
        FROM properties p 
        LEFT JOIN agents a ON p.agent_id = a.id
      `).all();
    }
    res.json(properties.map((p: any) => ({ ...p, images: JSON.parse(p.images || '[]') })));
  });

  app.get("/api/properties/:id", (req, res) => {
    const property = db.prepare(`
      SELECT p.*, a.name as agent_name, a.email as agent_email, a.phone as agent_phone, 
             a.bio as agent_bio, a.profile_picture_url as agent_image, a.specialization as agent_specialization
      FROM properties p 
      LEFT JOIN agents a ON p.agent_id = a.id 
      WHERE p.id = ?
    `).get(req.params.id) as any;
    
    if (property) {
      res.json({ ...property, images: JSON.parse(property.images || '[]') });
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  });

  app.get("/api/agents", (req, res) => {
    const agents = db.prepare("SELECT * FROM agents").all();
    res.json(agents);
  });

  app.get("/api/agents/:id", (req, res) => {
    const agent = db.prepare("SELECT * FROM agents WHERE id = ?").get(req.params.id) as any;
    if (agent) {
      const properties = db.prepare("SELECT * FROM properties WHERE agent_id = ?").all(req.params.id);
      res.json({ 
        ...agent, 
        properties: properties.map((p: any) => ({ ...p, images: JSON.parse(p.images || '[]') })) 
      });
    } else {
      res.status(404).json({ error: "Agent not found" });
    }
  });

  app.delete("/api/properties/:id", authenticateToken, (req: any, res) => {
    const property = db.prepare("SELECT * FROM properties WHERE id = ?").get(req.params.id) as any;
    if (!property) return res.status(404).json({ error: "Property not found" });
    
    if (property.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    db.prepare("DELETE FROM properties WHERE id = ?").run(req.params.id);
    res.json({ message: "Property deleted" });
  });

  app.post("/api/properties", authenticateToken, (req: any, res) => {
    const { title, description, price, location, bedrooms, bathrooms, sqft, parking_spaces, year_built, type, image_url, images, status, featured } = req.body;
    
    if (!title || !price || !location) {
      return res.status(400).json({ error: "Title, price, and location are required" });
    }

    const info = db.prepare(`
      INSERT INTO properties (title, description, price, location, bedrooms, bathrooms, sqft, parking_spaces, year_built, type, image_url, images, status, featured, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, 
      description, 
      Number(price), 
      location, 
      Number(bedrooms) || 0, 
      Number(bathrooms) || 0, 
      Number(sqft) || 0, 
      Number(parking_spaces) || 0,
      year_built ? Number(year_built) : null,
      type, 
      image_url, 
      JSON.stringify(images || []), 
      status || 'For Sale',
      featured ? 1 : 0, 
      req.user.id
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/blog", (req, res) => {
    const posts = db.prepare("SELECT * FROM blog_posts ORDER BY id DESC").all();
    res.json(posts);
  });

  // Saved Properties API
  app.get("/api/saved-properties", authenticateToken, (req: any, res) => {
    const saved = db.prepare(`
      SELECT p.* FROM properties p
      JOIN saved_properties s ON p.id = s.property_id
      WHERE s.user_id = ?
    `).all(req.user.id);
    res.json(saved.map((p: any) => ({ ...p, images: JSON.parse(p.images || '[]') })));
  });

  app.get("/api/saved-properties/ids", authenticateToken, (req: any, res) => {
    const ids = db.prepare("SELECT property_id FROM saved_properties WHERE user_id = ?").all(req.user.id);
    res.json(ids.map((row: any) => row.property_id));
  });

  app.post("/api/saved-properties/:id", authenticateToken, (req: any, res) => {
    const propertyId = req.params.id;
    const userId = req.user.id;

    const existing = db.prepare("SELECT * FROM saved_properties WHERE user_id = ? AND property_id = ?")
      .get(userId, propertyId);

    if (existing) {
      db.prepare("DELETE FROM saved_properties WHERE user_id = ? AND property_id = ?")
        .run(userId, propertyId);
      res.json({ saved: false });
    } else {
      try {
        db.prepare("INSERT INTO saved_properties (user_id, property_id) VALUES (?, ?)")
          .run(userId, propertyId);
        res.json({ saved: true });
      } catch (e) {
        res.status(400).json({ error: "Could not save property" });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
