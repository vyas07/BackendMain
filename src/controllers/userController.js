const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
      const { 
        username, 
        email, 
        password, 
        fullName, 
        dateOfBirth, 
        gender} = req.body;
  
      // Check if the username or email is already registered
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email is already in use' });
      }

       // Generate salt
       const saltRounds = 10;
       const salt = await bcrypt.genSalt(saltRounds);

       // Hash the password using the salt
       const hashedPassword = await bcrypt.hash(password, salt)
  
      // Create a new user instance
      const newUser = new User({
        username,
        email,
        password : hashedPassword,
        fullName,
        dateOfBirth,
        gender});
  
      // Save the user to the database
      await newUser.save();
  
      // Respond with success message
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error in user signup:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
// Get user by email, and password
// To retreive login information.
//1. By email and password
exports.getUserByRoleEmailAndPassword = async (req, res) => {
    const { email, password: userPassword } = req.body;

    try {
        // Find the user by email, and password
        const user = await User.findOne({ email });

        // If user not found or password doesn't match
        if (!user || !(await user.comparePassword(userPassword))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Exclude the password field from the user object
        const { password, ...userWithoutPassword } = user.toObject();

        // If user and password match
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// 2. By phonenumber 
// To Do: Introduce an OTP service.
exports.getUserByPhone = async(req, res) =>{
    const{phoneNumber}  = req.body;

    try{
        const user = await User.findOne({phoneNumber});
         // If user not found or password doesn't match
         if (!user) {
            return res.status(401).json({ message: 'Invalid phone number.' });
        }
        // If user and password match
        res.json(user);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}


// Read all users
// To be used in Role:Admin.
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Read a single user by ID
// In admin
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
