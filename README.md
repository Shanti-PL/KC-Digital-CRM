# KC Digital CRM

A simple Customer Relationship Management system for a digital marketing agency built with Next.js, JavaScript, Tailwind CSS 3, and MongoDB.

## Features

### 🔐 Authentication System

- **Admin Portal**: Separate admin interface at `/kcadmin`
- **User Management**: Admin-controlled user registration
- **Secure Login**: JWT-based authentication for both admin and users
- **Persistent Sessions**: HTTP-only cookies with automatic token verification
- **Session Persistence**: Login state persists across browser refreshes
- **Password Security**: bcrypt hashing for all passwords
- **Token Verification**: Server-side token validation for security

### 👥 Customer Management

- Full CRUD operations (Create, Read, Update, Delete)
- **Contact Information**: Store phone numbers and email addresses (optional)
- Track customer interest status
- Package selection with predefined options:
  - Starter Landing Page - $700
  - Growth Landing Page - $1,500
  - Pro Website - from $3,500+
  - Other (custom pricing)
- Customer notes for additional information
- **Call Records**: Track every customer interaction with timestamps and detailed notes
- **Edit/Delete Call Records**: Modify or remove individual call records as needed

### 🎨 Modern UI/UX

- **Wide Layout Design**: Expanded container width (max-w-[1600px]) for better space utilization
- **Left/Right Layout**: Sidebar for stats/forms, main area for customer management
- Responsive design with Tailwind CSS 3
- Clean, professional interface
- Real-time statistics dashboard
- Form validation and error handling

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, JavaScript
- **Styling**: Tailwind CSS 3
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT + bcryptjs + HTTP-only cookies
- **State Management**: React Context API
- **Session Management**: Server-side token verification
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

**Note**: The project includes a `jsconfig.json` file that configures path aliases (`@/` maps to `src/`) for cleaner imports.

### 2. Set up Environment Variables

Create a `.env.local` file in the root directory and add:

```bash
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kc-digital-crm?retryWrites=true&w=majority

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Replace the MongoDB URI with your actual Atlas connection string and use a strong JWT secret.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Admin Setup & User Management

#### 🔐 Admin Portal Access

- **URL**: `/kcadmin`
- **Username**: `kc-admin`
- **Password**: `kcdm14925`

#### 📞 Call Records System

The CRM now includes a comprehensive call tracking system:

1. **View Call Records**: Click "Calls" button next to any customer
2. **Add New Calls**: Use the form to add timestamped call notes
3. **Edit Call Records**: Click "Edit" button to modify existing call notes
4. **Delete Call Records**: Click "Delete" button to remove call records (with confirmation)
5. **Track History**: All calls are displayed chronologically (newest first)
6. **Detailed Notes**: Add comprehensive notes for each customer interaction
7. **Toggle View**: Easily switch between customer list and call history

#### 👥 User Management Process

1. **Admin Login**: Visit `/kcadmin` and login with admin credentials
2. **Create Users**: Click "Add User" to register new CRM users
3. **Manage Users**: Edit user info, reset passwords, or delete users
4. **View Users**: See all registered users with their details and status
5. **User Access**: Users login at `/auth/login` to access the CRM system

#### 🚀 First Time Setup

1. **Access Admin Portal**: Visit `/kcadmin` and login as admin
2. **Create First User**: Click "Add User" to create your first CRM user
3. **User Access**: New users can login at `/auth/login` to access the CRM system

#### 🛠️ Admin Portal Features

- **User Registration**: Create new user accounts with username, email, and password
- **User Editing**: Update user information (email, role) - username cannot be changed
- **Password Reset**: Set new passwords for existing users
- **User Deletion**: Remove users from the system (with confirmation)
- **Role Management**: Assign user or admin roles
- **Real-time Updates**: Automatic refresh of user list after operations

### 🗄️ Data Storage Information

#### User Data Storage

- **Location**: MongoDB Atlas (Cloud Database)
- **Collections**:
  - `users` - Stores all registered user accounts
  - `customers` - Stores customer information and CRM data
- **Admin Credentials**: Hardcoded in application (not in database)
  - Username: `kc-admin`
  - Password: `kcdm14925`
- **User Passwords**: Encrypted with bcrypt before storage
- **Data Persistence**: All user registrations and customer data persist in MongoDB

## Project Structure

```
src/
├── app/
│   ├── api/customers/          # API routes for customer CRUD
│   ├── globals.css             # Global styles with Tailwind
│   ├── layout.js               # Root layout component
│   └── page.js                 # Main dashboard page
├── components/
│   ├── CustomerForm.js         # Add/Edit customer form
│   └── CustomerList.js         # Customer list with actions
├── lib/
│   └── mongodb.js              # MongoDB connection utility
└── models/
    └── Customer.js             # Customer data model
```

## Customer Data Model

Each customer record includes:

- **Name**: Customer's full name (required)
- **Business Name**: Customer's business name (required)
- **Interested**: Boolean flag for interest status
- **Package**: Selected package (Starter/Growth/Pro/Other)
- **Package Price**: Auto-filled for predefined packages, custom for "Other"
- **Notes**: Additional information about the customer
- **Created At**: Timestamp when record was created
- **Updated At**: Timestamp when record was last modified

## API Endpoints

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create a new customer
- `GET /api/customers/[id]` - Get a specific customer
- `PUT /api/customers/[id]` - Update a customer
- `DELETE /api/customers/[id]` - Delete a customer

## Build for Production

```bash
npm run build
npm start
```

## Deployment

This project is optimized for deployment on Vercel. Simply connect your GitHub repository to Vercel and add your `MONGODB_URI` environment variable in the Vercel dashboard.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
