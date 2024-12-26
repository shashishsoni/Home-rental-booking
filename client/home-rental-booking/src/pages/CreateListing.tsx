import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { categories, types, facilities } from "@/data";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const CreateListing = () => {
  //Create all the Function
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [amenities, setAmenities] = useState<string[]>([]); // array multiple selection

  const handlemenitiesfun = (facility: string) => {
    if (amenities.includes(facility)) {
      setAmenities(amenities.filter((Option) => Option !== facility));
    } else {
      setAmenities([...amenities, facility]);
    }
  };

  const [AddressForm, setAddressForm] = useState({
    streetaddress: "",
    apartment: "",
    city: "",
    province: "",
    country: "",
  });


  const handlechangedAddr = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm({
      ...AddressForm,
      [name]: value,
    });
  };

  //Increase and deacrease the number of guest,bedroom,bed,bathroom
  const [items, setItems] = useState([
    { label: "Guest", value: 1 },
    { label: "Bedrooms", value: 1 },
    { label: "Beds", value: 1 },
    { label: "Bathrooms", value: 1 },
  ]);
  console.log(items);
  const handleIncrease = (index: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, value: item.value + 1 } : item
      )
    );
  };

  const handleDecrease = (index: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index && item.value > 1
          ? { ...item, value: item.value - 1 }
          : item
      )
    );
  };

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

  // decription and title
  const [FromDescription, setFromDescription] = useState({
    Title: "",
    Description: "",
    HighLight: "",
    HighLightDetails: "",
    price: 0,
  });

  const handlechangedesp = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFromDescription({
      ...FromDescription,
      [name]: value,
    });
  };

  const creatorId = useSelector((state: any) => state.user?.user?._id || null);
  if (!creatorId) {
    console.error("Creator ID is missing");
  }
  const handlepost = async (e: any) => {
    e.preventDefault(); // Fixed typo here

    try {
      if (!creatorId) {
        console.error("Creator ID is missing");
        return; // Prevent submission
      }

      const formData = new FormData();

      // Append form data
      formData.append("Creator", creatorId);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("streetaddress", AddressForm.streetaddress);
      formData.append("apartment", AddressForm.apartment);
      formData.append("city", AddressForm.city);
      formData.append("province", AddressForm.province);
      formData.append("country", AddressForm.country);

      // Convert numeric values from items array
      formData.append("guest", String(items[0].value)); // Guest
      formData.append("bedroom", String(items[1].value)); // Bedrooms
      formData.append("bathroom", String(items[3].value)); // Bathrooms
      formData.append("bed", String(items[2].value)); // Beds

      // Add amenities as an array
      formData.append("amenities", JSON.stringify(amenities));

      // Add photos with the correct field name
      photos.forEach((photo) => formData.append("listingImages", photo));

      // Add description and other fields
      formData.append("title", FromDescription.Title);
      formData.append("description", FromDescription.Description);
      formData.append("Highlights", FromDescription.HighLight);
      formData.append("Highlightdescription", FromDescription.HighLightDetails);
      formData.append("price", String(FromDescription.price));
      console.log("Form data:", formData);
      // Debug: log the FormData entries
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      // Send the post request to the server
      const response = await fetch("http://localhost:3001/listing/create", {
        method: "POST",
        body: formData,
      });

      // Check response and navigate
      if (response.ok) {
        navigate("/"); // Assuming `navigate` is defined properly
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to publish listing:",
          response.statusText,
          errorText
        );
      }
    } catch (err) {
      console.error(
        "Error while publishing the listing:",
        (err as any).message
      );
    }
  };
  return (
    <>
      <Navbar />
      <div className="w-screen h-full flex flex-col">
        <div className="w-[80%] flex flex-col p-6 md:px-10 mt-28 mb-12 rounded-md shadow-lg hover:shadow-xl transition-shadow border-white border-[3px] m-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-white py-8 pt-0">
            Publish Your Place
          </h1>
          <div className="flex-grow">
            <form
              className="flex flex-col bg-[#F6ECEA] shadow-2xl rounded-lg p-6 md:p-8 lg:p-10 space-y-8 max-w-6xl mx-auto border-white border-[3px]"
              onSubmit={handlepost}
            >
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
                      className={`bg-gray-50 shadow-lg rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transform transition duration-200 hover:bg-gray-200 hover:scale-105 ${
                        category === item.label
                          ? "border-4 border-green-500"
                          : ""
                      }`}
                      onClick={() => setCategory(item.label)}
                    >
                      <div className="text-3xl mb-2">
                        {typeof item.icon === "function"
                          ? item.icon()
                          : item.icon}
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
                      className={`bg-gray-50 shadow-lg rounded-lg p-6 flex justify-between items-center hover:bg-gray-200 transition duration-200 cursor-pointer transform hover:scale-105 ${
                        type === item.name ? "border-4 border-green-500" : ""
                      }`}
                      onClick={() => setType(item.name)}
                    >
                      <div>
                        <h4 className="text-base md:text-lg font-semibold text-gray-800">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-3xl">{item.icon}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Inputs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Where's Your Place Located?
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Street Address
                    </label>
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
                      <label className="block text-gray-700 font-medium mb-2">
                        City
                      </label>
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
                      <label className="block text-gray-700 font-medium mb-2">
                        Province
                      </label>
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
                      <label className="block text-gray-700 font-medium mb-2">
                        Country
                      </label>
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
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex items-center border bg-white border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <p className="text-lg font-medium mb-0 flex-grow">
                          {item.label}
                        </p>
                        <div className="flex items-center space-x-4 flex-grow justify-end">
                          <RemoveCircleOutline
                            onClick={() => handleDecrease(index)}
                            className={`text-gray-600 cursor-pointer hover:text-red-700 ${
                              item.value === 0 &&
                              "cursor-not-allowed text-gray-300"
                            }`}
                          />
                          <p className="mx-2 text-base font-semibold">
                            {item.value}
                          </p>
                          <AddCircleOutline
                            onClick={() => handleIncrease(index)}
                            className="text-gray-600 cursor-pointer hover:text-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="flex-grow">
            <form
              className="flex flex-col bg-[#F6ECEA] shadow-2xl rounded-lg p-6 md:p-8 lg:p-10 space-y-8 max-w-6xl mx-auto border-white border-[3px] mt-7"
              onSubmit={handlepost}
            >
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
                      className={`bg-gray-50 shadow-lg rounded-lg p-6 flex flex-col items-center text-center hover:bg-gray-200 transition duration-200 cursor-pointer transform hover:scale-105 ${
                        amenities.includes(item.name)
                          ? "border-4 border-green-500"
                          : ""
                      }`}
                      onClick={() => handlemenitiesfun(item.name)}
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
                        className={`flex items-center shadow-lg justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[300px] ${
                          photos.length
                            ? "overflow-x-auto space-x-4"
                            : "flex-col space-y-4"
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
                              <p className="mt-2 text-sm">
                                Upload From Your Device
                              </p>
                            </label>
                          </>
                        ) : (
                          photos.map((photo, index) => (
                            <Draggable
                              key={index}
                              draggableId={String(index)}
                              index={index}
                            >
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
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  What Make Your Place Attractive And Exciting
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Title
                    </label>
                    <input
                      value={FromDescription.Title}
                      onChange={handlechangedesp}
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
                      value={FromDescription.Description}
                      onChange={handlechangedesp}
                      required
                      placeholder="Description"
                      name="Description"
                      className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 ">
                        HighLight
                      </label>
                      <input
                        value={FromDescription.HighLight}
                        onChange={handlechangedesp}
                        type="text"
                        placeholder="HighLight"
                        name="HighLight"
                        required
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        HighLight Details
                      </label>
                      <textarea
                        value={FromDescription.HighLightDetails}
                        onChange={handlechangedesp}
                        placeholder="HighLight Details"
                        name="HighLightDetails"
                        required
                        className="shadow-lg hover:shadow-xl transition-shadow w-full border bg-white border-gray-300 rounded-md h-12  p-3 focus:ring-2 focus:ring-blue-300 duration-200"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-4 ">
                  Now Set Your ₹PRICE
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                      ₹
                    </span>
                    <input
                      value={FromDescription.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numbers and handle leading zero logic
                        if (/^\d*$/.test(value)) {
                          setFromDescription((prev) => ({
                            ...prev,
                            price:
                              value.startsWith("0") && value.length > 1
                                ? parseInt(value.slice(1), 10)
                                : parseInt(value, 10) || 0, // Convert string to number
                          }));
                        }
                      }}
                      name="price"
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
          <button
            className="m-auto mt-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={handlepost}
          >
            Create Your Listing
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CreateListing;
