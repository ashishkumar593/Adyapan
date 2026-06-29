const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const passwordResetOtps = new Map();

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

function createOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function sendPasswordResetOtp(email, otp) {
  console.log(`Password reset OTP for ${email}: ${otp}`);
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

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/mentor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mentor.html'));
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
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'No account found with this email address.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Password does not match this email address.' });
  }

  res.json({ message: 'Login successful', email: user.email, name: user.name, role: user.role || 'student' });
});

// 2.1 API: Request Password Reset OTP
app.post('/api/auth/request-password-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const db = readDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address.' });
  }

  const otp = createOtp();
  passwordResetOtps.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000
  });
  sendPasswordResetOtp(user.email, otp);

  res.json({ message: 'OTP sent to your registered email address.' });
});

// 2.2 API: Reset Password with OTP
app.post('/api/auth/reset-password', (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  const otpRecord = passwordResetOtps.get(email.toLowerCase());

  if (!otpRecord) {
    return res.status(400).json({ error: 'Please request an OTP first.' });
  }

  if (Date.now() > otpRecord.expiresAt) {
    passwordResetOtps.delete(email.toLowerCase());
    return res.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
  }

  if (otpRecord.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid OTP. Please check your email and try again.' });
  }

  const db = readDatabase();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIndex === -1) {
    return res.status(404).json({ error: 'No account found with this email address.' });
  }

  db.users[userIndex].password = newPassword;
  writeDatabase(db);
  passwordResetOtps.delete(email.toLowerCase());

  res.json({ message: 'Password reset successful. You can now log in with your new password.' });
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

// Mentor APIs

// 1. Get Mentor Dashboard Data
app.get('/api/mentor/dashboard-data', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required.' });
  }

  const db = readDatabase();
  const mentor = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === 'mentor');

  if (!mentor) {
    return res.status(404).json({ error: 'Mentor not found.' });
  }

  // Filter sessions, students, reviews for this mentor
  const sessions = (db.sessions || []).filter(s => s.mentorId === mentor.id);
  const students = (db.mentorStudents || []).filter(s => s.mentorId === mentor.id);
  const reviews = (db.mentorReviews || []).filter(r => r.mentorId === mentor.id);
  
  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  // Calculate stats
  const stats = {
    activeStudents: students.filter(s => s.status === 'Active').length,
    sessionsThisWeek: sessions.filter(s => s.status === 'scheduled').length,
    avgRating: parseFloat(avgRating),
    earnings: reviews.length * 1500, // Mock earnings calculation
    totalTeachingHours: reviews.length * 1.5,
    sessionsCompleted: sessions.filter(s => s.status === 'completed').length,
    studentRetention: 85,
    rank: "Expert"
  };

  res.json({
    mentor: {
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      profile: mentor.profile || {}
    },
    stats,
    sessions,
    students,
    reviews
  });
});

// 2. Schedule a New Session
app.post('/api/mentor/schedule-session', (req, res) => {
  const { email, studentName, topic, dateTime } = req.body;
  if (!email || !studentName || !topic || !dateTime) {
    return res.status(400).json({ error: 'All fields (email, studentName, topic, dateTime) are required.' });
  }

  const db = readDatabase();
  const mentor = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === 'mentor');

  if (!mentor) {
    return res.status(404).json({ error: 'Mentor not found.' });
  }

  if (!db.sessions) db.sessions = [];

  const newSession = {
    id: Date.now(),
    mentorId: mentor.id,
    studentName,
    topic,
    dateTime,
    status: 'scheduled'
  };

  db.sessions.push(newSession);
  
  // Also add student relationship if not already exists
  if (!db.mentorStudents) db.mentorStudents = [];
  const studentExists = db.mentorStudents.some(s => s.mentorId === mentor.id && s.studentName.toLowerCase() === studentName.toLowerCase());
  
  if (!studentExists) {
    db.mentorStudents.push({
      id: Date.now() + 1,
      mentorId: mentor.id,
      studentName,
      goal: 'Software Engineer',
      progress: 50,
      lastSession: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
  }

  writeDatabase(db);
  res.status(201).json({ message: 'Session scheduled successfully', session: newSession });
});

// 3. Save Mentor Profile Settings
app.post('/api/mentor/save-settings', (req, res) => {
  const { email, name, expertise, bio, sessionRate } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const db = readDatabase();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase() && u.role === 'mentor');

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Mentor not found.' });
  }

  db.users[userIndex].name = name || db.users[userIndex].name;
  db.users[userIndex].profile = {
    ...db.users[userIndex].profile,
    skills: expertise || db.users[userIndex].profile.skills,
    bio: bio || db.users[userIndex].profile.bio || '',
    sessionRate: sessionRate || db.users[userIndex].profile.sessionRate || '1000'
  };

  writeDatabase(db);
  res.json({ message: 'Settings saved successfully', mentor: db.users[userIndex] });
});

// 4. Get Chat Rooms
app.get('/api/mentor/chat-rooms', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required.' });
  }

  const db = readDatabase();
  const mentor = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === 'mentor');

  if (!mentor) {
    return res.status(404).json({ error: 'Mentor not found.' });
  }

  const students = (db.mentorStudents || []).filter(s => s.mentorId === mentor.id);
  const messages = db.chatMessages || [];

  // Group rooms by studentName
  const rooms = students.map(s => {
    const studentMessages = messages.filter(m => m.studentName.toLowerCase() === s.studentName.toLowerCase());
    const lastMessage = studentMessages[studentMessages.length - 1];
    return {
      roomId: `room-${s.studentName.toLowerCase().replace(/\s+/g, '-')}`,
      studentName: s.studentName,
      lastMessageText: lastMessage ? lastMessage.text : 'Select a student to start chatting',
      lastMessageTime: lastMessage ? lastMessage.timestamp : ''
    };
  });

  res.json(rooms);
});

// 5. Get Chat Messages
app.get('/api/mentor/chat-messages', (req, res) => {
  const { roomId } = req.query;
  if (!roomId) {
    return res.status(400).json({ error: 'Room ID parameter is required.' });
  }

  const db = readDatabase();
  const messages = db.chatMessages || [];
  const roomMessages = messages.filter(m => m.roomId.toLowerCase() === roomId.toLowerCase());

  res.json(roomMessages);
});

// 6. Send Chat Message
app.post('/api/mentor/send-message', (req, res) => {
  const { roomId, studentName, sender, text } = req.body;
  if (!roomId || !studentName || !sender || !text) {
    return res.status(400).json({ error: 'All fields (roomId, studentName, sender, text) are required.' });
  }

  const db = readDatabase();
  if (!db.chatMessages) db.chatMessages = [];

  const newMessage = {
    id: Date.now(),
    roomId,
    studentName,
    sender,
    text,
    timestamp: new Date().toISOString()
  };

  db.chatMessages.push(newMessage);
  writeDatabase(db);

  res.status(201).json({ message: 'Message sent successfully', messageData: newMessage });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Node.js server running at http://localhost:${PORT}`);
});
