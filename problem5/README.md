# User Management API (Problem 5)

A full-stack application implementing a User Management system with REST API backend and React frontend.

## 🎯 Requirements Implementation

### Backend Requirements ✅ COMPLETED

**Table: users**

- ✅ `name` (string) - Full name of the user
- ✅ `age` (number) - Age must be a number
- ✅ `email` (string) - Must be unique, validated with regex
- ✅ `avatarUrl` (string, optional) - URL to user avatar

**API Endpoints:**

| Endpoint                                 | Method | Description                            | Status |
| ---------------------------------------- | ------ | -------------------------------------- | ------ |
| `GET /api/user?q=ค้นหา&start=0&limit=10` | GET    | Get all users with search & pagination | ✅     |
| `GET /api/user/:userId`                  | GET    | Get user detail by ID                  | ✅     |
| `POST /api/user`                         | POST   | Create user                            | ✅     |
| `PUT /api/user/:userId`                  | PUT    | Update user by ID                      | ✅     |
| `DELETE /api/user/:userId`               | DELETE | Delete user by ID                      | ✅     |

**Features:**

- ✅ Search by name or email (Thai/English support)
- ✅ Pagination with start/limit parameters
- ✅ Email validation and uniqueness check
- ✅ Age validation (must be number)
- ✅ Success/failure response messages
- ✅ MongoDB integration with Mongoose
- ✅ Comprehensive Swagger API documentation

### Frontend Requirements ✅ COMPLETED

- ✅ React.js frontend (Next.js with TypeScript)
- ✅ User lists with data from API
- ✅ Search box functionality
- ✅ Table view to show data
- ✅ Edit/remove UI functionality
- ✅ Pagination to other pages
- ✅ Modern responsive design with Tailwind CSS

## 🚀 Full Stack Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd problem5/backend
npm install
npm run start:dev
```

**🌐 Backend URLs:**

- API Base: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api-docs`

### Frontend Setup

```bash
cd problem5/frontend
npm install
npm run dev
```

**🌐 Frontend URLs:**

- Application: `http://localhost:3001`

### Start MongoDB

```bash
# Option 1: Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Option 2: Local MongoDB service
# Windows: MongoDB starts automatically
# macOS: brew services start mongodb/brew/mongodb-community
# Linux: sudo systemctl start mongod
```

## 📱 Frontend Features

### 🎨 Modern UI/UX

- **Clean Design**: Modern interface with Tailwind CSS
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Professional Look**: Business-ready styling with proper spacing and typography
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: User-friendly error messages and validation

### 🔍 Search & Filter

- **Real-time Search**: Search by name or email as you type
- **Thai/English Support**: Full Unicode support for international names
- **Case Insensitive**: Finds results regardless of case
- **Clear Results**: Proper feedback when no results found

### �� Data Management

- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Form Validation**: Client-side validation for all fields
- **Modal Forms**: Clean popup forms for creating and editing users
- **Confirmation Dialogs**: Prevents accidental deletions

### 🗂️ Table Features

- **Sortable Columns**: Click to sort by different fields
- **Avatar Display**: Shows user avatars with fallback initials
- **Quick Actions**: Edit, delete, and view avatar buttons
- **User Details**: Shows ID, creation date, and full information

### 📄 Pagination

- **Page Navigation**: Previous/Next and direct page number navigation
- **Results Counter**: Shows current page range and total results
- **Configurable Size**: 10 items per page (easily configurable)
- **Performance**: Only loads data for current page

### 🔗 API Integration

- **Axios Client**: Professional HTTP client with interceptors
- **Error Handling**: Proper error catching and user feedback
- **Loading States**: Shows loading indicators during API calls
- **Auto Refresh**: Automatically refreshes data after CRUD operations

## 📚 API Documentation

### Swagger UI

Visit `http://localhost:3000/api-docs` for interactive API documentation with:

- Complete endpoint descriptions
- Request/response schemas
- Try-it-out functionality
- Example payloads

### API Examples

#### 1. Create User

```bash
POST http://localhost:3000/api/user
Content-Type: application/json

{
  "name": "John Doe",
  "age": 25,
  "email": "john.doe@example.com",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

#### 2. Get All Users (with search & pagination)

```bash
GET http://localhost:3000/api/user?q=john&start=0&limit=5
```

#### 3. Search Users

```bash
# Search by name
GET http://localhost:3000/api/user?q=john

# Search by email
GET http://localhost:3000/api/user?q=john.doe

# Thai language search
GET http://localhost:3000/api/user?q=สมชาย
```

#### 4. Get User by ID

```bash
GET http://localhost:3000/api/user/507f1f77bcf86cd799439011
```

#### 5. Update User

```bash
PUT http://localhost:3000/api/user/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "name": "John Smith",
  "age": 26
}
```

#### 6. Delete User

```bash
DELETE http://localhost:3000/api/user/507f1f77bcf86cd799439011
```

## 🔧 Technical Architecture

### Backend Stack

- **Framework**: NestJS 11.0
- **Database**: MongoDB with Mongoose ODM
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI 3.0
- **Language**: TypeScript

### Frontend Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)

### Database Schema

```javascript
// User Collection
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "age": 25,
  "email": "john.doe@example.com",
  "avatarUrl": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Key Features

- **Search**: MongoDB regex search on name and email fields
- **Pagination**: Skip/limit with total count
- **Validation**: DTO validation with decorators
- **Error Handling**: Proper HTTP status codes and messages
- **CORS**: Enabled for frontend integration
- **Documentation**: Comprehensive Swagger UI

## 🧪 Testing

### Manual Testing

1. **Backend**: Visit `http://localhost:3000/api-docs` and test all endpoints
2. **Frontend**: Visit `http://localhost:3001` and test the UI

### Sample Test Data

```json
[
  {
    "name": "Alice Johnson",
    "age": 28,
    "email": "alice.johnson@example.com",
    "avatarUrl": "https://images.unsplash.com/photo-1494790108755-2616b9fd1770?w=150"
  },
  {
    "name": "Bob Smith",
    "age": 32,
    "email": "bob.smith@example.com",
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    "name": "สมชาย ใจดี",
    "age": 35,
    "email": "somchai@example.com",
    "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  }
]
```

## 📝 API Response Examples

### Success Responses

**GET /api/user (List Users)**

```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "age": 25,
      "email": "john.doe@example.com",
      "avatarUrl": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "start": 0,
  "limit": 10
}
```

**DELETE /api/user/:userId**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Error Responses

**Email Already Exists (409)**

```json
{
  "statusCode": 409,
  "message": "Email already exists"
}
```

**User Not Found (404)**

```json
{
  "statusCode": 404,
  "message": "User with ID 507f1f77bcf86cd799439011 not found"
}
```

## 🚀 Next Steps

1. **Enhancements**

   - Add user profile images upload
   - Implement advanced filtering
   - Add data export functionality
   - Create user activity logs
   - Add real-time notifications

2. **Performance**
   - Implement caching
   - Add pagination optimizations
   - Database indexing
   - Image optimization

## �� Project Structure

```
problem5/
├── backend/
│   ├── src/
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx
│   │   ├── types/
│   │   │   └── user.ts
│   │   └── services/
│   │       └── api.ts
│   └── package.json
└── README.md
```

---

**Built with ❤️ using NestJS, Next.js, MongoDB, TypeScript, Tailwind CSS, and Swagger**
