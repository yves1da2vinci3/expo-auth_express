// models/RefreshToken.js
import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
// Ensure you handle any errors during initialization
RefreshToken.$init.catch((error) => {
  console.error('Error during RefreshToken initialization:', error);
});

export default RefreshToken;
