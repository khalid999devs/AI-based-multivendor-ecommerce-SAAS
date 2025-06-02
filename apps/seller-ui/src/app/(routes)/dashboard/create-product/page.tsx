"use client";
import ImagePlaceHolder from "@/shared/components/image-placeholder";
import { ChevronRight, Wand, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

import { Controller, useForm } from "react-hook-form";
import Input from "../../../../../../../packages/components/input";
import ColorSelector from "../../../../../../../packages/components/color-selector";
import CustomSpecifications from "../../../../../../../packages/components/custom-specifications";
import CustomProperties from "../../../../../../../packages/components/custom-properties";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import RichTextEditor from "../../../../../../../packages/components/rich-text-editor";
import SizeSelector from "../../../../../../../packages/components/size-selector";
import Image from "next/image";
import { enhancements } from "@/utils/AIEnhancements";
import toast from "react-hot-toast";

interface UploadedImage {
  fileId: string;
  file_url: string;
}

const Page = () => {
  const router = useRouter();
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string>("");
  const [isChanged, setIsChanged] = React.useState(true);
  const [images, setImages] = React.useState<(UploadedImage | null)[]>([null]);
  const [loading, setLoading] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [pictureUploadingLoader, setPictureUploadingLoader] =
    React.useState(false);
  const [activeEffect, setActiveEffect] = React.useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/product/api/get-categories");
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
  const { data: discountCodes = [], isLoading: discountLoading } = useQuery({
    queryKey: ["shop-discounts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-discount-codes");
      return res?.data?.discount_codes || [];
    },
  });

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || {};
  const selectedCategory = watch("category");
  const regularPrice = watch("regular_price");
  const subcategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  const onSubmit = async (data: any) => {
    console.log("hell");

    try {
      setLoading(true);
      await axiosInstance.post("/product/api/create-product", data);
      router.push("/dashboard/all-products");
    } catch (error: any) {
      toast.error(error?.response.data?.message || "Error creating product");
      console.log("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;
    setPictureUploadingLoader(true);
    try {
      const fileName = await convertFileToBase64(file);

      const response = await axiosInstance.post(
        "/product/api/upload-product-image",
        { fileName }
      );
      const uploadedImage: UploadedImage = {
        fileId: response.data.fileId,
        file_url: response.data.file_url,
      };

      let updatedImages = [...images];
      updatedImages[index] = uploadedImage;

      if (index === images.length - 1 && images.length < 8) {
        updatedImages.push(null);
      }
      setImages(updatedImages);
      setValue("images", updatedImages);
    } catch (error) {
      console.log("Error uploading image:", error);
    } finally {
      setPictureUploadingLoader(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    setPictureUploadingLoader(true);
    try {
      let updatedImages = [...images];
      const imageToDelete = updatedImages[index];
      if (imageToDelete && typeof imageToDelete === "object") {
        await axiosInstance.delete("/product/api/delete-product-image", {
          data: { fileId: imageToDelete.fileId! },
        });
      }
      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }

      // add null placeholder
      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      setImages(updatedImages);
      setValue("images", updatedImages);
    } catch (error) {
      console.log("Error removing image:", error);
    } finally {
      setPictureUploadingLoader(false);
    }
  };

  const applyTransformation = async (transformation: string) => {
    if (!selectedImage || processing) return;

    setProcessing(true);
    setActiveEffect(transformation);
    try {
      const transformUrl = `${selectedImage}?tr=${transformation}`;
      setSelectedImage(transformUrl);
    } catch (error) {
      console.log("Error applying transformation:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveDraft = () => {};

  return (
    <form
      className="text-white w-full mx-auto p-8 shadow-md rounded-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Heading & Breadcrumbs */}
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Product
      </h2>
      <div className="flex items-center">
        <span
          className="text-[#80Deea] cursor-pointer"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Dashboard
        </span>
        <ChevronRight size={20} className="opacity-[0.8]" />
        <span className="text-[#80Deea] cursor-pointer">Create Product</span>
      </div>

      {/* content layout */}
      <div className="py-4 w-full flex gap-6">
        {/* left side */}
        <div className="md:w-[35%]">
          {images?.length > 0 && (
            <ImagePlaceHolder
              setOpenImageModal={setOpenImageModal}
              size="765 x 850"
              small={false}
              index={0}
              onImageChange={handleImageChange}
              setSelectedImage={setSelectedImage}
              onRemove={handleRemoveImage}
              defaultImage={images[0]?.file_url ? images[0].file_url : null}
              pictureUploadingLoader={pictureUploadingLoader}
            />
          )}

          <div className="grid grid-cols-2 gap-3 mt-4">
            {images.slice(1).map((image: any, index: number) => (
              <ImagePlaceHolder
                setOpenImageModal={setOpenImageModal}
                size="765 x 850"
                key={index}
                small
                index={index + 1}
                onImageChange={handleImageChange}
                setSelectedImage={setSelectedImage}
                onRemove={handleRemoveImage}
                defaultImage={image?.file_url ? image.file_url : null}
                pictureUploadingLoader={pictureUploadingLoader}
              />
            ))}
          </div>
        </div>

        {/* right side */}
        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
            <div className="w-2/4">
              <Input
                label="Product Title *"
                placeholder="Enter product title "
                {...register("title", { required: "Title is required" })}
              />

              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message as string}
                </p>
              )}

              <div className="mt-3">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Short Description * (Max 150 words)"
                  placeholder="Enter product description for quick view"
                  {...register("short_description", {
                    required: "Description is required",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description cannot exceed 150 words (Current ${wordCount})`
                      );
                    },
                  })}
                />
                {errors.short_description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.short_description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <Input
                  label="Tags *"
                  placeholder="apple,flagship"
                  {...register("tags", {
                    required: "Seperate related product tags with comma",
                  })}
                />
                {errors.tags && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tags.message as string}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <Input
                  label="Warranty *"
                  placeholder="1 Year / No Warranty"
                  {...register("warranty", {
                    required: "Warranty is required!",
                  })}
                />
                {errors.warranty && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <Input
                  label="Slug *"
                  placeholder="product-slug"
                  {...register("slug", {
                    required: "Slug is required!",
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        "Invalid slug format! Use lowercase letters, numbers, and hyphens.",
                    },
                    minLength: {
                      value: 3,
                      message: "Slug must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 50,
                      message: "Slug cannot be longer than 50 characters.",
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <Input
                  label="Brand"
                  placeholder="Apple"
                  {...register("brand")}
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.brand.message as string}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <ColorSelector control={control} errors={errors} />
              </div>

              <div className="mt-3">
                <CustomSpecifications control={control} errors={errors} />
              </div>

              <div className="mt-3">
                <CustomProperties control={control} errors={errors} />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cash on Delivery *
                </label>
                <select
                  {...register("cash_on_delivery", {
                    required: "Cash on Delivery is required",
                  })}
                  defaultValue={"yes"}
                  className="w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md text-white"
                >
                  <option value="yes" className="bg-black-main">
                    Yes
                  </option>
                  <option value="no" className="bg-black-main">
                    No
                  </option>
                </select>
                {errors.cash_on_delivery && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cash_on_delivery.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="w-2/4">
              <label className="block font-medium text-gray-300 mb-1">
                Category *
              </label>
              {isLoading ? (
                <p className="text-gray-400">Loading categories...</p>
              ) : isError ? (
                <p className="text-red-500">Failed to load categories</p>
              ) : (
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required!" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md text-white"
                    >
                      <option value="" className="bg-black-main">
                        Select Category
                      </option>
                      {categories?.map((category: string) => (
                        <option
                          value={category}
                          key={category}
                          className="bg-black-main"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message as string}
                </p>
              )}

              <div className="mt-3">
                <label className="block font-semibold text-gray-300 mb-1">
                  Subcategory *
                </label>
                {isLoading ? (
                  <p className="text-gray-400">Loading subcategories...</p>
                ) : isError ? (
                  <p className="text-red-500">Failed to load subcategories</p>
                ) : (
                  <Controller
                    name="subcategory"
                    control={control}
                    rules={{ required: "Subcategory is required!" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full border outline-none border-gray-700 bg-transparent p-2 rounded-md text-white"
                      >
                        <option value="" className="bg-black-main">
                          Select Subcategory
                        </option>
                        {subcategories?.map((subcategory: string) => (
                          <option
                            value={subcategory}
                            key={subcategory}
                            className="bg-black-main"
                          >
                            {subcategory}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                )}
                {errors.subcategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subcategory.message as string}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <label className="block font-semibold text-gray-300 mb-1">
                  Detailed Description * (Min 100 words)
                </label>
                <Controller
                  name="detailed_description"
                  control={control}
                  rules={{
                    required: "Detailed description is required!",
                    validate: (value) => {
                      const wordCount = value
                        ?.split(/\s+/)
                        .filter((word: string) => word).length;
                      return (
                        wordCount >= 100 ||
                        "Description must be at least 100 words!"
                      );
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    );
                  }}
                />
                {errors.detailed_description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.detailed_description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <Input
                  label="Video URL"
                  placeholder="https://www.youtube.com/embed/xyz123"
                  {...register("video_url", {
                    pattern: {
                      value:
                        /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/[a-zA-Z0-9_-]+)$/,
                      message:
                        "Invalid Youtube embed URL! Use format: https://www.youtube.com/embed/xyz123",
                    },
                  })}
                />
                {errors.video_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.video_url.message as string}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <Input
                  label="Regular Price"
                  placeholder="20$"
                  {...register("regular_price", {
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be at least 1" },
                    validate: (value) =>
                      !isNaN(value) || "Only numbers are allowed",
                  })}
                />
                {errors.regular_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <Input
                  label="Sale Price *"
                  placeholder="15$"
                  {...register("sale_price", {
                    required: "Sale price is required!",
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be at least 1" },
                    validate: (value) => {
                      if (isNaN(value)) return "Only numbers are allowed";
                      if (regularPrice && value >= regularPrice) {
                        return "Sale price must be less than regular price";
                      }
                      return true;
                    },
                  })}
                />
                {errors.sale_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sale_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <Input
                  label="Stock *"
                  placeholder="100"
                  {...register("stock", {
                    required: "Stock is required!",
                    valueAsNumber: true,
                    min: { value: 1, message: "Stock must be at least 1" },
                    max: {
                      value: 1000,
                      message: "Stock cannot exceed 1000",
                    },
                    validate: (value) => {
                      if (isNaN(value)) return "Only numbers are allowed";
                      if (!Number.isInteger(value)) {
                        return "Stock must be a whole number!";
                      }
                      return true;
                    },
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <SizeSelector control={control} errors={errors} />
              </div>

              <div className="mt-3">
                <label className="block font-semibold text-gray-300 mb-1">
                  Select Discount Codes (optional)
                </label>

                {discountLoading ? (
                  <p className="text-gray-400">Loading discount codes...</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {discountCodes?.map((code: any) => (
                      <button
                        key={code.id}
                        className={`px-3 py-1 rounded-md font-semibold text-sm ${
                          watch("discountCodes")?.includes(code.id)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-700 hover:bg-gray-600"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          const currentSelection = watch("discountCodes") || [];
                          const updatedSelection = currentSelection.includes(
                            code.id
                          )
                            ? currentSelection.filter(
                                (id: any) => id !== code.id
                              )
                            : [...currentSelection, code.id];
                          setValue("discountCodes", updatedSelection);
                        }}
                      >
                        {code?.public_name} ({code.discountValue}
                        {code.discountType === "percentage" ? "%" : "$"})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openImageModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black-main bg-opacity-60 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[450px] text-white">
            <div className="flex justify-between items-center pb-3 mb-4">
              <h2 className="text-lg font-semibold">Enhance Product Image</h2>
              <X
                size={20}
                className="cursor-pointer hover:text-gray-400"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenImageModal(false);
                }}
              />
            </div>

            <div className="w-full h-[300px] rounded-md overflow-hidden border border-gray-600">
              <Image
                src={selectedImage}
                alt="image-selected"
                className="h-full w-full object-cover"
                width={400}
                height={350}
              />
            </div>

            {selectedImage && (
              <div className="mt-4 space-y-3">
                <h3 className="text-white text-sm  font-semibold">
                  AI Enhancements
                </h3>
                <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto">
                  {enhancements.map(({ label, effect }) => (
                    <button
                      key={effect}
                      className={`p-2 rounded-md flex items-center gap-2 ${
                        activeEffect === effect
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        applyTransformation(effect);
                      }}
                      disabled={processing}
                    >
                      <Wand size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        {isChanged && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 text-white rounded-md"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default Page;
