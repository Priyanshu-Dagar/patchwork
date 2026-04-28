const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const config = require('./config.json');

const app = express();

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Expose user to templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const timebankRoutes = require('./routes/timebank');
const showcaseRoutes = require('./routes/showcase');
const certificateRoutes = require('./routes/certificates');
const { requireLogin } = require('./middleware/auth');
const Project = require('./models/Project');

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/skills', skillRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/timebank', timebankRoutes);
app.use('/showcase', showcaseRoutes);
app.use('/certificates', certificateRoutes);

// Global middleware to populate active project for logged in users
app.use(async (req, res, next) => {
  if (req.session.user && req.session.user.activeProject) {
    try {
      const project = await Project.findById(req.session.user.activeProject);
      res.locals.activeProject = project;
    } catch (err) {
      console.error('Error fetching active project:', err);
    }
  } else {
    res.locals.activeProject = null;
  }
  next();
});

// Protected Dashboard
app.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard', { title: 'Dashboard - Patchwork' });
});

// Basic route
app.get('/', (req, res) => {
  res.render('index', { title: 'Patchwork - Skill Sharing' });
});

// Auth redirect shortcuts
app.get('/login', (req, res) => res.redirect('/auth/login'));
app.get('/register', (req, res) => res.redirect('/auth/register'));

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || config.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
