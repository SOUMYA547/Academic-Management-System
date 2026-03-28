# Academic Management System

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Multi-role authentication system (Teacher, Student, Parent, Admin) with RBAC
- Role-based dashboards with unique features per role
- Attendance system: mark attendance, date-wise records, auto-calculate percentage, visual analytics
- Attendance alerts when below 75% threshold
- Semester planning: lesson plans, study materials, assignments organized by subject/date
- Real-time chat system between students and teachers (message history stored)
- Material access for students (PDFs, notes, links)
- Timetable feature with daily schedule and venue details
- Report generation with attendance records, lesson coverage, assignment details
- AI chatbot (rule-based) for student doubt answering
- Data visualization: bar/pie charts for attendance
- Profile management for all users

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- User management: store users with roles (teacher/student/parent/admin), profiles
- Attendance: mark attendance per student per date, calculate percentage
- Materials: store metadata for uploaded materials (title, subject, type, url/content)
- Assignments: create/submit assignments with due dates
- Messages: store chat messages between users
- Timetable: store class schedules per day
- Alerts: track attendance alerts
- Reports: aggregate data for report generation
- Seed sample data for demo (sample login abc@xyz.com / a1b2c3d4 as teacher)

### Frontend (React + TypeScript)
- Mobile-first responsive layout (max-width 430px centered)
- Login/Register screens with role selection
- Bottom navigation bar: Home, Attendance, Chat, Materials, Profile (5 tabs)
- Sticky header with user greeting
- Role-based dashboard cards
- Attendance marking UI for teachers, attendance view for students/parents
- Chart visualizations (bar/pie) for attendance data
- Chat interface (WhatsApp-style)
- Materials library with filter by subject
- Timetable weekly view
- Report generation/download UI
- FAB for quick actions
- Smooth transitions, micro-interactions, pull-to-refresh simulation
- Dark mode toggle
- AI chatbot widget
