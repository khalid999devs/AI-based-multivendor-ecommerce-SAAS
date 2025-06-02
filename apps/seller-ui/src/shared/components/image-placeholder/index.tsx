"use client";
import { Pencil, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Spinner from "../../../../../../packages/components/loaders/spinner";

const ImagePlaceHolder = ({
  size,
  small,
  onImageChange,
  onRemove,
  defaultImage = null,
  index = null,
  setOpenImageModal,
  setSelectedImage,
  pictureUploadingLoader,
}: {
  size: string;
  small?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove?: (index: number) => void;
  defaultImage?: string | null;
  index?: any;
  setOpenImageModal?: (openImageModal: boolean) => void;
  setSelectedImage?: (image: string) => void;
  pictureUploadingLoader?: boolean;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);

  useEffect(() => {
    setImagePreview(defaultImage);
  }, [defaultImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange(file, index!);
    }
  };
  return (
    <div
      className={`relative ${
        small ? "h-[180px]" : "h-[450px]"
      } w-full bg-[#1e1e1e] border border-gray-600 rounded-lg flex flex-col items-center justify-center`}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`image-upload-${index}`}
        onChange={handleFileChange}
      />

      {imagePreview ? (
        <>
          <button
            type="button"
            className="absolute top-3 right-3 p-2 !rounded bg-red-600 shadow-lg"
            onClick={(e) => {
              e.preventDefault();
              onRemove?.(index!);
            }}
            disabled={pictureUploadingLoader}
          >
            <X size={16} />
          </button>
          <button
            className="top-3 absolute right-[60px] bg-blue-600 shadow-lg p-2 !rounded cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setOpenImageModal?.(true);
              setSelectedImage?.(defaultImage!);
            }}
            disabled={pictureUploadingLoader}
          >
            <WandSparkles size={16} />
          </button>
        </>
      ) : (
        <label
          htmlFor={`image-upload-${index}`}
          className="absolute top-3 right-3 p-2 !rounded bg-slate-700 shadow-lg cursor-pointer"
        >
          <Pencil size={16} />
        </label>
      )}

      {imagePreview ? (
        <Image
          src={imagePreview}
          alt="uploaded"
          className={`w-full h-full object-cover rounded-lg ${
            pictureUploadingLoader ? "opacity-30" : ""
          }`}
          width={300}
          height={400}
        />
      ) : (
        <div
          className={`${
            pictureUploadingLoader ? "opacity-30" : ""
          } text-center flex flex-col items-center justify-center h-full`}
        >
          <p
            className={`text-gray-400 ${
              small ? "text-xl" : "text-4xl"
            } font-semibold`}
          >
            {size}
          </p>
          <p
            className={`text-gray-500 ${
              small ? "text-sm" : "text-lg"
            } pt-2 text-center px-2`}
          >
            Please choose an image <br />
            according to the expected ratio
          </p>
        </div>
      )}

      {pictureUploadingLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg z-10">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ImagePlaceHolder;
