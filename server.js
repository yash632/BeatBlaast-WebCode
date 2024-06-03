const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const mongoURI1 = process.env.MONGO_URI;
const mongoURI2 = process.env.MONGO_URI2;
const jwtSecret = process.env.JWT_SECRET;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const connection1 = mongoose.createConnection(mongoURI1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection2 = mongoose.createConnection(mongoURI2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection1.on('connected', () => {
  console.log('MongoDB1 is connected');
});

connection2.on('connected', () => {
  console.log('MongoDB2 connected');
});

const User = connection1.model('User', require('./models/User').schema);
const Review = connection2.model('Review', require('./models/Review').schema);
app.post('/signup', async (req, res) => {
  const { fullName, email, password, mobileNo } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      mobileNo
    });

    await newUser.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

    res.json({ token, user: { Name: user.fullName, Email: user.email, MobileNo: user.mobileNo, Password: user.password } });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.post('/submit_review', async (req, res) => {
  const { nameForReview,reviewInput } = req.body;

  try {

    const newReview = new Review({
      nameForReview,
      reviewInput
    });

    await newReview.save();
    res.status(201).send('Review Saved ');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.get('/all_reviews', async (req, res) => {
  try {
    const allReviews = await Review.find({}); // Fetch all reviews from the database
    res.json(allReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
