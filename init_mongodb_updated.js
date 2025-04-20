// MongoDB initialization script for RiverForo.com
// This script initializes the database with collections, indexes, and initial data

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection string with updated credentials
const uri = "mongodb+srv://rodimargonari:rodimargonari@river-foro-cluster0.dr5mydi.mongodb.net/?retryWrites=true&w=majority&appName=River-Foro-Cluster0";

// Connect to MongoDB
async function initializeDatabase() {
  console.log("Starting MongoDB initialization...");
  
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB Atlas successfully!");
    
    // Get database reference
    const db = client.db("riverforo");
    
    // Create collections
    console.log("Creating collections...");
    await createCollections(db);
    
    // Create indexes
    console.log("Creating indexes...");
    await createIndexes(db);
    
    // Create admin user
    console.log("Creating admin user...");
    await createAdminUser(db);
    
    // Create initial categories
    console.log("Creating initial categories...");
    await createInitialCategories(db);
    
    // Create ad placements
    console.log("Creating ad placements...");
    await createAdPlacements(db);
    
    // Create welcome thread
    console.log("Creating welcome thread...");
    await createWelcomeThread(db);
    
    console.log("Database initialization completed successfully!");
    
  } catch (err) {
    console.error("Error initializing database:", err);
  } finally {
    // Close the connection
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

// Create collections
async function createCollections(db) {
  const collections = [
    "users",
    "categories",
    "threads",
    "posts",
    "notifications",
    "adPlacements"
  ];
  
  for (const collection of collections) {
    try {
      await db.createCollection(collection);
      console.log(`Collection created: ${collection}`);
    } catch (err) {
      // Collection might already exist
      console.log(`Collection ${collection} already exists or error:`, err.message);
    }
  }
}

// Create indexes
async function createIndexes(db) {
  // Users indexes
  await db.collection("users").createIndex({ username: 1 }, { unique: true });
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("users").createIndex({ "socialAuth.google.id": 1 }, { sparse: true });
  await db.collection("users").createIndex({ "socialAuth.facebook.id": 1 }, { sparse: true });
  
  // Categories indexes
  await db.collection("categories").createIndex({ slug: 1 }, { unique: true });
  await db.collection("categories").createIndex({ order: 1 });
  
  // Threads indexes
  await db.collection("threads").createIndex({ slug: 1 }, { unique: true });
  await db.collection("threads").createIndex({ category: 1 });
  await db.collection("threads").createIndex({ user: 1 });
  await db.collection("threads").createIndex({ createdAt: -1 });
  await db.collection("threads").createIndex({ isPinned: -1, createdAt: -1 });
  
  // Posts indexes
  await db.collection("posts").createIndex({ thread: 1, createdAt: 1 });
  await db.collection("posts").createIndex({ user: 1 });
  await db.collection("posts").createIndex({ "mentions": 1 });
  
  // Notifications indexes
  await db.collection("notifications").createIndex({ user: 1, isRead: 1, createdAt: -1 });
  
  console.log("Indexes created successfully");
}

// Create admin user
async function createAdminUser(db) {
  const adminUser = {
    username: "admin",
    email: "admin@riverforo.com",
    password: await bcrypt.hash("riverplate85", 10),
    avatar: "/images/default-avatar.png",
    role: "admin",
    language: "es",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: null,
    isActive: true,
    isBanned: false,
    socialAuth: {},
    profile: {
      signature: "Administrador de RiverForo.com",
      location: "Buenos Aires, Argentina",
      bio: "Administrador oficial de RiverForo.com"
    },
    stats: {
      postCount: 1,
      threadCount: 1,
      reputation: 100
    },
    settings: {
      notifications: {
        email: true,
        mentions: true,
        replies: true
      },
      privacy: {
        showOnline: true,
        allowMessages: true
      }
    }
  };
  
  try {
    await db.collection("users").insertOne(adminUser);
    console.log("Admin user created successfully");
  } catch (err) {
    // User might already exist
    console.log("Admin user already exists or error:", err.message);
  }
}

// Create initial categories
async function createInitialCategories(db) {
  const categories = [
    {
      name: {
        es: "Noticias y Anuncios",
        en: "News and Announcements"
      },
      description: {
        es: "Noticias oficiales y anuncios sobre River Plate y el foro",
        en: "Official news and announcements about River Plate and the forum"
      },
      slug: "noticias-anuncios",
      order: 1,
      parentCategory: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: {
        view: ["user", "moderator", "admin"],
        create: ["moderator", "admin"]
      },
      stats: {
        threadCount: 1,
        postCount: 1,
        lastPost: null
      }
    },
    {
      name: {
        es: "Discusión General",
        en: "General Discussion"
      },
      description: {
        es: "Discusiones generales sobre River Plate",
        en: "General discussions about River Plate"
      },
      slug: "discusion-general",
      order: 2,
      parentCategory: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: {
        view: ["user", "moderator", "admin"],
        create: ["user", "moderator", "admin"]
      },
      stats: {
        threadCount: 0,
        postCount: 0,
        lastPost: null
      }
    },
    {
      name: {
        es: "Partidos y Eventos",
        en: "Matches and Events"
      },
      description: {
        es: "Discusiones sobre partidos pasados y futuros, y eventos relacionados con River Plate",
        en: "Discussions about past and upcoming matches, and events related to River Plate"
      },
      slug: "partidos-eventos",
      order: 3,
      parentCategory: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: {
        view: ["user", "moderator", "admin"],
        create: ["user", "moderator", "admin"]
      },
      stats: {
        threadCount: 0,
        postCount: 0,
        lastPost: null
      }
    },
    {
      name: {
        es: "Jugadores y Cuerpo Técnico",
        en: "Players and Staff"
      },
      description: {
        es: "Discusiones sobre jugadores, entrenadores y personal de River Plate",
        en: "Discussions about River Plate players, coaches, and staff"
      },
      slug: "jugadores-cuerpo-tecnico",
      order: 4,
      parentCategory: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: {
        view: ["user", "moderator", "admin"],
        create: ["user", "moderator", "admin"]
      },
      stats: {
        threadCount: 0,
        postCount: 0,
        lastPost: null
      }
    },
    {
      name: {
        es: "Historia y Tradiciones",
        en: "History and Traditions"
      },
      description: {
        es: "Discusiones sobre la historia, tradiciones y logros de River Plate",
        en: "Discussions about River Plate's history, traditions, and achievements"
      },
      slug: "historia-tradiciones",
      order: 5,
      parentCategory: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: {
        view: ["user", "moderator", "admin"],
        create: ["user", "moderator", "admin"]
      },
      stats: {
        threadCount: 0,
        postCount: 0,
        lastPost: null
      }
    },
    {
      name: {
        es: "Ayuda y Soporte",
        en: "Help and Support"
      },
      description: {
        es: "Ayuda y soporte para el uso del foro",
        en: "Help and support for using the forum"
      },
      slug: "ayuda-soporte",
      order: 6,
      parentCategory: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      permissions: {
        view: ["user", "moderator", "admin"],
        create: ["user", "moderator", "admin"]
      },
      stats: {
        threadCount: 0,
        postCount: 0,
        lastPost: null
      }
    }
  ];
  
  try {
    await db.collection("categories").insertMany(categories);
    console.log("Initial categories created successfully");
  } catch (err) {
    // Categories might already exist
    console.log("Categories already exist or error:", err.message);
  }
}

// Create ad placements
async function createAdPlacements(db) {
  const adPlacements = [
    {
      name: "Header Ad",
      location: "header",
      adCode: `<ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-1234567890123456"
                 data-ad-slot="1234567890"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 1,
      responsive: {
        mobile: true,
        tablet: true,
        desktop: true
      }
    },
    {
      name: "Sidebar Ad",
      location: "sidebar",
      adCode: `<ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-1234567890123456"
                 data-ad-slot="0987654321"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 2,
      responsive: {
        mobile: false,
        tablet: true,
        desktop: true
      }
    },
    {
      name: "Between Threads Ad",
      location: "between-threads",
      adCode: `<ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-1234567890123456"
                 data-ad-slot="1357924680"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 3,
      responsive: {
        mobile: true,
        tablet: true,
        desktop: true
      }
    },
    {
      name: "Between Posts Ad",
      location: "between-posts",
      adCode: `<ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-1234567890123456"
                 data-ad-slot="2468013579"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 4,
      responsive: {
        mobile: true,
        tablet: true,
        desktop: true
      }
    },
    {
      name: "Footer Ad",
      location: "footer",
      adCode: `<ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-1234567890123456"
                 data-ad-slot="3692581470"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      displayOrder: 5,
      responsive: {
        mobile: true,
        tablet: true,
        desktop: true
      }
    }
  ];
  
  try {
    await db.collection("adPlacements").insertMany(adPlacements);
    console.log("Ad placements created successfully");
  } catch (err) {
    // Ad placements might already exist
    console.log("Ad placements already exist or error:", err.message);
  }
}

// Create welcome thread
async function createWelcomeThread(db) {
  // Get admin user
  const adminUser = await db.collection("users").findOne({ username: "admin" });
  
  if (!adminUser) {
    console.log("Admin user not found, skipping welcome thread creation");
    return;
  }
  
  // Get news category
  const newsCategory = await db.collection("categories").findOne({ slug: "noticias-anuncios" });
  
  if (!newsCategory) {
    console.log("News category not found, skipping welcome thread creation");
    return;
  }
  
  // Create welcome thread
  const welcomeThread = {
    title: "¡Bienvenidos a RiverForo.com!",
    slug: "bienvenidos-a-riverforo",
    user: adminUser._id,
    category: newsCategory._id,
    createdAt: new Date(),
    updatedAt: new Date(),
    isPinned: true,
    isLocked: false,
    isDeleted: false,
    views: 0,
    replies: 0,
    lastReply: null,
    tags: ["bienvenida", "anuncio"]
  };
  
  try {
    const threadResult = await db.collection("threads").insertOne(welcomeThread);
    
    // Create welcome post
    const welcomePost = {
      thread: threadResult.insertedId,
      user: adminUser._id,
      content: `<h2>¡Bienvenidos a RiverForo.com!</h2>
<p>Estamos emocionados de lanzar oficialmente RiverForo.com, el foro definitivo para todos los fanáticos de River Plate.</p>

<p>Este es un espacio donde podrás:</p>
<ul>
  <li>Discutir sobre partidos, jugadores y noticias</li>
  <li>Compartir tus opiniones y análisis</li>
  <li>Conectar con otros hinchas de River</li>
  <li>Mantenerte actualizado sobre todo lo relacionado con el club</li>
</ul>

<p>El foro está organizado en varias categorías para facilitar la navegación y encontrar los temas que más te interesan.</p>

<p>Algunas reglas básicas:</p>
<ol>
  <li>Respeta a los demás usuarios</li>
  <li>Mantén las discusiones relacionadas con River Plate</li>
  <li>No publiques contenido ofensivo o inapropiado</li>
  <li>Disfruta y contribuye positivamente a la comunidad</li>
</ol>

<p>Si tienes alguna pregunta o sugerencia, no dudes en contactar al equipo de administración.</p>

<p>¡Vamos River!</p>`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      isEdited: false,
      editHistory: [],
      likes: [],
      mentions: [],
      attachments: []
    };
    
    await db.collection("posts").insertOne(welcomePost);
    
    // Update thread with first post
    await db.collection("threads").updateOne(
      { _id: threadResult.insertedId },
      { $set: { content: welcomePost.content } }
    );
    
    // Update category stats
    await db.collection("categories").updateOne(
      { _id: newsCategory._id },
      { 
        $set: {
          "stats.lastPost": {
            threadId: threadResult.insertedId,
            userId: adminUser._id,
            username: adminUser.username,
            timestamp: new Date()
          }
        }
      }
    );
    
    console.log("Welcome thread created successfully");
  } catch (err) {
    // Thread might already exist
    console.log("Welcome thread already exists or error:", err.message);
  }
}

// Run the initialization
initializeDatabase().catch(console.error);
