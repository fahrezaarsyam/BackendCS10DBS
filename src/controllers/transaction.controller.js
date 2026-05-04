const TransactionService = require('../services/transaction.service');
const redisClient = require('../database/redis');
const UserService = require('../services/user.service');

class TransactionController {
  static async createTransaction(req, res, next) {
    try {
      const { user_id, item_id, quantity, description } = req.body;
      const transaction = await TransactionService.createTransaction({ user_id, item_id, quantity, description });

      // Task 4 — Log to Redis Streams
      const messageId = await redisClient.xAdd('transaction-logs', '*', {
        userId: String(transaction.user_id),
        itemId: String(transaction.item_id),
        total: String(transaction.total),
      });
      console.log('Redis Stream message ID:', messageId);

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        payload: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;
      const transaction = await TransactionService.getTransactionById(id);
      res.status(200).json({
        success: true,
        message: 'Transaction retrieved successfully',
        payload: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  static async payTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const result = await TransactionService.payTransaction(id, userId);
      
      // INVALIDATE CACHE: After payment, the user's balance has changed.
      // We must delete the user cache so the dashboard shows the new balance.
      const user = await UserService.getUserById(userId);
      if (user && user.email) {
        await redisClient.del(`user:${user.email}`);
        console.log(`Cache invalidated for user:${user.email} after payment`);
      }

      res.status(200).json({
        success: true,
        message: 'Payment successful',
        payload: {
          transaction_id: result.transactionId,
          new_balance: result.newBalance,
          status: 'paid',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTransaction(req, res, next) {
    try {
      const { id } = req.params;
      await TransactionService.deleteTransaction(id);
      res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
        payload: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;