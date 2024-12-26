# Home Rental Booking Application

This is a full-stack application for managing home rentals, allowing users to create listings, view properties, and manage their wishlist.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Editable Input Section](#editable-input-section)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication (login and registration)
- Create, read, update, and delete property listings
- Wishlist functionality to save favorite properties
- Image upload and drag-and-drop functionality for property images
- Responsive design for mobile and desktop views

## Technologies Used
- **Frontend**: React, Redux, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Libraries**: MUI (Material-UI), Framer Motion, Hello Pangea DnD
- **Deployment**: Docker (optional)

## Installation

### Prerequisites
Make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Clone the Repository

bash
git clone https://github.com/yourusername/home-rental-booking.git
cd home-rental-booking

### Install Backend Dependencies
Navigate to the server directory and install the dependencies:

```bash
cd server
npm install
```

### Install Frontend Dependencies
Navigate to the client directory and install the dependencies:
```bash
cd client/home-rental-booking
npm install
```

### Environment Variables
Create a `.env` file in the `server` directory and add the following variables:
```
MONGO_DB=mongodb://localhost:27017/home-rental
JWT_SECRET=your_jwt_secret
```

### Run the Application
1. **Start the Backend Server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend Application**:
   ```bash
   cd client/home-rental-booking
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` to view the application.

## Usage
- **User Registration**: Users can register by providing their email and password.
- **User Login**: Users can log in to access their dashboard.
- **Create Listing**: Users can create new property listings by filling out the form.
- **View Listings**: Users can view all available listings and their details.
- **Wishlist**: Users can save their favorite listings to their wishlist.

## Folder Structure
```
home-rental-booking/
├── client/
│   ├── home-rental-booking/  # React frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── redux/             # Redux store and slices
│   │   ├── utils/             # Utility functions
│   │   ├── assets/            # Images and other assets
│   │   ├── App.css            # Global styles
│   │   └── index.tsx          # Entry point
└── server/
    ├── src/
    │   ├── routes/            # API routes
    │   ├── middleware/         # Middleware functions
    │   ├── models/             # Mongoose models
    │   ├── index.ts            # Server entry point
    │   └── migration.ts        # Database migration scripts
```

## API Endpoints
- **User Authentication**
  - `POST /auth/register`: Register a new user
  - `POST /auth/login`: Log in a user

- **Listings**
  - `GET /listing`: Get all listings
  - `POST /listing/create`: Create a new listing
  - `GET /listing/:id`: Get a specific listing by ID
  - `PATCH /listing/:id`: Update a listing by ID
  - `DELETE /listing/:id`: Delete a listing by ID

- **Wishlist**
  - `GET /user/:id/wishlist`: Get user's wishlist
  - `PATCH /user/:id/:listingId`: Add or remove a listing from the wishlist

## Editable Input Section

### User Information

Please fill in the following details:

- **Name**: ______________________
- **Email**: ______________________
- **Phone Number**: _______________
- **Address**: _____________________
- **City**: ________________________
- **State**: _______________________
- **Zip Code**: ____________________

### Listing Information

Please provide details about the listing:

- **Property Title**: _______________
- **Description**: __________________
- **Category**: _____________________
- **Type**: _________________________
- **Price**: ________________________
- **Number of Guests**: ______________
- **Number of Bedrooms**: ____________
- **Number of Bathrooms**: ___________
- **Amenities**: _____________________

### Image Uploads

Please upload images for the listing:

- **Upload Images**: [Choose Files]

---

### Notes
- Ensure all required fields are filled out before submitting.
- You can add additional comments or notes here: ______________________________________________________

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

