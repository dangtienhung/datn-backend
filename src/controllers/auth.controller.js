import { userLoginValidate, userRegisterValidate } from '../validates/index.js';

import Role from '../models/role.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import slugify from 'slugify';

export const authController = {
  /* generate token */
  generateToken: async (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
    return token;
  },
  refreshToken: async (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
    return token;
  },
  /* register */
  register: async (req, res) => {
    try {
      const body = req.body;
      /* validate */
      const { error } = userRegisterValidate.validate(body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      /* check unique username */
      const usernameUnique = await User.findOne({ username: body.username });
      if (usernameUnique) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      /* check email */
      const emailExits = await User.findOne({ email: body.email });
      if (emailExits) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      /* create slug */
      // const slug = slugify(body.username, { lower: true });
      // body.slug = slug;
      /* hash password */
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(body.password, salt);
      body.password = hashPassword;
      /* create */
      /* gán giá trị mặc định role là customeer */
      const roles = await Role.findOne({ name: 'customer' });
      if (!roles) {
        return res.status(400).json({ message: 'Role does not exist' });
      }
      body.role = roles._id;
      /* tạo ra avatar */
      const avatar = `https://ui-avatars.com/api/?name=${body.username}`;
      body.avatar = avatar;
      const user = await User.create(body);
      console.log('🚀 ~ file: auth.controller.js:59 ~ user ~ user:', user);
      if (!user) {
        return res.status(400).json({ message: 'Create user failed' });
      }
      /* loại bỏ passwork */
      const { password, ...info } = user._doc;
      return res.status(201).json({ data: info });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },
  /* login */
  login: async (req, res) => {
    try {
      const body = req.body;
      console.log('🚀 ~ file: auth.controller.js:71 ~ login: ~ body:', body);
      /* validate */
      const { error } = userLoginValidate.validate(body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      /* check email */
      const emailExits = await User.findOne({ email: body.email }).populate(
        { path: 'role', select: '-users' },
        { path: 'address', select: 'name phone address' }
      );
      console.log('🚀 ~ file: auth.controller.js:81 ~ login: ~ emailExits:', emailExits);
      if (!emailExits) {
        return res.status(400).json({ message: 'Email does not exist' });
      }
      /* check password */
      const validPassword = await bcrypt.compare(body.password, emailExits.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Password is incorrect' });
      }
      if (emailExits && validPassword) {
        /* create token */
        const token = await authController.generateToken(emailExits);
        /* remove password */
        const { password, ...info } = emailExits._doc;
        return res.status(200).json({ user: { ...info, accessToken: token } });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  },
};
