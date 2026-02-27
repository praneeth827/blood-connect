# BloodConnect - Blood Donation Management System

A modern, mobile‑friendly website that connects blood seekers with nearby donors. Built with Node.js (Express) backend and SQLite database.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open http://localhost:3001 in your browser
```

**That's it!** The app will work with basic features. See [Configuration](#configuration) below for optional features like Google Maps and OAuth.

## ✨ Key Features

- **User Authentication**: Email/password sign up & sign in with JWT tokens
- **Google OAuth** (Optional): Sign in with Google account
- **Donor Registration**: Complete profile with blood type, location, and government ID upload
- **Seeker Search**: Find nearby donors by blood type and location
- **Interactive Maps** (Optional): Google Maps integration showing donor locations
- **Blood Requests**: Create, accept, reject, and manage blood donation requests
- **File Upload**: Secure upload and storage of government ID documents (Aadhaar/PAN/Voter ID)
- **Multilingual UI**: Support for English, తెలుగు, हिन्दी, தமிழ്, മലയാളം, ಕನ್ನಡ
- **Location Services**: GPS location detection with location pin emoji button (📍)

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express
- **Database**: SQLite (via `better-sqlite3`)
- **Authentication**: JWT (`jsonwebtoken`) + password hashing (`bcryptjs`)
- **File Upload**: Multer for handling document uploads
- **Maps** (Optional): Google Maps JavaScript API
- **OAuth** (Optional): Passport.js with Google OAuth 2.0

## 📁 Project Structure

```
/
├── server.js              # Express API server
├── db.js                   # SQLite database initialization
├── data/                   # SQLite database (created automatically)
│   └── bloodconnect.sqlite
├── uploads/                # Uploaded documents (created automatically)
├── index.html              # Frontend application
├── styles.css              # Application styles
├── script.js               # Frontend JavaScript
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md
```

## 📦 Installation

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Step-by-Step Setup

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd blood-donation-management-system-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Navigate to: `http://localhost:3001`
   - The server runs on port 3001 by default

### Development Mode (Auto-reload)
For development with automatic server restart on file changes:
```bash
npm run dev
```

## ⚙️ Configuration

### Basic Setup (Works Out of the Box)

The application works **without any configuration** for basic features:
- ✅ User registration and login
- ✅ Donor profile creation
- ✅ Blood request management
- ✅ File uploads
- ✅ Database storage

### Optional Features

#### 1. Google Maps Integration (Optional but Recommended)

**What it does:** Enables interactive maps showing donor locations

**Setup:**
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API (for address to coordinates conversion)
3. Open `index.html` and find:
   ```javascript
   const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
   ```
4. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key

**Note:** Without this, maps won't display, but all other features work normally.

#### 2. Google OAuth Login (Optional)

**What it does:** Allows users to sign in with their Google account

**Setup:**
1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
2. Get OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/):
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
3. Edit `.env` and add:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
   ```

**Note:** Without this, users can still register/login with email and password.

#### 3. Custom Server Configuration (Optional)

Create a `.env` file for custom settings:

```env
# Server port (default: 3001)
PORT=3001

# JWT Secret (generate a strong random string)
# Generate one: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_jwt_secret_key_here

# Session Secret (generate a strong random string)
SESSION_SECRET=your_session_secret_key_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

**⚠️ Important:** Never commit `.env` file to Git! It contains sensitive information.

## 📖 Usage Guide

### For Users

#### Sign Up / Sign In
- **Email/Password**: Create account with first name, last name, email, and password (minimum 8 characters)
- **Google Sign In** (if configured): Click "Continue with Google" button

#### As a Donor
1. **Complete Profile:**
   - Select your blood type, age, gender
   - Enter contact number and occupation
   - Set your location (click 📍 button for GPS or type manually)
   - Upload government ID proof (Aadhaar/PAN/Voter ID) - accepts JPEG, PNG images and PDF files (max 5MB)

2. **Eligibility Quiz:**
   - Answer questions about your eligibility
   - Accept rules & regulations
   - Complete to create your profile

3. **Manage Profile:**
   - Edit profile from dashboard
   - Toggle availability (Available/Not Available)
   - View donation history

#### As a Seeker
1. **Search Donors:**
   - Select one or more blood types (hold Ctrl/Cmd for multiple)
   - Enter location or use current location
   - View results sorted by distance
   - See donors on interactive map (if Google Maps is configured)

2. **Create Requests:**
   - Send requests to specific donors
   - Broadcast to all matching donors
   - Track status (pending/accepted/rejected/completed)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/google` - Google OAuth login (if configured)
- `GET /api/auth/google/callback` - Google OAuth callback

### Donors
- `GET /api/donors/me` - Get current user's donor profile
- `PUT /api/donors/me` - Create/update donor profile (with file upload)
- `PATCH /api/donors/me` - Update availability status
- `GET /api/donors/search` - Search donors by blood type and location
- `GET /api/donors/:donorId` - Get donor details
- `GET /api/donors/:donorId/contact` - Get donor contact (requires accepted request)

### Requests
- `GET /api/requests/me` - Get user's requests (as seeker and donor)
- `POST /api/requests` - Create blood request
- `POST /api/requests/broadcast` - Broadcast request to multiple donors
- `PATCH /api/requests/:id` - Update request status
- `DELETE /api/requests/:id` - Delete request

## 💾 Data & Storage

### Database
- **Location**: `data/bloodconnect.sqlite` (created automatically)
- **Tables**: `users`, `donors`, `requests`
- Database is automatically created and migrated on first run
- **Reset**: Delete `data/bloodconnect.sqlite` to start fresh (⚠️ deletes all data)

### File Storage
- **Location**: `uploads/` directory (created automatically)
- **Files**: Government ID documents (images and PDFs)
- **Access**: Files are served at `/uploads/{filename}`
- **Security**: Files are validated and associated with user IDs

### Browser Storage
- JWT authentication token (for session)
- Language preference

## 🌐 Multilingual Support

Language selector in the top navbar. Supported languages:
- English (default)
- తెలుగు (Telugu)
- हिन्दी (Hindi)
- தமிழ் (Tamil)
- മലയാളം (Malayalam)
- ಕನ್ನಡ (Kannada)

Language preference is saved in browser localStorage.

## 🔧 Troubleshooting

### Server Won't Start
- **Port already in use**: 
  - Change PORT in `.env` file, or
  - Kill the process: `npx kill-port 3001` (Windows) or `lsof -ti:3001 | xargs kill` (Mac/Linux)
- **"Cannot find module"**: Run `npm install` again

### Database Issues
- **Database errors**: Delete `data/bloodconnect.sqlite` to reset (⚠️ This deletes all data)
- **Migration errors**: Ensure `data/` directory exists and is writable

### Map Not Loading
- **"ApiNotActivatedMapError"**: 
  - Check if Google Maps API key is set in `index.html`
  - Enable Maps JavaScript API in Google Cloud Console
  - Ensure billing is enabled (Google requires billing for Maps API)
- **Map shows but no markers**: Check browser console for errors

### Authentication Issues
- **"User already exists"**: Try signing in instead of signing up
- **Invalid credentials**: Verify email and password
- **Google OAuth not working**: 
  - Check `.env` file has correct credentials
  - Verify redirect URI matches in Google Cloud Console
  - Check browser console for errors

### Location Issues
- **Location not detected**: 
  - Allow browser location permissions
  - Check if HTTPS is required (some browsers require HTTPS for geolocation)
- **Coordinates not saved**: 
  - Try using the 📍 location button
  - Enter a more specific address with city and state

### File Upload Issues
- **File too large**: Maximum file size is 5MB
- **Invalid file type**: Only JPEG, PNG images and PDF files are allowed
- **Upload failed**: 
  - Check server logs
  - Ensure `uploads/` directory exists and is writable
  - Check file size and format

## 🔒 Security

### For Repository Owners

**Before pushing to GitHub:**
1. ✅ Never commit `.env` file (already in `.gitignore`)
2. ✅ Google Maps API key in `index.html` should be a placeholder
3. ✅ Review `.gitignore` to ensure sensitive files are excluded
4. ✅ See [SECURITY.md](SECURITY.md) for detailed guidelines

### Security Features
- Passwords hashed with bcrypt
- JWT tokens expire after 7 days
- File uploads validated and secured
- SQL injection protection via parameterized queries
- Environment variables for sensitive configuration

## 📝 License

MIT License - Feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ❓ Support

- Check the [Troubleshooting](#-troubleshooting) section above
- Review code comments for implementation details
- Open an issue on GitHub for bugs or feature requests

## 🎯 What Works Without Configuration

You can use the application immediately with these features:
- ✅ User registration and authentication
- ✅ Donor profile management
- ✅ Blood request system
- ✅ File uploads
- ✅ Database storage
- ✅ Multilingual support
- ✅ Location input (manual entry)

**Optional features** that require setup:
- 🗺️ Google Maps (for interactive maps)
- 🔐 Google OAuth (for Google sign-in)

---

**Made with ❤️ for connecting blood donors and seekers**
