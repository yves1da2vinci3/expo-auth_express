// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js'; // Assuming you have a RefreshToken model
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{expiresIn: "7d"});
};

const saveRefreshToken = async (user, refreshToken) => {
  const existingToken = await RefreshToken.findOne({ user: user._id });

  if (existingToken) {
    existingToken.token = refreshToken;
    await existingToken.save();
  } else {
    const newRefreshToken = new RefreshToken({ user: user._id, token: refreshToken });
    await newRefreshToken.save();
  }
};

const register = async (req, res) => {
  try {
    const { username, password,email } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashedPassword });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log("credententials : ",req.body)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Save refresh token to the database
    await saveRefreshToken(user, refreshToken);

    res.json({ accessToken, refreshToken ,user});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log('refreshToken', refreshToken);

  // console.log('refreshToken secret key: ', process.env.REFRESH_TOKEN_SECRET);
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    try {
      // Check if the refresh token exists in the database
      console.log("first")
      const storedToken = await RefreshToken.findOne({ user: decoded.userId });

      if (!storedToken || storedToken.token !== refreshToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // Generate a new access token

      const newAccessToken = generateAccessToken({ userId: decoded.userId });
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Error checking refresh token in the database:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
};


export { register, login, refreshToken };
