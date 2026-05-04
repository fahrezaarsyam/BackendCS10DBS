const UserService = require('../services/user.service');
const { AppError } = require('../middleware/errorHandler');
const redisClient = require('../database/redis');

class UserController {
  static async register(req, res, next) {
    try {
      const { name, username, email, phone, password } = req.body;
      const user = await UserService.register({ name, username, email, phone, password });
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token, user } = await UserService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        payload: {
          token,
          id: user.id,
          user
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { id, name, username, email, phone, password, balance } = req.body;
      const updatedUser = await UserService.updateProfile(id, { name, username, email, phone, password, balance });

      if (email) {
        await redisClient.del(`user:${email}`);
        console.log(`Cache invalidated for user:${email}`);
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const history = await UserService.getTransactionHistory(userId);
      res.status(200).json({
        success: true,
        message: 'Transaction history retrieved',
        payload: history,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTotalSpent(req, res, next) {
    try {
      const userId = req.user.userId;
      const totalSpent = await UserService.getTotalSpent(userId);
      res.status(200).json({
        success: true,
        message: 'Total spent retrieved',
        payload: { total_spent: totalSpent },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserByEmail(req, res, next) {
    try {
      const { email } = req.params;
      const key = `user:${email}`;

      const cached = await redisClient.get(key);
      if (cached) {
        console.log('Cache Hit');
        return res.status(200).json({
          success: true,
          message: 'User retrieved (cache)',
          payload: JSON.parse(cached),
        });
      }

      console.log('Cache Miss');
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      await redisClient.setEx(key, 60, JSON.stringify(user));

      return res.status(200).json({
        success: true,
        message: 'User retrieved (database)',
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async topUpBalance(req, res, next) {
    try {
      const { amount } = req.body;
      const userId = req.user.userId;
      const updatedUser = await UserService.topUp(userId, amount);
      
      // Invalidate cache if user email is known
      if (updatedUser.email) {
        await redisClient.del(`user:${updatedUser.email}`);
      }

      res.status(200).json({
        success: true,
        message: 'Balance topped up successfully',
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;