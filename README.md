# EDM Dashboard (Employee Data Management)

A modern, feature-rich Employee Data Management system built with **Angular 19** and **TypeScript**.

![Angular](https://img.shields.io/badge/Angular-19-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

## 🚀 Features

### Core Functionality
- ✅ **Full CRUD Operations**: Create, Read, Update, and Delete employee records
- ✅ **Advanced Search**: Real-time case-insensitive search by name or email
- ✅ **Smart Filtering**: Filter employees by department (HR, Engineering, Sales, Marketing)
- ✅ **Flexible Sorting**: Sort by name or date of joining (ascending/descending)
- ✅ **Data Persistence**: All data stored in browser localStorage
- ✅ **Form Validation**: Comprehensive validation with custom validators

### Bonus Features
- 🎁 **CSV Export**: Download filtered/sorted employee lists as CSV
- 🎁 **Dark Mode Support**: Automatic theme detection and support
- 🎁 **Modern UI/UX**: Premium design with Tailwind CSS and Lucide icons
- 🎁 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎁 **Confirmation Dialogs**: Safe delete operations with user confirmation

## 🛠️ Tech Stack

- **Framework**: Angular 19 (Standalone Components)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide Angular
- **State Management**: RxJS BehaviorSubject
- **Forms**: Reactive Forms with custom validators
- **Build Tool**: Angular CLI with Vite

## 📋 Assumptions & Design Decisions

1. **No Backend Required**: Uses browser `localStorage` for data persistence
2. **Demo Authentication**: Single demo user credentials (`Newuser` / `123456`)
3. **Date Validation**: Custom validator prevents future joining dates
4. **Unique IDs**: Uses `crypto.randomUUID()` for client-side ID generation
5. **Case-Insensitive Search**: Search works across name and email fields
6. **Department Enum**: Predefined departments (HR, Engineering, Sales, Marketing)

## 🏃 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Pankhi-Sarma/EDM-employee-data-management.git
   cd EDM-employee-data-management
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   Navigate to `http://localhost:4200/`

### Login Credentials
```
Username: Newuser
Password: 123456
```

## 📁 Project Structure

```
src/
├── app/
│   ├── models/
│   │   └── employee.model.ts          # TypeScript interfaces & types
│   ├── services/
│   │   └── employee.service.ts        # Business logic & data management
│   ├── pages/
│   │   ├── login/                     # Login page component
│   │   └── dashboard/                 # Main dashboard component
│   ├── validators/
│   │   └── date.validator.ts          # Custom form validators
│   ├── app.component.ts               # Root component
│   ├── app.config.ts                  # App configuration
│   └── app.routes.ts                  # Routing & guards
├── styles.css                         # Global Tailwind styles
├── index.html                         # Entry HTML
└── main.ts                            # Bootstrap file
```

## 🎨 Key Features Explained

### 1. Employee Management
- **Add Employee**: Modal form with validation (name, email, department, date)
- **Edit Employee**: Pre-filled form for updating existing records
- **Delete Employee**: Confirmation dialog before deletion
- **View All**: Responsive table displaying all employee data

### 2. Search & Filter
- **Search Bar**: Real-time filtering by name or email
- **Department Filter**: Dropdown to filter by specific department
- **Combined Filters**: Search and department filter work together

### 3. Sorting
- **Name Sorting**: Alphabetical sorting (A-Z or Z-A)
- **Date Sorting**: Sort by joining date (oldest first or newest first)
- **Toggle Direction**: Click column header to toggle sort direction

### 4. CSV Export
- Exports current filtered/sorted view
- Includes all employee fields
- Auto-generates filename with current date

## 🔒 Form Validation

- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Department**: Required, must be from predefined list
- **Date of Joining**: Required, cannot be in the future (custom validator)

## 🎯 Build & Deploy

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```
Output will be in `dist/` directory.

### Run Tests
```bash
npm test
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication with JWT
- [ ] Pagination for large datasets
- [ ] Advanced filtering options
- [ ] Employee profile pictures
- [ ] Export to Excel/PDF
- [ ] Print functionality
- [ ] Bulk operations

## 👨‍💻 Development Notes

### Code Quality
- Follows Angular style guide
- TypeScript strict mode enabled
- Standalone components (no NgModules)
- Reactive programming with RxJS
- Clean, maintainable code structure

### Performance
- Lazy loading for routes
- Optimized change detection
- Efficient localStorage operations
- Minimal bundle size with tree-shaking

## 📄 License

This project is created as part of a technical assessment.

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for beautiful icons

---

**Built with ❤️ using Angular 19**
