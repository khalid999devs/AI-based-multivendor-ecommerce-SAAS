import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import Input from "../input";
import { PlusCircle, Trash2 } from "lucide-react";

const CustomSpecifications = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_specifications",
  });
  return (
    <div>
      <label htmlFor="block font-semibold text-gray-300 mb-1">
        Custom Specifications:
      </label>
      <div className="flex flex-col gap-3  mt-2">
        {fields.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Controller
              name={`custom_specifications.${index}.name`}
              control={control}
              rules={{ required: "Specification Name is required" }}
              render={({ field }) => {
                return (
                  <Input
                    label="Specifications Name"
                    placeholder="e.g., Battery Life, Weight, Material"
                    {...field}
                  />
                );
              }}
            />

            <Controller
              name={`custom_specifications.${index}.value`}
              control={control}
              rules={{ required: "Specification Value is required" }}
              render={({ field }) => {
                return (
                  <Input
                    label="Value"
                    placeholder="e.g., 4000mAh, 1.5kg, Plastic"
                    {...field}
                  />
                );
              }}
            />

            <button
              type="button"
              className="text-red-500 hover:text-red-700 h-full flex items-center pt-5"
              onClick={() => remove(index)}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        <button
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          onClick={(e) => {
            e.preventDefault();
            append({ name: "", value: "" });
          }}
        >
          <PlusCircle size={20} /> Add Specification
        </button>
      </div>

      {errors.custom_specifications?.message && (
        <p className="text-red-500 text-xs mt-1">
          {String(errors.custom_specifications.message)}
        </p>
      )}
    </div>
  );
};

export default CustomSpecifications;
