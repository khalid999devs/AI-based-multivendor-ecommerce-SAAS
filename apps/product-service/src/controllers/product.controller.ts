import { NextFunction, Request, Response } from "express";
import prisma from "../../../../packages/libs/prisma";
import {
  NotFoundError,
  ValidationError,
} from "../../../../packages/error-handler";
import { imagekit } from "../../../../packages/libs/imageKit";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// get product categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await prisma.site_config.findFirst();
    if (!config) {
      return res.status(404).json({ message: "Categories not found" });
    }

    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    return next(error);
  }
};

// creating discount codes
export const createDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: {
        discountCode,
      },
    });

    if (isDiscountCodeExist) {
      return next(
        new ValidationError(
          "Discount code already available please use a different code!"
        )
      );
    }

    const discount_code = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parseFloat(discountValue),
        discountCode,
        sellerId: req.seller.id,
      },
    });
    return res.status(201).json({
      message: "Discount code created successfully",
      succeed: true,
      discount_code,
    });
  } catch (error) {
    return next(error);
  }
};

// get discount codes
export const getDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const discount_codes = await prisma.discount_codes.findMany({
      where: {
        sellerId: req.seller.id,
      },
    });

    return res.status(200).json({
      message: "Discount codes fetched successfully",
      succeed: true,
      discount_codes,
    });
  } catch (error) {
    return next(error);
  }
};

// delete discount code
export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller.id;

    const discount_code = await prisma.discount_codes.findUnique({
      where: {
        id,
      },
      select: { id: true, sellerId: true },
    });

    if (!discount_code) {
      return next(new NotFoundError("Discount code not found!"));
    }

    if (discount_code.sellerId !== sellerId) {
      return next(
        new ValidationError(
          "You are not authorized to delete this discount code!"
        )
      );
    }

    await prisma.discount_codes.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Discount code deleted successfully",
      succeed: true,
    });
  } catch (error) {
    return next(error);
  }
};

// upload product image
export const uploadProductImage = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileName } = req.body;
    const response = await imagekit.upload({
      file: fileName,
      fileName: `product-${Date.now()}.jpg`,
      folder: `/products/${req.seller.id}`,
    });
    res.status(201).json({
      message: "Product image uploaded successfully",
      succeed: true,
      file_url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    return next(error);
  }
};

// delete product image
export const deleteProductImage = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.body;
    if (!fileId) {
      return next(new ValidationError("File ID is required"));
    }
    const response = await imagekit.deleteFile(fileId);
    return res.status(200).json({
      message: "Product image deleted successfully",
      succeed: true,
      response,
    });
  } catch (error) {
    return next(error);
  }
};

// create-product
export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      short_description,
      detailed_description,
      warranty,
      custom_specifications,
      slug,
      tags,
      cash_on_delivery,
      brand,
      video_url,
      category,
      colors = [],
      sizes = [],
      discountCodes,
      stock,
      sale_price,
      regular_price,
      subcategory,
      customProperties = {},
      images = [],
    } = req.body;

    if (
      !title ||
      !slug ||
      !short_description ||
      !category ||
      !subcategory ||
      !sale_price ||
      !images ||
      !tags ||
      !stock ||
      !regular_price
    ) {
      return next(new ValidationError("Missing required fields!"));
    }
    if (!req.seller.id) {
      return next(new ValidationError("Only Seller can create a product!"));
    }

    const slugChecking = await prisma.products.findUnique({
      where: {
        slug: slug,
      },
    });

    if (slugChecking) {
      return next(
        new ValidationError("Slug already exists! Please use a different slug!")
      );
    }

    const newProduct = await prisma.products.create({
      data: {
        title,
        short_description,
        detailed_description,
        warranty,
        cashOnDelivery: cash_on_delivery,
        slug,
        shopId: req.seller?.shop?.id!,
        tags: Array.isArray(tags) ? tags : tags.split(","),
        brand,
        video_url,
        category,
        subCategory: subcategory,
        colors: colors || [],
        discount_codes: discountCodes.map((codeId: string) => codeId),
        sizes: sizes || [],
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        custom_properties: customProperties || {},
        custom_specifications: custom_specifications || {},
        images: {
          create:
            images
              ?.filter((img: any) => img && img.fileId && img.file_url)
              .map((image: any) => ({
                file_id: image.fileId,
                url: image.file_url,
              })) || [],
        },
      },
      include: {
        images: true,
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      succeed: true,
      product: newProduct,
    });
  } catch (error) {
    return next(error);
  }
};

// get shop products
export const getShopProducts = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId: req.seller?.shop?.id!,
      },
      include: {
        images: true,
      },
    });

    return res.status(200).json({
      message: "Shop products retrieved successfully",
      succeed: true,
      products,
    });
  } catch (error) {
    return next(error);
  }
};

// delete product
export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const product = await prisma.products.findUnique({
      where: {
        id: productId,
      },
      select: { id: true, shopId: true, isDeleted: true },
    });
    if (!product) {
      return next(new ValidationError("Product not found"));
    }
    if (product.shopId !== req.seller?.shop?.id) {
      return next(
        new ValidationError("You are not authorized to delete this product!")
      );
    }

    if (product.isDeleted) {
      return next(new ValidationError("Product is already deleted!"));
    }

    const deletedProduct = await prisma.products.update({
      where: {
        id: productId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set deletedAt to 24 hours from now
      },
    });

    return res.status(200).json({
      message:
        "Product is scheduled for deletion in 24 hours. You can restore it within this time.",
      succeed: true,
      deletedAt: deletedProduct.deletedAt,
    });
  } catch (error) {
    return next(error);
  }
};

// product restore
export const restoreProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const shopId = req.seller?.shop?.id;
    const product = await prisma.products.findUnique({
      where: {
        id: productId,
      },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!product) {
      return next(new ValidationError("Product not found"));
    }
    if (product.shopId !== shopId) {
      return next(
        new ValidationError("You are not authorized to restore this product!")
      );
    }

    if (!product.isDeleted) {
      return next(
        new ValidationError("Product is not in scheduled delete state!")
      );
    }

    await prisma.products.update({
      where: {
        id: productId,
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return res.status(200).json({
      message: "Product restored successfully!",
      succeed: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error restoring product",
      error: error,
    });
  }
};

// get seller stripe information
export const getStripeAccount = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const stripeId = req.seller?.stripeId;

    if (!stripeId) {
      return next(
        new ValidationError("Stripe account not found for this seller!")
      );
    }

    const account = await stripe.accounts.retrieve(stripeId);

    return res.status(200).json({
      message: "Stripe account retrieved successfully",
      succeed: true,
      stripeAccount: account,
    });
  } catch (error) {
    return next(error);
  }
};

// get All Products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    const baseFillter = {
      OR: [
        {
          starting_date: null,
        },
        {
          ending_date: null,
        },
      ],
    };
    const orderBy: Prisma.productsOrderByWithRelationInput =
      type === "latest"
        ? { createdAt: "desc" as Prisma.SortOrder }
        : { totalSales: "desc" as Prisma.SortOrder };

    const [products, total, top10Products] = await Promise.all([
      prisma.products.findMany({
        skip,
        take: limit,
        include: {
          images: true,
          Shop: true,
        },
        where: baseFillter,
        orderBy: {
          totalSales: "desc",
        },
      }),
      prisma.products.count({ where: baseFillter }),
      prisma.products.findMany({
        take: 10,
        where: baseFillter,
        orderBy,
      }),
    ]);

    res.status(200).json({
      products,
      top10By: type === "latest" ? "latest" : "topSales",
      top10Products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return next(error);
  }
};
