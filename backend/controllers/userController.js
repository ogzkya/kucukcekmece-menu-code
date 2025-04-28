// backend/controllers/userController.js
import User from '../models/User.js';

// @desc    Get all admin users
// @route   GET /api/users/admins
// @access  Private/Admin
export const getAdminUsers = async (req, res) => {
  try {
    const adminUsers = await User.find({ isAdmin: true }).select('-password');
    res.json(adminUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new admin user
// @route   POST /api/users/admin
// @access  Private/Admin
export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Bu email adresi ile kayıtlı bir kullanıcı zaten mevcut' });
    }

    // Create new admin user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: true,
    });

    // Return the created user without password
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400).json({ message: 'Geçersiz kullanıcı bilgileri' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get admin user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update admin user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      // Güncelleme işlemleri
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
      
      // Şifre değişikliği varsa
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    // Kullanıcının kendisini silmesini engelle
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Kendi hesabınızı silemezsiniz' });
    }
    
    if (user) {
      await user.deleteOne();
      res.json({ message: 'Kullanıcı silindi' });
    } else {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};