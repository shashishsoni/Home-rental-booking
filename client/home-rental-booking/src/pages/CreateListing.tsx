import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { categories, types, facilities } from '@/data';
import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IoIosImages } from "react-icons/io"


const CreateListing = () => {
  // ADD UPLOAD , DRAG AND REMOVE PHOTOS

  const [photos, setPhotos] = useState<File[]>([]);

  // Handle file uploads
  const handleUploadsPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhotos = Array.from(e.target.files || []); // Convert FileList to an array
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]); // Append new photos to the state
  };

  // Handle drag and drop reordering
  const handleDragAndDrop = (result: any) => {
    if (!result.destination) return; // If dropped outside a valid droppable, do nothing
    const items = Array.from(photos); // Clone the photos array
    const [reorderedItem] = items.splice(result.source.index, 1); // Remove dragged item
    items.splice(result.destination.index, 0, reorderedItem); // Insert it at the new position
    setPhotos(items); // Update state
  };

  // Remove a photo
  const removePhoto = (indexToRemove: number) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };
  return (
    <>
      <Navbar />
      <div className="w-screen h-full flex flex-col">
        <div className="bg- w-[80%] flex flex-col p-6 md:px-10 mt-28 m-auto rounded-md shadow-lg hover:shadow-xl transition-shadow border-white border-[3px]">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-black py-8 pt-0">
            Publish Your Place
          </h1>
          <div className="flex-grow">
            <form className="flex flex-col bg-[#F6ECEA] shadow-2xl rounded-lg p-6 md:p-8 lg:p-10 space-y-8 max-w-6xl mx-auto border-white border-[3px]">
              {/* Step 1 */}
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                  Step 1: Tell Me About Your Place
                </h2>
                <hr className="border-gray-300 mb-6" />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Which of these categories best describes your place?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                  {categories.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 shadow-lg rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-200 transition duration-200 cursor-pointer transform hover:scale-105"
                    >
                      <div className="text-3xl mb-2">{typeof item.icon === 'function' ? item.icon() : item.icon}</div>
                      <p className="text-gray-700 text-sm">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Types */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  What type of place will guests have?
                </h3>
                <div className="space-y-6">
                  {types.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 shadow-lg rounded-lg p-6 flex justify-between items-center hover:bg-gray-200 transition duration-200 cursor-pointer transform hover:scale-105"
                    >
                      <div>
                        <h4 className="text-base md:text-lg font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="text-3xl">{item.icon}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Inputs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Where's Your Place Located?</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                    <input
                      type="text"
                      placeholder="Street Address"
                      name="streetaddress"
                      required
                      className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Apartment, Suite, etc. (If Applicable)
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment, Suite, etc."
                        name="apartment"
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        name="city"
                        required
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Province</label>
                      <input
                        type="text"
                        placeholder="Province"
                        name="province"
                        required
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md  p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Country</label>
                      <input
                        type="text"
                        placeholder="Country"
                        name="country"
                        required
                        className="w-full border bg-white border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-300 transition duration-200"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-4 ">Share Some Basics About Your Place</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-40 border bg-white border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <p className="text-lg font-medium mb-0 w-1/3">Guest</p>
                      <div className="flex items-center space-x-2 w-1/3 justify-center">
                        <RemoveCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                        <p className="mx-2">1</p>
                        <AddCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center space-x-36 border bg-white border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <p className="text-lg font-medium mb-0 w-1/3">BedRooms</p>
                      <div className="flex items-center space-x-2 w-1/3 justify-center">
                        <RemoveCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                        <p className="mx-2">1</p>
                        <AddCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center space-x-36 border bg-white border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <p className="text-lg font-medium mb-0 w-1/3">Beds</p>
                      <div className="flex items-center space-x-2 w-1/3 justify-center">
                        <RemoveCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                        <p className="mx-2">1</p>
                        <AddCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center space-x-36 border bg-white border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <p className="text-lg font-medium mb-0 w-1/3">BathRooms</p>
                      <div className="flex items-center space-x-2 w-1/3 justify-center">
                        <RemoveCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                        <p className="mx-2">1</p>
                        <AddCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="flex-grow">
            <form className="flex flex-col bg-[#F6ECEA] shadow-2xl rounded-lg p-6 md:p-8 lg:p-10 space-y-8 max-w-6xl mx-auto border-white border-[3px] mt-7">
              {/* Step 2 */}
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                  Step 2: Tell Me About Your Place
                </h2>
                <hr className="border-gray-300 mb-6" />
              </div>

              {/* facilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Tell Guests What Your Place Offers
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                  {facilities.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 shadow-lg rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-200 transition duration-200 cursor-pointer transform hover:scale-105"
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <p className="text-gray-700 text-sm">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* {add some photo} */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Add Some Photos of Your Place
                </h3>
                <DragDropContext onDragEnd={handleDragAndDrop}>
                  <Droppable droppableId="photo" direction="horizontal">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[200px] ${photos.length ? "overflow-x-auto space-x-4" : "flex-col space-y-4"
                          }`}
                      >
                        {photos.length < 1 ? (
                          <>
                            <input
                              id="image"
                              type="file"
                              style={{ display: "none" }}
                              accept="image/*"
                              onChange={handleUploadsPhoto}
                              multiple
                            />
                            <label
                              htmlFor="image"
                              className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-gray-700"
                            >
                              <div className="text-6xl text-gray-400">
                                <IoIosImages />
                              </div>
                              <p className="mt-2 text-sm">Upload From Your Device</p>
                            </label>
                          </>
                        ) : (
                          photos.map((photo, index) => (
                            <Draggable key={index} draggableId={String(index)} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="relative flex-shrink-0 w-32 h-32 rounded-lg border border-gray-300 overflow-hidden shadow-sm"
                                >
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`Uploaded ${index}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    onClick={() => removePhoto(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full p-1 hover:bg-red-600"
                                  >
                                    &times;
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {/* Conditionally render upload button */}
                {photos.length > 0 && (
                  <div className="mt-4 flex justify-center">
                    <label
                      htmlFor="image"
                      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Upload More Photos
                    </label>
                    <input
                      id="image"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleUploadsPhoto}
                      multiple
                    />
                  </div>
                )}
              </div>

              {/* Address Inputs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Where's Your Place Located?</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                    <input
                      type="text"
                      placeholder="Street Address"
                      name="streetaddress"
                      required
                      className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Apartment, Suite, etc. (If Applicable)
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment, Suite, etc."
                        name="apartment"
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        name="city"
                        required
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Province</label>
                      <input
                        type="text"
                        placeholder="Province"
                        name="province"
                        required
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md  p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Country</label>
                      <input
                        type="text"
                        placeholder="Country"
                        name="country"
                        required
                        className="w-full border bg-white border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-300 transition duration-200"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-4 ">Share Some Basics About Your Place</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-40 border bg-white border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <p className="text-lg font-medium mb-0 w-1/3">Guest</p>
                      <div className="flex items-center space-x-2 w-1/3 justify-center">
                        <RemoveCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                        <p className="mx-2">1</p>
                        <AddCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center space-x-36 border bg-white border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <p className="text-lg font-medium mb-0 w-1/3">BedRooms</p>
                      <div className="flex items-center space-x-2 w-1/3 justify-center">
                        <RemoveCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                        <p className="mx-2">1</p>
                        <AddCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center space-x-36 border bg-white border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <p className="text-lg font-medium mb-0 w-1/3">Beds</p>
                      <div className="flex items-center space-x-2 w-1/3 justify-center">
                        <RemoveCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                        <p className="mx-2">1</p>
                        <AddCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center space-x-36 border bg-white border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <p className="text-lg font-medium mb-0 w-1/3">BathRooms</p>
                      <div className="flex items-center space-x-2 w-1/3 justify-center">
                        <RemoveCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                        <p className="mx-2">1</p>
                        <AddCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateListing;
