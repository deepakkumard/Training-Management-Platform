# TrainPro - Training Management Platform

A comprehensive web-based training management platform built with React.js frontend and designed to integrate with Laravel backend APIs.

## Features

### 🎯 Core Functionality
- **Course Management**: Create, update, list, and delete training courses
- **Student Management**: Complete CRUD operations on student profiles
- **Instructor Management**: Manage instructor profiles and assignments
- **Training Schedules**: Create one-time or recurring training sessions
- **Enrollment System**: Students can opt-in/opt-out of available sessions
- **Attendance Tracking**: Generate PDF attendance reports
- **Dashboard Analytics**: Comprehensive statistics and activity tracking

### 👥 User Roles
- **Admin**: Full access to all features and management capabilities
- **Instructor**: Access to courses, students, schedules, and teaching materials
- **Student**: View available trainings, manage enrollments, track progress

### 🔐 Authentication & Security
- JWT token-based authentication with Laravel Sanctum
- Role-based access control (RBAC)
- Protected routes and API endpoints
- Secure session management

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** with Yup validation
- **Recharts** for data visualization
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend Integration
- **Laravel 12** REST API
- **MySQL** database
- **Laravel Sanctum** for authentication
- **DomPDF** for report generation

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main application layout
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── lib/               # Utilities and configurations
│   └── api.ts         # API service layer with mock data
├── pages/             # Application pages
│   ├── Auth/          # Authentication pages
│   ├── Courses/       # Course management
│   ├── Students/      # Student management
│   ├── Instructors/   # Instructor management
│   └── Schedules/     # Training schedule management
├── utils/             # Utility functions
│   └── pdfGenerator.ts # PDF generation utilities
└── App.tsx            # Main application component
```

## API Endpoints

### Authentication
- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login
- `POST /api/v1/logout` - User logout
- `GET /api/v1/profile` - Get user profile

### Core Resources
- `GET|POST|PUT|DELETE /api/v1/courses` - Course management
- `GET|POST|PUT|DELETE /api/v1/students` - Student management
- `GET|POST|PUT|DELETE /api/v1/instructors` - Instructor management
- `GET|POST|PUT|DELETE /api/v1/schedules` - Schedule management
- `GET|POST|PUT|DELETE /api/v1/enrollments` - Enrollment management

### Special Features
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `POST /api/v1/training/{id}/optin` - Student enrollment
- `DELETE /api/v1/training/{id}/optout` - Student withdrawal
- `GET /api/v1/training/{id}/attendance/pdf` - Attendance report

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Laravel 12 backend API
- MySQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trainpro-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Laravel API URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
# Example
**Create Demo Accounts:**
- **Admin**: admin@trainpro.com / password123
- **Instructor**: instructor@trainpro.com / password123
- **Student**: student@trainpro.com / password123

## Key Features

### Dashboard
- Real-time statistics and metrics
- Interactive charts and visualizations
- Recent activity tracking
- Role-specific data views

### Course Management
- Complete CRUD operations
- Category and level filtering
- Advanced search functionality
- Course enrollment tracking

### Student Management
- Student profile management
- Enrollment history tracking
- Training progress monitoring
- Bulk operations support

### Training Schedules
- Flexible scheduling system
- Recurring session support
- Instructor assignment
- Capacity management
- PDF attendance reports

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Progressive web app ready

## Error Handling

- Comprehensive error boundaries
- API error interception and handling
- User-friendly error messages
- Graceful fallbacks for failed requests
- Loading states and skeleton screens

## Performance Optimizations

- Code splitting and lazy loading
- Optimized bundle size
- Efficient state management
- Memoized components
- Image optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.