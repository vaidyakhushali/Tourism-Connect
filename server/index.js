const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const User        = require('./models/User');
const Post        = require('./models/Post');
const Trip        = require('./models/Trip');
const Destination = require('./models/Destination');
// Add with your other model imports
const Comment = require('./models/comment');
const Message = require('./models/Message');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Connect to MongoDB ───────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── AUTH ─────────────────────────────────────────────────────
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const passport = require('passport');
const crypto   = require('crypto');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ─── PASSPORT / GOOGLE OAUTH ───────────────────────────────────
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || 'Google User';
    let user = null;

    if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      const baseUsername = (email ? email.split('@')[0] : name.replace(/\s+/g, '')).replace(/[^\w]/g, '').toLowerCase() || 'googleuser';
      let username = baseUsername;
      let suffix = 0;
      while (await User.findOne({ username })) {
        suffix += 1;
        username = `${baseUsername}${suffix}`;
      }

      user = await User.create({
        name,
        username,
        email,
        password: crypto.randomBytes(16).toString('hex'),
        initials: name.split(' ').map(w => w[0]).join('').toUpperCase(),
        avatar: profile.photos?.[0]?.value,
        verified: true,
      });
    }

    if (user && !user.avatar && profile.photos?.[0]?.value) {
      user.avatar = profile.photos[0].value;
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

const googleConfigured = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

app.use(passport.initialize());

// ─── MIDDLEWARE ───────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.isAdmin) return res.status(403).json({ message: 'Admin only' });
    next();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
// ─── COMMENTS ────────────────────────────────────────────────
// Get all comments (Admin only)
app.get('/api/comments', verifyToken, isAdmin, async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('userId', 'name username')
      .populate('postId', 'caption')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add comment (any logged in user)
app.post('/api/comments', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.create({
      postId: req.body.postId,
      userId: req.user.id,
      text:   req.body.text
    });
    res.status(201).json(comment);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete comment (Admin only)
app.delete('/api/comments/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ success: false, message: 'Username taken' });
    const user = await User.create({
      name,
      username,
      email,
      phone,
      password,
      initials: name.split(' ').map(w => w[0]).join('')
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, initials: user.initials, handle: '@' + user.username, isAdmin: user.isAdmin } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    // accept both 'username' and 'email' fields
    const { username, email, password } = req.body;
    const loginField = username || email;
    // try to find by username OR email
    const user = await User.findOne({ $or: [{ username: loginField }, { email: loginField }] });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: 'Invalid password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, initials: user.initials, handle: '@' + user.username, isAdmin: user.isAdmin, email: user.email, avatar: user.avatar } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: { id: user._id, name: user.name, initials: user.initials, handle: '@' + user.username, isAdmin: user.isAdmin, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Simple forgot-password endpoint (simulated)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { identifier } = req.body; // username or email
    if (!identifier) return res.status(400).json({ success: false, message: 'Missing identifier' });
    // attempt to find user by username or email
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    // In a real app: generate a token & send email. Here we simulate success without leaking account existence.
    console.log('Password reset requested for:', identifier, 'found user:', !!user);
    res.json({ success: true, message: 'If an account exists for that identifier, password reset instructions have been sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DESTINATIONS (CRUD) ──────────────────────────────────────
app.get('/api/destinations', async (req, res) => {
  try {
    const data = await Destination.find();
    const shaped = data.map(d => ({
      id:          d._id,
      name:        d.name,
      category:    d.category,
      country:     d.country,
      budget:      d.budget,
      rating:      d.rating,
      reviews:     d.reviews,
      image:       d.image,
      description: d.description,
      tags:        d.tags || []
    }));
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/destinations', async (req, res) => {
  try {
    const dest = await Destination.create(req.body);
    res.json(dest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/destinations/:id', async (req, res) => {
  try {
    const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/destinations/:id', async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POSTS (CRUD) ─────────────────────────────────────────────
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name initials color avatar').sort({ createdAt: -1 });
    const shaped = posts.map(p => ({
      id:          p._id,
      author:      p.user ? p.user.name : "Anonymous",
      avatar:      p.user ? (p.user.avatar || "") : "",
      initials:    p.user ? p.user.initials : "?",
      avatarColor: p.user ? p.user.color : "var(--gray)",
      location:    p.location,
      time:        p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Just now",
      content:     p.caption,
      image:       p.image,
      likes:       p.likes ? p.likes.length : 0,
      comments:    p.comments ? p.comments.length : 0,
      tags:        p.tags || []
    }));
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get comments for a specific post (anyone can view)
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate('userId', 'name username initials')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/posts', async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const { userId } = req.body;
    if (userId) {
      const idx = post.likes.indexOf(userId);
      if (idx === -1) post.likes.push(userId); else post.likes.splice(idx, 1);
      await post.save();
    }
    res.json({ success: true, likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── TRIPS (CRUD) ─────────────────────────────────────────────
app.get('/api/trips', async (req, res) => {
  try {
    const trips = await Trip.find().populate('members', 'initials');
    const shaped = trips.map(t => ({
      id:          t._id,
      title:       t.title,
      destination: t.destination,
      image:       t.image,
      date:        t.date,
      spots:       t.total - t.members.length,
      total:       t.total,
      organizer:   t.organizer,
      level:       t.level,
      description: t.description,
      itinerary:   t.itinerary || [],
      includes:    t.includes || [],
      gallery:     t.gallery || [],
      price:       t.price,
      members:     t.members.map(m => m.initials || '?'),
    }));
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/trips', async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put('/api/trips/:id', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/trips/:id', async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/trips/:id/join', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.members.length >= trip.total) return res.status(400).json({ message: 'Trip is full' });
    const { userId } = req.body;
    if (userId && !trip.members.includes(userId)) {
      trip.members.push(userId);
      await trip.save();
    }
    res.json({ success: true, filled: trip.members.length, spots: trip.total - trip.members.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── TRAVELERS ────────────────────────────────────────────────
app.get('/api/travelers', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: { $ne: true } }, '-password');
    const shaped = users.map(u => ({
      id:        u._id,
      name:      u.name,
      country:   u.country || "Poland",
      trips:     u.tripsCount || 0,
      followers: u.followers || 0,
      visited:   u.visited || [],
      avatar:    u.avatar || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&q=80",
      bio:       u.bio || "Wandering traveler ✨",
    }));
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/travelers/:id/follow', async (req, res) => {
  try {
    const traveler = await User.findById(req.params.id);
    if (traveler) {
      traveler.followers += 1;
      await traveler.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── MESSAGES / CHAT ─────────────────────────────────────────
// List recent conversations for the logged-in user
app.get('/api/messages/conversations', verifyToken, async (req, res) => {
  try {
    const myId = req.user.id;
    const msgs = await Message.find({ $or: [{ senderId: myId }, { receiverId: myId }] })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name initials')
      .populate('receiverId', 'name initials');
    const map = new Map();
    for (const m of msgs) {
      const other = (m.senderId && String(m.senderId._id) === String(myId)) ? m.receiverId : m.senderId;
      if (!other) continue;
      const key = String(other._id);
      if (!map.has(key)) {
        map.set(key, { _id: other._id, name: other.name, initials: other.initials, lastMessage: { text: m.text, createdAt: m.createdAt } });
      }
    }
    res.json(Array.from(map.values()));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get conversation between logged-in user and another user
app.get('/api/messages/:userId', verifyToken, async (req, res) => {
  try {
    const otherId = req.params.userId;
    const myId = req.user.id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name initials')
      .populate('receiverId', 'name initials');
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Send a message (logged-in user is sender)
app.post('/api/messages', verifyToken, async (req, res) => {
  try {
    const msg = await Message.create({
      senderId: req.user.id,
      receiverId: req.body.receiverId,
      text: req.body.text
    });
    const populated = await msg.populate('senderId', 'name initials').populate('receiverId', 'name initials');
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Mark messages from a specific user as seen (when recipient views them)
app.post('/api/messages/:userId/seen', verifyToken, async (req, res) => {
  try {
    await Message.updateMany({ senderId: req.params.userId, receiverId: req.user.id, seen: false }, { $set: { seen: true } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── ADMIN ────────────────────────────────────────────────────
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [users, posts, trips, destinations] = await Promise.all([
      User.countDocuments({ isAdmin: { $ne: true } }), Post.countDocuments(), Trip.countDocuments(), Destination.countDocuments()
    ]);
    res.json({ users, posts, trips, destinations, reports: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/admin/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/auth/google', (req, res, next) => {
  if (!googleConfigured) {
    return res.status(501).send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Google OAuth Not Configured</title>
          <style>
            body { margin: 0; font-family: system-ui, sans-serif; background: #f3f4f6; color: #111827; }
            .wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 32px; }
            .card { max-width: 620px; width: 100%; background: white; border-radius: 24px; box-shadow: 0 24px 60px rgba(15,23,42,0.12); padding: 36px; }
            h1 { margin-top: 0; font-size: 28px; }
            p { line-height: 1.7; margin: 16px 0; }
            code { background: #f9fafb; padding: 3px 6px; border-radius: 6px; }
            a { color: #2563eb; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="card">
              <h1>Google sign-in is not configured</h1>
              <p>The app attempted to redirect to Google sign-in, but the server does not currently support Google OAuth.</p>
              <p>Set <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> in <code>.env</code>, then restart the server.</p>
            </div>
          </div>
        </body>
      </html>
    `);
  }
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get(
  '/auth/google/callback',
  (req, res, next) => {
    if (!googleConfigured) {
      return res.status(501).send('Google OAuth is not configured');
    }
    return passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_URL}/login?error=google` })(req, res, next);
  },
  async (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const redirectUrl = new URL(`${clientUrl}/login`);
    redirectUrl.searchParams.set('token', token);
    res.redirect(redirectUrl.toString());
  }
);

// ─── Serve React in production ────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
}

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://localhost:${PORT}`));