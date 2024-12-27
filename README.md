# 🏠 Home Rental Booking Application

A full-stack application for managing home rentals, enabling users to create listings, view properties, and manage wishlists.

## ✨ Features

### 🔒 User Authentication
- Secure login and registration
- JWT-based session management
- Password encryption and validation

### 🏘️ Property Management
- Create, edit, and delete property listings
- Upload and manage multiple property images
- Drag-and-drop image reordering
- Rich property details including amenities, pricing, and availability

### 🔍 Search & Discovery
- Advanced property search with filters
- Property categorization
- Interactive map view of listings
- Responsive grid layout for property cards

### 👤 User Features
- Personal dashboard
- Wishlist management
- Booking history
- User profile customization

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-Latest-339933)
![Express](https://img.shields.io/badge/Express-Latest-000000)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/shashishsoni/Home-rental-booking.git
cd home-rental-booking
```

2. **Backend Setup**
```bash
cd server
npm install
```

3. **Frontend Setup**
```bash
cd client/home-rental-booking
npm install
```

4. **Environment Configuration**
Create `.env` in the server directory:
```env
MONGO_DB=mongodb://localhost:27017/home-rental
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Launch Application

1. **Start Backend**
```bash
cd server
npm run dev
```

2. **Start Frontend**
```bash
cd client/home-rental-booking
npm run dev
```

Access the application at `http://localhost:5173`

## 📁 Project Structure
```
home-rental-booking/
├── client/
│   ├── home-rental-booking/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── redux/
│       ├── utils/
│       ├── assets/
│       ├── App.css
│       └── index.tsx
└── server/
    └── src/
        ├── routes/
        ├── middleware/
        ├── models/
        ├── index.ts
        └── migration.ts
```

## 🔗️ Image Storage and Access

- **Image Uploads**: Uploaded images are stored in the `public/uploads` directory of the server. Ensure that this directory exists and is writable.
- **Accessing Images**: Images can be accessed via the following URL format:
  ```
  http://localhost:3001/uploads/<image_filename>
  ```
  For example, if you upload an image named `listing-123.jpg`, it can be accessed at:
  ```
  http://localhost:3001/uploads/listing-123.jpg
  ```
- **Local Storage**: The application uses local storage to save user-specific data such as wishlist and properties.

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/listing` | Get all listings |
| POST | `/listing/create` | Create listing |
| GET | `/listing/:id` | Get specific listing |
| PATCH | `/listing/:id` | Update listing |
| DELETE | `/listing/:id` | Delete listing |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/wishlist` | Get wishlist |
| POST | `/api/users/wishlist/:listingId` | Add to wishlist |

## 📝 Input Forms

### User Profile
```
Name: _________________
Email: ________________
Phone: ________________
Address: ______________
City: ________________
State: _______________
Zip: _________________
```

### Property Listing
```
Title: ________________
Description: __________
Category: _____________
Type: _________________
Price: ________________
Guests: _______________
Bedrooms: _____________
Bathrooms: ____________
```

### Image Requirements
- Supported formats: PNG, JPG, JPEG, SVG, WebP
- AVIF not supported

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/Amazing`)
3. Commit changes (`git commit -m 'Add Amazing'`)
4. Push branch (`git push origin feature/Amazing`)
5. Open Pull Request

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- [React Docs](https://react.dev)
- [MongoDB Docs](https://docs.mongodb.com)
- [Express.js Docs](https://expressjs.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [React Router Docs](https://reactrouter.com/en/main)
- [React Hook Form Docs](https://react-hook-form.com/get-started)
- [React Dropzone Docs](https://react-dropzone.js.org/)
- [React Slick Docs](https://react-slick.neostack.com/docs/get-started)
- [React Toastify Docs](https://www.npmjs.com/package/react-toastify)
- [React Icons Docs](https://react-icons.github.io/react-icons/)

![signup page](<proj images/FireShot Capture 012 - Vite + React + TS - localhost.png>)

![login page](<proj images/FireShot Capture 013 - Vite + React + TS - localhost.png>)

![home page](<proj images/FireShot Capture 003 - Vite + React + TS - localhost.png>)

![create listing page](<proj images/FireShot Capture 004 - Vite + React + TS - localhost.png>)

![listing page](<proj images/Vite + React + TS.png>)

![paymet pop up](<proj images/FireShot Capture 014 - Vite + React + TS - localhost.png>)

![trip details page](<proj images/FireShot Capture 005 - Vite + React + TS - localhost.png>)

![wishlist page](<proj images/FireShot Capture 009 - Vite + React + TS - localhost.png>)

![property details page](<proj images/FireShot Capture 010 - Vite + React + TS - localhost.png>)

![reservation page](<proj images/FireShot Capture 011 - Vite + React + TS - localhost.png>)