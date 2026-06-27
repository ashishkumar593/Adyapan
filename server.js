const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Multer Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.docx') {
      return cb(new Error('Only PDF and DOCX files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets out of the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Helper DB CRUD functions
function readDatabase() {
  try {
    const rawData = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { users: [] };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Page Routes (serving HTML from public folder)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Backend API Endpoints

// 1. API: Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, college, branch, year, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required fields.' });
  }

  const db = readDatabase();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered.' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    phone: phone || '',
    college: college || '',
    branch: branch || '',
    year: year || '',
    password, // In production, hash this password using bcrypt
    profile: {
      skills: '',
      careerGoal: 'Software Engineer',
      linkedin: '',
      github: '',
      resume: null
    },
    stats: {
      notesGenerated: 0,
      resumeScore: 0,
      interviewsCompleted: 0,
      careerProgress: 30 // Default signup progress
    },
    activities: [
      { id: 1, title: 'Created account details', time: 'Just now' }
    ]
  };

  db.users.push(newUser);
  writeDatabase(db);

  res.status(201).json({ message: 'Registration successful', email: newUser.email });
});

// 2. API: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = readDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  res.json({ message: 'Login successful', email: user.email, name: user.name });
});

// 3. API: Get Profile Details
app.get('/api/profile/details', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required.' });
  }

  const db = readDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Hide password before returning
  const userDetails = { ...user };
  delete userDetails.password;

  res.json(userDetails);
});

// 4. API: Save Profile Settings
app.post('/api/profile/save', (req, res) => {
  const { email, name, phone, college, branch, careerGoal, skills, linkedin, github } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required to update profile.' });
  }

  const db = readDatabase();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Update core details
  db.users[userIndex].name = name || db.users[userIndex].name;
  db.users[userIndex].phone = phone || db.users[userIndex].phone;
  db.users[userIndex].college = college || db.users[userIndex].college;
  db.users[userIndex].branch = branch || db.users[userIndex].branch;
  
  // Update profiles section
  db.users[userIndex].profile = {
    ...db.users[userIndex].profile,
    skills: skills || '',
    careerGoal: careerGoal || 'Software Engineer',
    linkedin: linkedin || '',
    github: github || ''
  };

  // Add activity log
  db.users[userIndex].activities.unshift({
    id: Date.now(),
    title: 'Updated profile details',
    time: 'Just now'
  });

  writeDatabase(db);
  res.json({ message: 'Profile updated successfully', user: db.users[userIndex] });
});

// 5. API: Upload Resume
app.post('/api/profile/upload-resume', (req, res) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { email } = req.body;
    if (!email) {
      // Cleanup uploaded file if email is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Email is required for resume upload.' });
    }

    const db = readDatabase();
    const userIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'User not found.' });
    }

    // Delete old resume file if it exists
    const oldResume = db.users[userIndex].profile.resume;
    if (oldResume && oldResume.path && fs.existsSync(oldResume.path)) {
      try {
        fs.unlinkSync(oldResume.path);
      } catch (err) {
        console.error('Error removing old resume file:', err);
      }
    }

    // Save upload metadata
    const resumeInfo = {
      filename: req.file.originalname,
      filenameOnDisk: req.file.filename,
      path: req.file.path,
      size: req.file.size
    };

    db.users[userIndex].profile.resume = resumeInfo;
    
    // Simulate ATS grading
    const mockATSScore = Math.floor(Math.random() * 25) + 65; // Generate score between 65 and 90
    db.users[userIndex].stats.resumeScore = mockATSScore;

    // Add activity log
    db.users[userIndex].activities.unshift({
      id: Date.now(),
      title: `Uploaded Resume: ${req.file.originalname}`,
      time: 'Just now'
    });

    writeDatabase(db);

    res.json({ 
      message: 'Resume uploaded successfully', 
      resume: resumeInfo,
      resumeScore: mockATSScore
    });
  });
});

// 6. API: Remove Resume
app.post('/api/profile/remove-resume', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const db = readDatabase();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const resume = db.users[userIndex].profile.resume;
  if (resume && resume.path && fs.existsSync(resume.path)) {
    try {
      fs.unlinkSync(resume.path);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }

  db.users[userIndex].profile.resume = null;
  db.users[userIndex].stats.resumeScore = 0;

  // Add activity log
  db.users[userIndex].activities.unshift({
    id: Date.now(),
    title: 'Removed resume',
    time: 'Just now'
  });

  writeDatabase(db);
  res.json({ message: 'Resume removed successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Node.js server running at http://localhost:${PORT}`);
});
