import type { Request, Response } from 'express';
import type { AddAddressInput } from '../dtos/address/add-address.dto';
import { ApiResponseHelper } from '../helpers/api.helper';
import logger from '../logging/logger';
import type { UpdateAddressInput } from '../dtos/address/update-address.dto';
import { Product } from '../models/product.model';
import { redis } from '../libs/redis';
import { User } from '../models/user.model';

export const addAddress = async (req: Request<{}, {}, AddAddressInput>, res: Response) => {
  try {
    logger.info('create newaddress ...');
    const { city, fullName, label, phoneNumber, state, streetAddress, zipCode, isDefault } =
      req.body;
    const user = req.user;
    if (isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }
    const newAddress = {
      city,
      fullName,
      isDefault: isDefault ?? user.addresses.length === 0,
      label,
      phoneNumber,
      state,
      streetAddress,
      zipCode,
    };
    user.addresses.push(newAddress);
    await user.save();
    await redis.del(`user:${user._id}:addresses`);
    logger.info('address created successfully');
    return res
      .status(201)
      .json(
        ApiResponseHelper.success('address created sucessfully', { address: newAddress }, req.path),
      );
  } catch (error) {
    logger.error('error creating new address', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to create new address', req.path, error));
  }
};

export const getAddresses = async (req: Request, res: Response) => {
  try {
    logger.info('fetching user addresses');
    const user = req.user;
    const cacheKey = `user:${user._id}:addresses`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.info('returning addresses from cache');
      return res
        .status(200)
        .json(ApiResponseHelper.success('addresses fetched (cache)', JSON.parse(cached), req.path));
    }
    const addresses = user.addresses;
    await redis.set(cacheKey, JSON.stringify(addresses), 'EX', 60 * 60 * 24);
    return res
      .status(200)
      .json(ApiResponseHelper.success('user addresses fetched successfully', addresses, req.path));
  } catch (error) {
    logger.error('failed to fetch user addresses', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to fetch user addresses', req.path, error));
  }
};

export const updateAddress = async (
  req: Request<{ addressId: string }, {}, UpdateAddressInput>,
  res: Response,
) => {
  try {
    logger.info('updating address...');
    const { city, fullName, isDefault, label, phoneNumber, state, streetAddress, zipCode } =
      req.body;
    const { addressId } = req.params;

    if (!req.user) {
      return res.status(401).json(ApiResponseHelper.unauthorized('unauthorized', req.path));
    }

    const user = req.user;
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json(ApiResponseHelper.notFound('address not found', req.path));
    }

    // Prevent unsetting default without selecting a new one
    if (address.isDefault && isDefault === false) {
      return res
        .status(400)
        .json(
          ApiResponseHelper.badRequest(
            'you cannot unset the default address without selecting another default',
            req.path,
          ),
        );
    }

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    address.city = city ?? address.city;
    address.fullName = fullName ?? address.fullName;
    address.label = label ?? address.label;
    address.phoneNumber = phoneNumber ?? address.phoneNumber;
    address.state = state ?? address.state;
    address.streetAddress = streetAddress ?? address.streetAddress;
    address.zipCode = zipCode ?? address.zipCode;

    await user.save();
    await redis.del(`user:${user._id}:addresses`);

    logger.info('address updated successfully');
    return res
      .status(200)
      .json(ApiResponseHelper.success('address updated successfully', { address }, req.path));
  } catch (error) {
    logger.error('error updating address', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('error updating address', req.path, error));
  }
};

export const deleteAddress = async (req: Request<{ addressId: string }>, res: Response) => {
  try {
    logger.info('deleting address ...');
    const { addressId } = req.params;
    const user = req.user;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json(ApiResponseHelper.notFound('address not found', req.path));
    }

    const isDeletingDefault = address.isDefault;

    user.addresses.pull(addressId);

    // If the deleted one was default we auto-assign new default
    if (isDeletingDefault && user.addresses.length > 0) {
      user.addresses[0]!.isDefault = true;
    }

    await user.save();
    await redis.del(`user:${user._id}:addresses`);

    return res
      .status(200)
      .json(
        ApiResponseHelper.success(
          'address deleted successfully',
          { defaultReassigned: isDeletingDefault },
          req.path,
        ),
      );
  } catch (error) {
    logger.error('error deleting address', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to delete address', req.path, error));
  }
};

export const getWishList = async (req: Request, res: Response) => {
  try {
    logger.info('fetching wishlist ...');
    const cacheKey = `user:${req.user._id}:wishlist`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.info('returning wishlist from cache');
      return res
        .status(200)
        .json(ApiResponseHelper.success('wishlist fetched (cache)', JSON.parse(cached), req.path));
    }
    const user = await User.findById(req.user._id).populate('wishlist', '-__v');
    await redis.set(cacheKey, JSON.stringify(user?.wishlist), 'EX', 60 * 60 * 24);
    return res
      .status(200)
      .json(ApiResponseHelper.success('wishlist fetched succesfully', user?.wishlist, req.path));
  } catch (error) {
    logger.error('error fetching wishlist', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('error fetching wishlist', req.path, error));
  }
};

export const addToWishList = async (req: Request<{}, {}, { productId: string }>, res: Response) => {
  try {
    logger.info('adding product to wishlist ...');
    const user = req.user;
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(ApiResponseHelper.notFound('product not found', req.path));
    }
    if (user.wishlist.some((id) => id.toString() === productId)) {
      return res
        .status(400)
        .json(ApiResponseHelper.badRequest('product already exists in user whishlist', req.path));
    }
    user.wishlist.push(productId);
    await user.save();
    await redis.del(`user:${user._id}:wishlist`);
    logger.info('product added to wishlist succesfully');
    return res.status(200).json(
      ApiResponseHelper.success(
        'product added to the wishlist succesfully',
        {
          wishlist: user.wishlist,
        },
        req.path,
      ),
    );
  } catch (error) {
    logger.error('error adding product to wishlist', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('error adding product to wishlist', req.path, error));
  }
};

export const deleteProductFromWishList = async (
  req: Request<{ productId: string }, {}, {}>,
  res: Response,
) => {
  try {
    logger.info('deleting product from user wishlist ...');
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(ApiResponseHelper.notFound('product not found', req.path));
    }
    const user = req.user;
    if (!user.wishlist.some((id) => id.toString() === productId)) {
      return res
        .status(400)
        .json(ApiResponseHelper.badRequest('product doesent exist in the user wishlist'));
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { wishlist: productId } },
      { new: true, select: 'wishlist' },
    );

    await redis.del(`user:${user._id}:wishlist`);
    logger.info(`user ${user._id} deleted ${productId} from wishlist`);
    return res
      .status(200)
      .json(
        ApiResponseHelper.success(
          'product deleted from wishlist succesfully',
          { wishlist: updatedUser?.wishlist },
          req.path,
        ),
      );
  } catch (error) {
    logger.error('error deletig product from user wishlist', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('error deleting product from wishlist', req.path, error));
  }
};
