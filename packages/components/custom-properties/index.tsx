import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import Input from "../input";
import { Plus, X } from "lucide-react";

const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = React.useState<
    { label: string; values: string[] }[]
  >([]);
  const [newLabel, setNewLabel] = React.useState("");
  const [newValues, setNewValues] = React.useState<string[]>([]); // <-- use array

  return (
    <div>
      <div className="flex flex-col gap-3  mt-2">
        <Controller
          name={`customProperties`}
          control={control}
          render={({ field }) => {
            useEffect(() => {
              field.onChange(properties);
            }, [properties]);

            const addProperty = () => {
              if (!newLabel.trim()) return;
              setProperties([...properties, { label: newLabel, values: [] }]);
              setNewLabel("");
              setNewValues([...newValues, ""]); // add empty value for new property
            };

            const addValue = (index: number) => {
              if (!newValues[index]?.trim()) return;
              let updatedProperties = [...properties];
              updatedProperties[index].values.push(newValues[index]);
              setProperties(updatedProperties);

              // Clear only the input for this property
              const updatedNewValues = [...newValues];
              updatedNewValues[index] = "";
              setNewValues(updatedNewValues);
            };

            const removeProperty = (index: number) => {
              setProperties(properties.filter((_, i) => i !== index));
              setNewValues(newValues.filter((_, i) => i !== index));
            };

            return (
              <div className="mt-3">
                <label className="block font-semibold text-gray-300 mb-1">
                  Custom Properties
                </label>

                <div className="flex flex-col gap-3">
                  {properties.map((property, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 p-3 rounded-lg bg-gray-900"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">
                          {property.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProperty(index)}
                        >
                          <X size={18} className="text-red-500" />
                        </button>
                      </div>

                      {/* add values to property */}
                      <div className="flex items-center mt-2 gap-2">
                        <input
                          type="text"
                          className="border outline-none border-gray-700 bg-gray-800 p-2 rounded-md text-white w-full"
                          placeholder="Enter value..."
                          value={newValues[index] || ""}
                          onChange={(e) => {
                            const updatedNewValues = [...newValues];
                            updatedNewValues[index] = e.target.value;
                            setNewValues(updatedNewValues);
                          }}
                        />

                        <button
                          type="button"
                          className="px-3 py-1 bg-blue-500 text-white rounded-md"
                          onClick={() => addValue(index)}
                        >
                          Add
                        </button>
                      </div>

                      {/* show values */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {property.values.map((value, valueIndex) => (
                          <span
                            key={valueIndex}
                            className="px-2 py-1 bg-gray-700 text-white rounded-md"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Add new Property*/}
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      placeholder="Enter property label (e.g., Material, Warranty)"
                      value={newLabel}
                      onChange={(e: any) => setNewLabel(e.target.value)}
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
                      onClick={addProperty}
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>

                {errors.customProperties?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {String(errors.customProperties.message)}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CustomProperties;
