import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { categories, types, facilities } from '@/data';
import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IoIosImages } from "react-icons/io"


const CreateListing = () => {
  //Create all the Function
  const [category, setCategory] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [amenities, setAmenities] = useState<string[]>([]);

  const [AddressForm, setAddressForm] = useState({
    streetaddress: '',
    apartment: '',
    city: '',
    province: '',
    country: '',
  });

  console.log(AddressForm);

  const handlechangedAddr = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm({
      ...AddressForm,
      [name]: value,
    });
  }

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
        <div className="w-[80%] flex flex-col p-6 md:px-10 mt-28 mb-8 rounded-md shadow-lg hover:shadow-xl transition-shadow border-white border-[3px] m-auto">
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
                      className={`bg-gray-50 shadow-lg rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transform transition duration-200 hover:bg-gray-200 hover:scale-105 ${category === item.label ? "border-4 border-green-500" : ""
                        }`}
                      onClick={() => setCategory(item.label)}
                    >
                      <div className="text-3xl mb-2">
                        {typeof item.icon === "function" ? item.icon() : item.icon}
                      </div>
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
                      className={`bg-gray-50 shadow-lg rounded-lg p-6 flex justify-between items-center hover:bg-gray-200 transition duration-200 cursor-pointer transform hover:scale-105 ${type === item.name ? "border-4 border-green-500" : ""
                        }`}
                      onClick={() => setType(item.name)}
                    >
                      <div>
                        <h4 className="text-base md:text-lg font-semibold text-gray-800">
                          {item.name}
                        </h4>
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
                      value={AddressForm.streetaddress}
                      onChange={handlechangedAddr}
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
                        value={AddressForm.apartment}
                        onChange={handlechangedAddr}
                        type="text"
                        placeholder="Apartment, Suite, etc."
                        name="apartment"
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">City</label>
                      <input
                        value={AddressForm.city}
                        onChange={handlechangedAddr}
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
                        value={AddressForm.province}
                        onChange={handlechangedAddr}
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
                        value={AddressForm.country}
                        onChange={handlechangedAddr}
                        type="text"
                        placeholder="Country"
                        name="country"
                        required
                        className="w-full border bg-white border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-blue-300 transition duration-200"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-4">
                  Share Some Basics About Your Place
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "Guest", value: 1 },
                    { label: "Bedrooms", value: 1 },
                    { label: "Beds", value: 1 },
                    { label: "Bathrooms", value: 1 },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex items-center border bg-white border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <p className="text-lg font-medium mb-0 flex-grow">{item.label}</p>
                        <div className="flex items-center space-x-4 flex-grow justify-end">
                          <RemoveCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                          <p className="mx-2 text-base font-semibold">{item.value}</p>
                          <AddCircleOutline className="text-gray-600 cursor-pointer hover:text-gray-800" />
                        </div>
                      </div>
                    </div>
                  ))}
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
                        className={`flex items-center shadow-lg justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[300px] ${photos.length ? "overflow-x-auto space-x-4" : "flex-col space-y-4"
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
                                  className="relative flex-shrink-0 w-48 h-48 rounded-lg border border-gray-300 overflow-hidden shadow-sm"
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
                  <div className="mt-6 flex justify-center">
                    <label
                      htmlFor="image"
                      className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
                    >
                      {/* SVG Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={0}
                        stroke="none"
                        className="w-5 h-5"
                      >
                        <path d="M12 2a5 5 0 015 5v4h1.586a2 2 0 011.414 3.414l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 015.414 11H7V7a5 5 0 015-5zm3 6V7a3 3 0 10-6 0v1h6z" />
                      </svg>
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

              {/* extra information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">What Make Your Place Attractive And Exciting</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="Title"
                      name="Title"
                      required
                      className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      placeholder="Description"
                      name="Description"
                      className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 ">HighLight</label>
                      <input
                        type="text"
                        placeholder="HighLight"
                        name="HighLight"
                        required
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">HighLight Details</label>
                      <textarea
                        placeholder="HighLight Details"
                        name="HighLightDetails"
                        required
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md h-12  p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-4 ">Now Set Your ₹PRICE</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                    <input
                      name='price'
                      required
                      type="text"
                      placeholder="Enter price"
                      className="pl-10 shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md h-[50px] p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                    />
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
