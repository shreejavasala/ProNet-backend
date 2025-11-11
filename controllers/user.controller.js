import User from '../models/user.model.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if(!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPwd
    });

    console.log(`User registered successfully: ${newUser}`);
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      user: {
        ...newUser.toObject(),
        password: undefined
      } });

  } catch (error) {
    console.error(`Error in registering user: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  try {
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' });
    
    console.log(`Token: ${token}`);
    res.status(200).json({ 
      success: true,
      message: 'Login successful', 
      token, 
      user: { 
        ...user.toObject(),
        password: undefined
      }
    });
  } catch (error) {
    console.error(`Error in login user: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}
