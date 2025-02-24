import { RequestHandler } from 'express';
import { UserService } from './user.service';

const createUser: RequestHandler = async (req, res) => {
  const payload = req.body.student;
  try {
    const result = await UserService.createUserIntoDB(payload);
    res.status(200).json({
      success: 'true',
      data: result,
      message: 'User created successfully',
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllUser: RequestHandler = async (req, res) => {
  try {
    const result = await UserService.getAllUsersFromDB();
    res.status(200).json({
      success: 'true',
      data: result,
      message: 'All users fetched successfully',
    });
  } catch (err) {
    console.log(err);
  }
};

const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await UserService.getUserByIdfromDB(id);
    res.status(200).json({
      success: 'true',
      message: 'User fetched successfully!',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const UserController = {
  getAllUser,
  createUser,
  getUserById,
};
