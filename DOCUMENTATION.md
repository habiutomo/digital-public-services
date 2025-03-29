# Public Services Portal Documentation

This document provides detailed information on setting up, running, and using the Public Services Portal application.

## Table of Contents
1. [Setup and Installation](#setup-and-installation)
2. [Application Architecture](#application-architecture)
3. [User Guide](#user-guide)
4. [API Documentation](#api-documentation)
5. [Development Guide](#development-guide)
6. [Troubleshooting](#troubleshooting)

## Setup and Installation

### Requirements
- Node.js (version 16 or higher)
- npm (version 7 or higher)

### Installation Steps
1. Clone or download the repository
2. Navigate to the project directory
3. Install dependencies using `npm install`
4. Start the development server with `npm run dev`
5. The application will be available at `http://localhost:5000`

### Environment Variables
The application can be configured using the following environment variables:

- `PORT` - The port on which the server will run (default: 5000)
- `NODE_ENV` - The environment mode (development, production)
- `SESSION_SECRET` - Secret key for session encryption

## Application Architecture

### Frontend
The frontend is built using React with TypeScript and organized as follows:

- **Components** - Reusable UI components built with Shadcn UI and Tailwind CSS
- **Layouts** - Page layouts including the main application layout
- **Pages** - Individual pages of the application
- **Contexts** - React Context providers for state management
- **Hooks** - Custom React hooks for reusable logic
- **Locales** - Internationalization files for English and Indonesian
- **Lib** - Utility functions and configuration

### Backend
The backend is built with Node.js and Express:

- **Routes** - API endpoints definition
- **Storage** - Data access layer with in-memory storage implementation
- **Authentication** - User authentication using Passport.js
- **Session Management** - User session handling

### Data Models
The application uses the following main data models:

1. **User**
   - Authentication information and personal details

2. **Service**
   - Government services that users can apply for

3. **Service Category**
   - Categories that group similar services

4. **Application**
   - Service applications submitted by users

5. **Notification**
   - System notifications for users

## User Guide

### Registration and Login
1. Visit the homepage and click "Register" to create a new account
2. Fill in the required information and submit the form
3. Log in using your username and password

### Browsing Services
1. Navigate to the "Services" section from the main menu
2. Browse services by category or use the search function
3. Click on a service to view its details

### Applying for a Service
1. From the service details page, click "Apply Now"
2. Complete the multi-step application form:
   - Step 1: Personal Information
   - Step 2: Address Information
   - Step 3: Document Upload
   - Step 4: Review and Submit
3. Submit your application

### Tracking Applications
1. Navigate to the "Applications" section
2. View all your applications and their current status
3. Filter applications by status or search by application number

### Managing Your Profile
1. Click on your profile name in the top right corner
2. Select "Profile" from the dropdown menu
3. Update your personal information or change your password

### Notifications
1. Click on the bell icon in the header to view notifications
2. Read notifications about application status changes and other updates
3. Mark notifications as read individually or all at once

### Changing Language
1. Click on the language selector in the header
2. Choose between English and Indonesian

## API Documentation

The application exposes the following main API endpoints:

### Authentication
- `POST /api/auth/login` - Authenticate a user
- `POST /api/auth/logout` - End a user session
- `GET /api/auth/me` - Get the current authenticated user

### Users
- `GET /api/users/:id` - Get a user by ID
- `PUT /api/users/:id` - Update a user

### Services
- `GET /api/services` - Get all services
- `GET /api/services/featured` - Get featured services
- `GET /api/services/:id` - Get a service by ID
- `GET /api/services/categories` - Get all service categories

### Applications
- `GET /api/applications` - Get a user's applications
- `POST /api/applications` - Create a new application
- `GET /api/applications/:id` - Get an application by ID
- `PATCH /api/applications/:id/status` - Update an application status

### Notifications
- `GET /api/notifications` - Get a user's notifications
- `GET /api/notifications/unread-count` - Get count of unread notifications
- `PATCH /api/notifications/:id/read` - Mark a notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read

## Development Guide

### Adding a New Service
1. Update the sample data in `server/storage.ts` to add a new service
2. Add any necessary translations to the locale files
3. Ensure the service has the appropriate category

### Adding a New Feature
1. Define the data model in `shared/schema.ts`
2. Implement the storage interface in `server/storage.ts`
3. Create API endpoints in `server/routes.ts`
4. Build the UI components in `client/src/components`
5. Create or update pages in `client/src/pages`
6. Add necessary translations to locale files

### Implementing a Database
To switch from in-memory storage to a database:
1. Create a new implementation of the `IStorage` interface
2. Configure the database connection
3. Use the new storage implementation in `server/routes.ts`

## Troubleshooting

### Common Issues

#### Application fails to start
- Ensure all dependencies are installed
- Check for port conflicts
- Verify that Node.js and npm versions meet requirements

#### Login issues
- Clear browser cookies and try again
- Check user credentials
- Verify that the session storage is working properly

#### Form submission errors
- Check browser console for JavaScript errors
- Verify that all required fields are filled
- Ensure the server is running and accepting requests

### Support
For additional support, contact the development team or open an issue in the repository.