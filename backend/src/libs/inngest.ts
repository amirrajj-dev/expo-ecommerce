import { connectToDb } from '../db/connectToDb';
import { Inngest } from 'inngest';
import { User } from '../models/user.model';
import logger from '../logging/logger';
import type { IUser } from '../interfaces/user.interface';
import { transporter } from './nodemailer';
import { ENV } from '../configs/env';
import { WELCOME_EMAIL_HTML } from '../helpers/welcome-email';
import { redis } from './redis';

export const inngest = new Inngest({
  id: 'expo-commerce',
});

const syncUser = inngest.createFunction(
  {
    id: 'sync-user',
  },
  {
    event: 'clerk/user.created',
  },
  async ({ event }) => {
    try {
      logger.info('syncing user ...');
      await connectToDb();
      const { id, email_addresses, first_name, last_name, image_url } = event.data;
      const usersName = first_name
        ? first_name
        : 'anonymous' + ' ' + last_name
          ? last_name
          : 'user';
      const newUser: IUser = {
        clerkId: id,
        name: usersName,
        email: email_addresses[0]?.email_address,
        addresses: [],
        imageUrl: image_url,
        wishlist: [],
      };
      await User.create(newUser);
      await redis.del('users:all');
      // sending welcome email
      try {
        await transporter.sendMail({
          from: ENV.EMAIL_USER,
          to: newUser.email,
          subject: 'Welcome to Expo-Ecommerce 🎉',
          html: WELCOME_EMAIL_HTML(newUser.name),
        });
      } catch (error) {
        logger.error(
          `failed to send welcome email => ${error instanceof Error ? error.message : error}`,
        );
      }
    } catch (error) {
      logger.error(`error syncing user => ${error instanceof Error ? error.message : error}`);
    }
  },
);

const deleteUser = inngest.createFunction(
  { id: 'delete-user' },
  {
    event: 'clerk/user.deleted',
  },
  async ({ event }) => {
    try {
      logger.info('deleting user ...');
      await connectToDb();
      const { id } = event.data;
      await User.deleteOne({
        clerkId: id,
      });
      await redis.del('users:all');
    } catch (error) {
      logger.error(`error deleting user => ${error instanceof Error ? error.message : error}`);
    }
  },
);

export const functions = [syncUser, deleteUser];
