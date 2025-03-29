# Installation Guide for Public Services Portal

This guide provides step-by-step instructions for setting up and running the Public Services Portal application in various environments.

## Quick Start

### Prerequisites
- Node.js version 16 or higher
- npm version 7 or higher

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/public-services-portal.git
   cd public-services-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**  
   Open your browser and navigate to `http://localhost:5000`

## Production Deployment

### Building for Production

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

If you prefer using Docker:

1. **Build the Docker image**
   ```bash
   docker build -t public-services-portal .
   ```

2. **Run the container**
   ```bash
   docker run -p 5000:5000 public-services-portal
   ```

## Configuration Options

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```
PORT=5000
NODE_ENV=development
SESSION_SECRET=your_secret_key
```

### Using a Database (Optional)

The application uses in-memory storage by default. To switch to a database:

1. **Install database driver**
   ```bash
   npm install pg
   ```

2. **Configure database connection**
   Add the following to your `.env` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/dbname
   ```

3. **Update the storage implementation**
   Modify `server/storage.ts` to use the database instead of in-memory storage.

## Troubleshooting Installation

### Common Issues

#### Node.js version error
Ensure you have Node.js version 16 or higher installed:
```bash
node --version
```
If your version is older, download and install the latest version from [nodejs.org](https://nodejs.org/).

#### Port conflicts
If port 5000 is already in use, you can change the port in the `.env` file or by setting the PORT environment variable:
```bash
PORT=3000 npm run dev
```

#### Installation errors
If you encounter errors during `npm install`, try:
```bash
npm clean-install
```

Or update npm:
```bash
npm install -g npm@latest
```

#### Application not starting
Check that all required dependencies are installed:
```bash
npm install
```

## Verifying Installation

After installation, you can verify that everything is working correctly:

1. The server should display a message indicating it's running on the specified port
2. Navigate to `http://localhost:5000` in your browser
3. Try logging in with the demo credentials:
   - Username: `budisantoso`
   - Password: `password123`
4. You should be able to see the dashboard and navigate the application

## Next Steps

After installation:

1. Read the [DOCUMENTATION.md](./DOCUMENTATION.md) file for detailed usage instructions
2. Check out the [README.md](./README.md) for an overview of the project
3. Explore the codebase to understand its structure
   
For any additional help, refer to the troubleshooting section in the documentation or contact the development team.