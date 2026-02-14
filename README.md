# Video Platform Backend

A robust backend API for a video streaming platform built to showcase modern backend development skills using Node.js, Express.js, and MongoDB.

## Features

- **User Management**: Authentication, authorization, profile management, and watch history
- **Video Management**: Upload, stream, and manage video content with Cloudinary integration
- **Engagement Features**: Comments, likes, and tweets for user interaction
- **Subscription System**: Subscribe/unsubscribe to channels with subscriber counts
- **Playlist Management**: Create and manage video playlists
- **Dashboard Analytics**: Channel statistics and content metrics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **File Storage**: Cloudinary for video and image uploads
- **Upload Handling**: Multer middleware
- **Validation**: Mongoose schema validation

## Project Structure

```
backend/src/
├── controllers/        # Request handlers and business logic
├── db/                # Database connection configuration
├── middlewares/       # Authentication and file upload middleware
├── models/            # Mongoose schemas and models
├── routes/            # API route definitions
├── utils/             # Utility functions (ApiResponse, ApiError, asyncHandler)
├── app.js            # Express app configuration
└── index.js          # Server entry point
```

## API Routes

| Endpoint | Description |
|----------|-------------|
| `/api/v1/users` | User registration, login, profile management |
| `/api/v1/videos` | Video CRUD operations, streaming |
| `/api/v1/comments` | Comment management on videos |
| `/api/v1/likes` | Like/unlike videos, comments, and tweets |
| `/api/v1/tweets` | Tweet/post functionality |
| `/api/v1/subscriptions` | Subscribe/unsubscribe to channels |
| `/api/v1/playlist` | Playlist creation and management |
| `/api/v1/dashboard` | Channel statistics and analytics |
| `/api/v1/healthcheck` | API health status |

## Key Features

### Authentication
- JWT-based authentication with access and refresh tokens
- Secure password hashing with bcrypt
- Protected routes using custom auth middleware

### File Handling
- Video and image uploads via Multer
- Cloudinary integration for cloud storage
- Support for avatar and cover image updates

### Database Design
- MongoDB with Mongoose ODM
- Aggregation pipelines for complex queries
- Pagination support using mongoose-aggregate-paginate-v2

### Error Handling
- Centralized error handling with custom ApiError class
- Consistent API responses using ApiResponse wrapper
- Async error handling with asyncHandler utility

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance
- Cloudinary account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/videoplatform
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=*
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port number |
| `MONGODB_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Secret for JWT access tokens |
| `REFRESH_TOKEN_SECRET` | Secret for JWT refresh tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration time |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration time |
| `CORS_ORIGIN` | Allowed CORS origin |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Skills Demonstrated

- **RESTful API Design**: Clean, organized endpoint structure
- **Authentication & Security**: JWT implementation, password hashing, protected routes
- **Database Modeling**: MongoDB schema design with relationships
- **Error Handling**: Comprehensive error management and logging
- **File Processing**: Handling multipart uploads and cloud storage
- **Code Organization**: Modular architecture with separation of concerns
- **Async Programming**: Proper use of async/await and promises

## License

ISC

## Author

Built as a learning project to demonstrate backend development skills.
