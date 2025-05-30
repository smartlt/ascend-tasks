# MongoDB Setup for URL Shortener

## Local MongoDB Setup

### Option 1: Using Docker (Recommended)

1. Install Docker on your system
2. Run MongoDB in a container:

```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

3. Create a `.env.local` file in the project root:

```bash
MONGODB_URI=mongodb://localhost:27017/url-shortener
```

### Option 2: Install MongoDB Locally

1. Download and install MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Start the MongoDB service:

   - **Windows**: MongoDB should start automatically as a service
   - **macOS**: `brew services start mongodb/brew/mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. Create a `.env.local` file:

```bash
MONGODB_URI=mongodb://localhost:27017/url-shortener
```

## Cloud MongoDB Setup (MongoDB Atlas)

1. Create a free account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string from the "Connect" button
4. Create a `.env.local` file:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortener?retryWrites=true&w=majority
```

## Running the Application

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will automatically connect to MongoDB and create the necessary collections.

## Database Structure

The application creates a `urls` collection with the following schema:

- `shortKey`: Unique 6-character string for the short URL
- `originalUrl`: The original long URL
- `createdAt`: ISO timestamp when the URL was created
- `accessCount`: Number of times the short URL has been accessed

## Verification

You can verify the database connection by:

1. Creating a short URL through the web interface
2. Checking the browser console for MongoDB connection messages
3. Using MongoDB Compass or CLI to view the `url-shortener` database
