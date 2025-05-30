# URL Shortener Application

A modern URL shortening service built with Next.js, TypeScript, MongoDB, and Tailwind CSS that transforms long URLs into short, shareable links.

## 🚀 Features

- **URL Shortening**: Convert long URLs into 6-character short codes
- **Instant Redirection**: Fast redirect to original URLs
- **Click Tracking**: Monitor access count for each shortened URL
- **Data Persistence**: MongoDB storage for reliable data persistence
- **Security**: URL validation and malicious scheme prevention
- **Modern UI**: Responsive design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 📋 How It Works

### User Flow

1. **User visits** `http://localhost:80`
2. **Enters a long URL** in the form (e.g., `https://example.com/very-long-url`)
3. **Clicks "Shorten URL"** button
4. **Receives a short URL** (e.g., `http://localhost:80/abc123`)
5. **Clicks the short URL** to test redirection
6. **Gets redirected** to the original URL in a new tab

### System Flow

```mermaid
graph TD
    A[User enters URL] --> B[Frontend validates URL]
    B --> C[POST /api/shorten]
    C --> D[Backend validates URL]
    D --> E[Check if URL exists in DB]
    E --> F{URL exists?}
    F -->|Yes| G[Return existing short key]
    F -->|No| H[Generate unique short key]
    H --> I[Save to MongoDB]
    I --> J[Return short key]
    G --> K[Display shortened URL]
    J --> K
    K --> L[User clicks short URL]
    L --> M[GET /{key}]
    M --> N[Fetch original URL from DB]
    N --> O[Increment access count]
    O --> P[Redirect to original URL]
```

## 🔧 Technical Architecture

### Frontend (Next.js App Router)

```
src/app/
├── page.tsx              # Main form page
├── [key]/page.tsx        # Dynamic redirect page
├── api/
│   ├── shorten/route.ts  # URL shortening API
│   └── redirect/[key]/route.ts  # URL lookup API
└── lib/
    ├── types.ts          # TypeScript type definitions
    ├── urlShortener.ts   # Core shortening logic
    ├── mongodb.ts        # Database connection
    └── models/Url.ts     # Mongoose schema
```

### Backend (API Routes)

- **POST** `/api/shorten` - Creates short URLs
- **GET** `/api/redirect/{key}` - Retrieves original URLs
- **GET** `/{key}` - Redirects to original URLs

### Database (MongoDB)

```javascript
// URL Schema
{
  shortKey: String,      // 6-character unique identifier
  originalUrl: String,   // Original long URL
  createdAt: String,     // ISO timestamp
  accessCount: Number    // Click counter
}
```

## 🧮 Algorithm Explanation

### 1. URL Shortening Algorithm

#### Step 1: Input Validation

```typescript
function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}
```

#### Step 2: Security Check

```typescript
const maliciousPatterns = [
  "javascript:",
  "data:",
  "vbscript:",
  "about:",
  "chrome:",
  "file:",
];
// Reject URLs with dangerous schemes
```

#### Step 3: Duplicate Check

```typescript
// Check if URL already exists
const existingUrl = await Url.findOne({ originalUrl });
if (existingUrl) {
  return existingUrl.shortKey; // Return existing key
}
```

#### Step 4: Short Key Generation

```typescript
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const KEY_LENGTH = 6;

function generateShortKey(): string {
  let result = "";
  for (let i = 0; i < KEY_LENGTH; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}
```

**Key Generation Mathematics:**

- Character set: 62 characters (a-z, A-Z, 0-9)
- Key length: 6 characters
- Total combinations: 62^6 = 56,800,235,584 (~57 billion)
- Collision probability with 1M URLs: ~0.0018%

#### Step 5: Collision Handling

```typescript
let shortKey: string;
let attempts = 0;
const maxAttempts = 100;

do {
  shortKey = generateShortKey();
  attempts++;

  if (attempts > maxAttempts) {
    throw new Error("Unable to generate unique short key");
  }

  const existing = await Url.findOne({ shortKey });
  if (!existing) break;
} while (attempts < maxAttempts);
```

#### Step 6: Database Storage

```typescript
const urlMapping = new Url({
  shortKey,
  originalUrl,
  createdAt: new Date().toISOString(),
  accessCount: 0,
});

await urlMapping.save();
```

### 2. URL Resolution Algorithm

#### Step 1: Key Lookup

```typescript
const mapping = await Url.findOneAndUpdate(
  { shortKey },
  { $inc: { accessCount: 1 } }, // Atomic increment
  { new: true } // Return updated document
);
```

#### Step 2: Redirect Logic

```typescript
if (mapping) {
  // Frontend handles the actual redirect
  window.location.href = mapping.originalUrl;
} else {
  // Show 404 error page
}
```

## 📊 Database Design

### Schema Design Decisions

1. **shortKey as Primary Index**: Fast O(1) lookups
2. **originalUrl Index**: Quick duplicate detection
3. **createdAt Index**: Efficient sorting for admin views
4. **Atomic Updates**: Race condition prevention for access counts

### Indexes

```javascript
UrlSchema.index({ shortKey: 1 }); // Primary lookup
UrlSchema.index({ originalUrl: 1 }); // Duplicate detection
UrlSchema.index({ createdAt: -1 }); // Chronological sorting
```

### Sample Data

```json
{
  "_id": "ObjectId(...)",
  "shortKey": "abc123",
  "originalUrl": "https://example.com/very-long-url",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "accessCount": 42
}
```

## 🔒 Security Measures

### 1. URL Validation

- Protocol validation (HTTP/HTTPS only)
- Malicious scheme prevention
- Input sanitization

### 2. Rate Limiting Prevention

- Duplicate URL detection
- Collision handling with retry limits
- Error handling for edge cases

### 3. Database Security

- MongoDB connection string in environment variables
- Mongoose schema validation
- Index-based performance optimization

## 📈 Performance Optimizations

### 1. Database Optimizations

- **Indexing**: O(1) lookups on shortKey
- **Atomic Operations**: Single query for read + increment
- **Connection Pooling**: Reuse database connections

### 2. Frontend Optimizations

- **Client-side Validation**: Immediate feedback
- **Loading States**: Better user experience
- **Error Handling**: Graceful failure management

### 3. Scalability Considerations

- **Horizontal Scaling**: Stateless API design
- **Caching Layer**: Redis for frequently accessed URLs
- **CDN Integration**: Global distribution capability
- **Load Balancing**: Multiple server instances

## 🚦 API Endpoints

### POST /api/shorten

**Request:**

```json
{
  "url": "https://example.com/very-long-url"
}
```

**Response (201):**

```json
{
  "key": "abc123",
  "originalUrl": "https://example.com/very-long-url",
  "shortUrl": "http://localhost:80/abc123"
}
```

**Error Response (400/500):**

```json
{
  "error": "Invalid URL format"
}
```

### GET /api/redirect/{key}

**Response (200):**

```json
{
  "originalUrl": "https://example.com/very-long-url",
  "key": "abc123",
  "accessCount": 43
}
```

**Error Response (404):**

```json
{
  "error": "URL not found"
}
```

### GET /{key}

- **Success**: Redirects to original URL
- **Failure**: Shows 404 error page

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Port 80 access (may require admin privileges)

### 2. Installation

```bash
# Clone and install dependencies
npm install

# Setup MongoDB (choose one):
# Option A: Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Option B: Local installation
# Download from https://www.mongodb.com/try/download/community

# Create environment file
echo "MONGODB_URI=mongodb://localhost:27017/url-shortener" > .env.local
```

### 3. Running the Application

```bash
# Development (port 80)
npm run dev

# Production
npm run build
npm start
```

### 4. Testing

1. Open `http://localhost:80`
2. Enter a long URL (e.g., `https://www.google.com`)
3. Click "Shorten URL"
4. Click the generated short URL
5. Verify redirection works

## 📚 Code Examples

### Creating a Short URL (Frontend)

```typescript
const response = await fetch("/api/shorten", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: userInput }),
});

const data = await response.json();
console.log(data.shortUrl); // http://localhost:80/abc123
```

### Using the Short URL

```html
<!-- User clicks this link -->
<a href="http://localhost:80/abc123" target="_blank">
  http://localhost:80/abc123
</a>
```

## 🔍 Troubleshooting

### Common Issues

1. **Port 80 Access Denied**

   - Run terminal as Administrator (Windows)
   - Use alternative port: `npx next dev -p 8080`

2. **MongoDB Connection Failed**

   - Check MongoDB is running: `mongosh`
   - Verify connection string in `.env.local`

3. **API Routes Not Found**

   - Restart development server
   - Check file structure in `src/app/api/`

4. **Linter Errors**
   - Files ignored in `.eslintrc.json`
   - Run `npm run lint` to check

## 🚀 Future Enhancements

1. **Custom Short URLs**: User-defined short codes
2. **Analytics Dashboard**: Detailed click statistics
3. **QR Code Generation**: Visual sharing options
4. **Bulk URL Processing**: CSV import/export
5. **User Accounts**: Personal URL management
6. **API Rate Limiting**: Prevent abuse
7. **Link Expiration**: Time-based URL invalidation
8. **Custom Domains**: Branded short URLs

## 📄 License

This project is for educational purposes and demonstration of URL shortening algorithms and modern web development practices.

---

**Built with ❤️ using Next.js, TypeScript, MongoDB, and Tailwind CSS**
