# EduSkill - Video Learning & Skilled Workers Marketplace

A comprehensive Angular-based platform that combines video-based learning with a marketplace for skilled professionals. Learn through high-quality video courses and connect with expert workers for your projects.

## About EduSkill

EduSkill is a dual-purpose platform designed to:
- **Learn Through Video**: Access educational video courses and tutorials to develop new skills
- **Watch & Learn**: Browse and watch instructional videos that help you learn effectively
- **Hire Skilled Workers**: Connect with professional skilled workers for your projects
- **Marketplace**: A vibrant marketplace where professionals showcase their skills and services

## Features

### 🎓 Video Learning Platform
- **Video Courses**: Comprehensive courses with structured video lessons
- **Watch Videos**: Browse and watch educational content
- **Learn at Your Pace**: Pause, rewind, and replay videos as needed
- **Course Categories**: Organized content for easy discovery
- **Progress Tracking**: Track your learning journey

### 👷 Skilled Workers Marketplace
- **Professional Profiles**: Browse profiles of skilled workers
- **Hire Experts**: Connect with professionals for your projects
- **Skill Categories**: Find workers by their expertise
- **Reviews & Ratings**: Make informed hiring decisions
- **Direct Communication**: Message and negotiate with workers

### 🎨 Platform Features
- **Authentication System**: Secure login for learners and workers
- **Theme System**: Light/Dark mode for comfortable viewing
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI/UX**: Intuitive interface for easy navigation
- **Search & Filter**: Find courses and workers quickly

### 📱 Layout Structure
- **Header**: Navigation with search, theme toggle, right panel toggle, and user menu
- **Left Sidebar**: Quick access to courses, workers, and marketplace (collapsible)
- **Main Content**: Video player, course content, or worker profiles (responsive width)
- **Right Panel**: Course details, worker information, and recommendations (conditional display)
  - Shows by default when logged in
  - Hidden when logged out
  - Toggle visibility via header button

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (v17 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd EduSkill
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   ng serve
   ```

4. **Open your browser:**
   Navigate to `http://localhost:4200`

### Demo Credentials
- **Username**: admin
- **Password**: password

## Platform Sections

### 📚 Learning Hub
- **All Courses**: Browse all available video courses
- **My Courses**: Access your enrolled courses
- **Video Library**: Watch educational videos
- **Learning Progress**: Track your achievements

### 🔨 Workers Marketplace
- **Find Workers**: Search skilled professionals by category
- **Worker Profiles**: View detailed profiles and portfolios
- **Hire & Connect**: Send hiring requests and messages
- **My Projects**: Manage your hired workers and projects

### 💼 For Skilled Workers
- **Create Profile**: Showcase your skills and experience
- **List Services**: Add services you offer
- **Manage Bookings**: Handle client requests
- **Portfolio**: Display your work samples

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── layout/
│   │       ├── header/          # Top navigation bar
│   │       ├── sidebar/         # Navigation menu
│   │       ├── right-panel/     # Content details panel
│   │       └── main-layout/     # Main layout wrapper
│   ├── pages/
│   │   ├── login/              # User authentication
│   │   ├── dashboard/          # User dashboard
│   │   ├── courses/            # Video courses section
│   │   ├── videos/             # Video library
│   │   ├── workers/            # Skilled workers marketplace
│   │   ├── marketplace/        # Services marketplace
│   │   ├── messages/           # Communication center
│   │   └── settings/           # User preferences
│   ├── modules/
│   │   ├── courses/            # Course management
│   │   ├── workers/            # Worker profiles
│   │   └── marketplace/        # Marketplace features
│   ├── services/
│   │   ├── auth.ts             # Authentication
│   │   ├── theme.ts            # Theme management
│   │   ├── video.ts            # Video services
│   │   └── worker.ts           # Worker services
│   └── guards/
│       └── auth-guard.ts       # Route protection
└── styles.scss                 # Global styles
```

## User Types

### 1. **Learners**
- Browse and watch video courses
- Enroll in courses
- Track learning progress
- Hire skilled workers for projects

### 2. **Skilled Workers**
- Create professional profiles
- List services and skills
- Receive job requests
- Communicate with clients

### 3. **Instructors**
- Upload video courses
- Manage course content
- Track student engagement

## Theme System

The platform uses CSS custom properties for comfortable viewing:

### Light Theme
- Bright backgrounds for daytime viewing
- Clear contrast for easy reading
- Optimized for video watching

### Dark Theme
- Dark backgrounds for nighttime viewing
- Reduced eye strain
- Better for extended video sessions

## Responsive Design

### Desktop (≥992px)
- Full layout with video player
- Side panels for course/worker details
- Enhanced viewing experience

### Tablet (768px - 991px)
- Optimized video player
- Collapsible panels
- Touch-friendly controls

### Mobile (<768px)
- Mobile-optimized video player
- Swipeable navigation
- Full-screen viewing option

## Key Features in Development

- 🎥 Video player integration
- 📝 Course creation tools
- 👤 Worker profile management
- 💳 Payment integration
- ⭐ Review and rating system
- 💬 Real-time messaging
- 🔔 Notification system
- 📊 Analytics dashboard

## Available Scripts

- `npm start` - Start development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng serve` - Run development server

## Use Cases

### For Learners
1. Find video courses on topics you want to learn
2. Watch and learn at your own pace
3. Complete courses and get certificates
4. Hire skilled workers for practical projects

### For Skilled Workers
1. Create a professional profile
2. Showcase your skills and portfolio
3. Receive job opportunities
4. Build your reputation through reviews

### For Businesses
1. Find and hire skilled professionals
2. Train staff with video courses
3. Manage multiple projects
4. Access a pool of talent

## Technology Stack

- **Frontend**: Angular 17+
- **Styling**: Bootstrap 5 + Custom SCSS
- **Icons**: Font Awesome
- **State Management**: RxJS
- **Authentication**: JWT-based
- **Routing**: Angular Router with lazy loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

We welcome contributions to make EduSkill better:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Future Roadmap

- [ ] Live video streaming
- [ ] Interactive video quizzes
- [ ] Worker verification system
- [ ] Payment gateway integration
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Social learning features

## License

This project is licensed under the MIT License.

## Support

For support, email support@eduskill.com or join our community forum.

---

**EduSkill** - Learn through video, connect with skilled professionals, and grow together!