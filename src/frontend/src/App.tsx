import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  BookMarked,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  FileText,
  GraduationCap,
  Home,
  Link,
  LogOut,
  MessageCircle,
  Moon,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  Star,
  StickyNote,
  Sun,
  TrendingUp,
  Upload,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "teacher" | "student" | "parent" | "admin";
interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  subjects?: string[];
  phone?: string;
  grade?: string;
  childName?: string;
}
type Tab = "home" | "attendance" | "chat" | "materials" | "profile";

// ─── Sample Data ─────────────────────────────────────────────────────────────
const DEMO_USERS: DemoUser[] = [
  {
    id: "t1",
    name: "Dr. Sarah Johnson",
    email: "abc@xyz.com",
    password: "a1b2c3d4",
    role: "teacher",
    subjects: ["Mathematics", "Physics"],
    phone: "+91 98765 43210",
  },
  {
    id: "s1",
    name: "Alex Kumar",
    email: "student@ams.com",
    password: "student123",
    role: "student",
    phone: "+91 87654 32109",
    grade: "10-A",
  },
  {
    id: "p1",
    name: "Rajesh Kumar",
    email: "parent@ams.com",
    password: "parent123",
    role: "parent",
    phone: "+91 76543 21098",
    childName: "Alex Kumar",
  },
  {
    id: "a1",
    name: "Admin User",
    email: "admin@ams.com",
    password: "admin123",
    role: "admin",
    phone: "+91 65432 10987",
  },
];

const ATTENDANCE_DATA = [
  { month: "Aug", present: 22, absent: 2 },
  { month: "Sep", present: 19, absent: 4 },
  { month: "Oct", present: 21, absent: 1 },
  { month: "Nov", present: 18, absent: 5 },
  { month: "Dec", present: 20, absent: 3 },
];

const SUBJECT_ATTENDANCE = [
  { subject: "Mathematics", percentage: 88 },
  { subject: "Physics", percentage: 76 },
  { subject: "Chemistry", percentage: 92 },
  { subject: "English", percentage: 95 },
  { subject: "History", percentage: 70 },
];

const MATERIALS = [
  {
    id: "m1",
    title: "Calculus Chapter 5 Notes",
    subject: "Mathematics",
    type: "pdf",
    uploadedBy: "Dr. Sarah Johnson",
    date: "2 days ago",
    size: "2.4 MB",
  },
  {
    id: "m2",
    title: "Newton's Laws – Video",
    subject: "Physics",
    type: "link",
    uploadedBy: "Dr. Sarah Johnson",
    date: "3 days ago",
    url: "#",
  },
  {
    id: "m3",
    title: "Organic Chemistry Summary",
    subject: "Chemistry",
    type: "note",
    uploadedBy: "Prof. Sharma",
    date: "5 days ago",
  },
  {
    id: "m4",
    title: "Quadratic Equations PDF",
    subject: "Mathematics",
    type: "pdf",
    uploadedBy: "Dr. Sarah Johnson",
    date: "1 week ago",
    size: "1.1 MB",
  },
  {
    id: "m5",
    title: "English Grammar Handbook",
    subject: "English",
    type: "pdf",
    uploadedBy: "Ms. Priya",
    date: "1 week ago",
    size: "3.2 MB",
  },
  {
    id: "m6",
    title: "Thermodynamics Reference",
    subject: "Physics",
    type: "link",
    uploadedBy: "Dr. Sarah Johnson",
    date: "2 weeks ago",
  },
];

const ASSIGNMENTS = [
  {
    id: "a1",
    title: "Calculus Problem Set 3",
    subject: "Mathematics",
    due: "Tomorrow",
    status: "pending",
    points: 20,
  },
  {
    id: "a2",
    title: "Wave Optics Lab Report",
    subject: "Physics",
    due: "3 days",
    status: "submitted",
    points: 30,
  },
  {
    id: "a3",
    title: "Essay: Industrial Revolution",
    subject: "History",
    due: "Next week",
    status: "pending",
    points: 25,
  },
  {
    id: "a4",
    title: "Chemical Bonding Quiz",
    subject: "Chemistry",
    due: "Overdue",
    status: "overdue",
    points: 15,
  },
];

const TIMETABLE: Record<
  string,
  { time: string; subject: string; venue: string; color: string }[]
> = {
  Mon: [
    {
      time: "09:00",
      subject: "Mathematics",
      venue: "Room 201",
      color: "#7C3AED",
    },
    { time: "10:30", subject: "Physics", venue: "Lab 3", color: "#0EA5E9" },
    { time: "12:00", subject: "English", venue: "Room 105", color: "#10B981" },
    { time: "14:00", subject: "History", venue: "Room 302", color: "#F59E0B" },
  ],
  Tue: [
    { time: "09:00", subject: "Chemistry", venue: "Lab 1", color: "#EF4444" },
    {
      time: "11:00",
      subject: "Mathematics",
      venue: "Room 201",
      color: "#7C3AED",
    },
    { time: "14:00", subject: "Physics", venue: "Lab 3", color: "#0EA5E9" },
  ],
  Wed: [
    { time: "09:30", subject: "English", venue: "Room 105", color: "#10B981" },
    {
      time: "11:00",
      subject: "Mathematics",
      venue: "Room 201",
      color: "#7C3AED",
    },
    { time: "13:30", subject: "Chemistry", venue: "Lab 1", color: "#EF4444" },
  ],
  Thu: [
    { time: "09:00", subject: "Physics", venue: "Lab 3", color: "#0EA5E9" },
    { time: "11:30", subject: "History", venue: "Room 302", color: "#F59E0B" },
    {
      time: "14:00",
      subject: "Mathematics",
      venue: "Room 201",
      color: "#7C3AED",
    },
  ],
  Fri: [
    {
      time: "09:00",
      subject: "Mathematics",
      venue: "Room 201",
      color: "#7C3AED",
    },
    { time: "10:30", subject: "English", venue: "Room 105", color: "#10B981" },
    { time: "14:00", subject: "Chemistry", venue: "Lab 1", color: "#EF4444" },
  ],
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const CONVERSATIONS = [
  {
    id: "c1",
    name: "Dr. Sarah Johnson",
    role: "Teacher",
    lastMsg: "Assignment due tomorrow!",
    time: "10:32 AM",
    unread: 2,
    avatar: "SJ",
  },
  {
    id: "c2",
    name: "Prof. Sharma",
    role: "Teacher",
    lastMsg: "Check the new materials",
    time: "Yesterday",
    unread: 0,
    avatar: "PS",
  },
  {
    id: "c3",
    name: "Alex Kumar",
    role: "Student",
    lastMsg: "Sir, I have a doubt",
    time: "Yesterday",
    unread: 1,
    avatar: "AK",
  },
  {
    id: "c4",
    name: "Rajesh Kumar",
    role: "Parent",
    lastMsg: "Thank you for the update",
    time: "Mon",
    unread: 0,
    avatar: "RK",
  },
];

const CHAT_MESSAGES: Record<
  string,
  { id: string; text: string; sent: boolean; time: string }[]
> = {
  c1: [
    {
      id: "1",
      text: "Good morning! Just a reminder that the Calculus Problem Set 3 is due tomorrow.",
      sent: false,
      time: "10:30 AM",
    },
    {
      id: "2",
      text: "Thank you for the reminder, ma'am!",
      sent: true,
      time: "10:31 AM",
    },
    {
      id: "3",
      text: "Please make sure you show all working steps.",
      sent: false,
      time: "10:32 AM",
    },
    {
      id: "4",
      text: "Will do! I had a question about problem 7...",
      sent: true,
      time: "10:32 AM",
    },
  ],
  c3: [
    {
      id: "1",
      text: "Sir, I have a doubt about Newton's third law application.",
      sent: false,
      time: "Yesterday",
    },
    {
      id: "2",
      text: "Sure, what's your doubt?",
      sent: true,
      time: "Yesterday",
    },
    {
      id: "3",
      text: "When we push a wall, it pushes back with equal force, but the wall doesn't move. Why?",
      sent: false,
      time: "Yesterday",
    },
    {
      id: "4",
      text: "Great question! The net force on the wall is zero because the floor also exerts friction. The system is in equilibrium.",
      sent: true,
      time: "Yesterday",
    },
  ],
};

const STUDENTS_LIST = [
  { id: "s1", name: "Alex Kumar", rollNo: "10A-01", present: true },
  { id: "s2", name: "Priya Singh", rollNo: "10A-02", present: true },
  { id: "s3", name: "Ravi Patel", rollNo: "10A-03", present: false },
  { id: "s4", name: "Ananya Sharma", rollNo: "10A-04", present: true },
  { id: "s5", name: "Karthik Nair", rollNo: "10A-05", present: false },
  { id: "s6", name: "Meera Reddy", rollNo: "10A-06", present: true },
  { id: "s7", name: "Arjun Mehta", rollNo: "10A-07", present: true },
  { id: "s8", name: "Divya Iyer", rollNo: "10A-08", present: true },
];

const BOT_RESPONSES: Record<string, string> = {
  attendance:
    "Your current attendance is 82%. You need to maintain at least 75% attendance. You've been present 20 out of 24 days this month.",
  assignment:
    "You have 2 pending assignments: Calculus Problem Set 3 (due tomorrow) and Essay: Industrial Revolution (due next week). Submit them in the Materials section.",
  schedule:
    "Today's schedule: 9:00 Mathematics (Room 201), 10:30 Physics (Lab 3), 12:00 English (Room 105), 14:00 History (Room 302).",
  material:
    "All study materials are available in the Materials tab. You can filter by subject and download PDFs or access links.",
  marks:
    "Your latest scores: Math - 87/100, Physics - 76/100, Chemistry - 92/100, English - 95/100.",
  default:
    "I'm your academic assistant! Ask me about attendance, assignments, schedule, materials, or marks.",
};

function getBotResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("attend")) return BOT_RESPONSES.attendance;
  if (
    lower.includes("assign") ||
    lower.includes("homework") ||
    lower.includes("due")
  )
    return BOT_RESPONSES.assignment;
  if (
    lower.includes("schedule") ||
    lower.includes("timetable") ||
    lower.includes("class") ||
    lower.includes("today")
  )
    return BOT_RESPONSES.schedule;
  if (
    lower.includes("material") ||
    lower.includes("note") ||
    lower.includes("pdf")
  )
    return BOT_RESPONSES.material;
  if (
    lower.includes("mark") ||
    lower.includes("grade") ||
    lower.includes("score")
  )
    return BOT_RESPONSES.marks;
  return BOT_RESPONSES.default;
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getHour() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

const ROLE_COLORS: Record<Role, string> = {
  teacher: "#7C3AED",
  student: "#0EA5E9",
  parent: "#10B981",
  admin: "#F59E0B",
};

const ROLE_LABELS: Record<Role, string> = {
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
  admin: "Admin",
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [darkMode, setDarkMode] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showFAB, setShowFAB] = useState(false);

  // Persist user
  useEffect(() => {
    const saved = localStorage.getItem("ams_user");
    if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  const login = (user: DemoUser) => {
    setCurrentUser(user);
    localStorage.setItem("ams_user", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("ams_user");
    setActiveTab("home");
  };

  if (!currentUser) return <LoginScreen onLogin={login} darkMode={darkMode} />;

  const NavIcon = ({
    tab,
    icon: Icon,
    label,
  }: {
    tab: Tab;
    icon: React.ComponentType<{ size?: number; color?: string }>;
    label: string;
  }) => {
    const active = activeTab === tab;
    return (
      <button
        type="button"
        className="nav-item"
        onClick={() => setActiveTab(tab)}
      >
        <div style={{ position: "relative" }}>
          <Icon size={22} color={active ? "#7C3AED" : "#94A3B8"} />
          {active && (
            <div
              style={{
                position: "absolute",
                bottom: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 4,
                height: 4,
                background: "#7C3AED",
                borderRadius: 2,
              }}
            />
          )}
        </div>
        <span
          className="nav-label"
          style={{ color: active ? "#7C3AED" : "#94A3B8" }}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className={`app-shell${darkMode ? " dark-mode" : ""}`}>
      {/* Main content */}
      <div className="screen">
        {activeTab === "home" && (
          <HomeScreen user={currentUser} darkMode={darkMode} />
        )}
        {activeTab === "attendance" && (
          <AttendanceScreen user={currentUser} darkMode={darkMode} />
        )}
        {activeTab === "chat" && (
          <ChatScreen user={currentUser} darkMode={darkMode} />
        )}
        {activeTab === "materials" && (
          <MaterialsScreen user={currentUser} darkMode={darkMode} />
        )}
        {activeTab === "profile" && (
          <ProfileScreen
            user={currentUser}
            onLogout={logout}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <NavIcon tab="home" icon={Home} label="Home" />
        <NavIcon tab="attendance" icon={Calendar} label="Attend" />
        <NavIcon tab="chat" icon={MessageCircle} label="Chat" />
        <NavIcon tab="materials" icon={BookOpen} label="Materials" />
        <NavIcon tab="profile" icon={User} label="Profile" />
      </nav>

      {/* FAB */}
      {(currentUser.role === "teacher" || currentUser.role === "admin") && (
        <>
          {showFAB && (
            <div
              style={{
                position: "fixed",
                bottom: 148,
                right: "calc(50% - 200px)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                zIndex: 90,
              }}
            >
              {["Upload Material", "Create Assignment", "Mark Attendance"].map(
                (action) => (
                  <button
                    type="button"
                    key={action}
                    onClick={() => {
                      setActiveTab(
                        action.includes("Attend")
                          ? "attendance"
                          : action.includes("Material")
                            ? "materials"
                            : "home",
                      );
                      setShowFAB(false);
                    }}
                    style={{
                      background: "white",
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1E293B",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {action}
                  </button>
                ),
              )}
            </div>
          )}
          <button
            type="button"
            className="fab"
            onClick={() => setShowFAB(!showFAB)}
          >
            {showFAB ? <X size={22} /> : <Plus size={22} />}
          </button>
        </>
      )}

      {/* Chatbot */}
      <button
        type="button"
        className="chatbot-btn"
        onClick={() => setShowChatbot(true)}
        title="AI Assistant"
      >
        <Bot size={22} />
      </button>
      {showChatbot && <ChatbotModal onClose={() => setShowChatbot(false)} />}
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({
  onLogin,
  darkMode: _darkMode,
}: { onLogin: (u: DemoUser) => void; darkMode: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    const user = DEMO_USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) {
      onLogin(user);
    } else {
      setError("Invalid credentials. Check the sample logins below.");
      setLoading(false);
    }
  };

  return (
    <div
      className="app-shell"
      style={{
        background:
          "linear-gradient(135deg, #0B1020 0%, #2A1F5C 60%, #5B36A8 100%)",
        justifyContent: "center",
        padding: "0 24px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            width: 72,
            height: 72,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            backdropFilter: "blur(10px)",
          }}
        >
          <GraduationCap size={36} color="white" />
        </div>
        <h1
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          Academic Management
        </h1>
        <p
          style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 }}
        >
          System
        </p>
      </div>

      {/* Form */}
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          padding: 24,
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          Welcome back
        </h2>
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div>
            <label
              htmlFor="email"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                fontWeight: 500,
                display: "block",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              className="input-field"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.2)",
                color: "white",
              }}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                fontWeight: 500,
                display: "block",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.2)",
                color: "white",
              }}
              required
            />
          </div>
          {error && <p style={{ color: "#FB7185", fontSize: 13 }}>{error}</p>}
          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#6D28D9" : "#7C3AED",
              marginTop: 4,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Hints */}
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            marginTop: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ChevronDown size={14} /> Sample Credentials
        </button>
        {showHint && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {DEMO_USERS.map((u) => (
              <button
                type="button"
                key={u.id}
                onClick={() => {
                  setEmail(u.email);
                  setPassword(u.password);
                }}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                  textAlign: "left",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 12,
                }}
              >
                <span style={{ fontWeight: 600, textTransform: "capitalize" }}>
                  {u.role}
                </span>
                : {u.email} / {u.password}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Role badges */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 24,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {(["Teacher", "Student", "Parent", "Admin"] as const).map((r) => (
          <span
            key={r}
            className="badge"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen({ user, darkMode }: { user: DemoUser; darkMode: boolean }) {
  const today =
    DAYS[new Date().getDay() === 0 ? 4 : (new Date().getDay() - 1) % 5];
  const todayClasses = TIMETABLE[today] || TIMETABLE.Mon;

  return (
    <div>
      {/* Gradient Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0B1020, #2A1F5C, #5B36A8)",
          padding: "48px 20px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
              Good {getHour()},
            </p>
            <h1
              style={{
                color: "white",
                fontSize: 22,
                fontWeight: 800,
                marginTop: 2,
              }}
            >
              {user.name.split(" ")[0]}{" "}
              {user.name.split(" ")[1] ? `${user.name.split(" ")[1][0]}.` : ""}{" "}
              👋
            </h1>
            <span
              className="badge"
              style={{
                background: ROLE_COLORS[user.role],
                color: "white",
                marginTop: 8,
                display: "inline-block",
              }}
            >
              {ROLE_LABELS[user.role]}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 12,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Bell size={18} color="white" />
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  background: "#FB7185",
                  borderRadius: "50%",
                  border: "2px solid #2A1F5C",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        {user.role === "teacher" && (
          <TeacherDashboard todayClasses={todayClasses} darkMode={darkMode} />
        )}
        {user.role === "student" && (
          <StudentDashboard
            user={user}
            todayClasses={todayClasses}
            darkMode={darkMode}
          />
        )}
        {user.role === "parent" && (
          <ParentDashboard user={user} darkMode={darkMode} />
        )}
        {user.role === "admin" && <AdminDashboard darkMode={darkMode} />}
      </div>
    </div>
  );
}

function TeacherDashboard({
  todayClasses,
  darkMode: _darkMode,
}: {
  todayClasses: {
    time: string;
    subject: string;
    venue: string;
    color: string;
  }[];
  darkMode: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginTop: -20,
      }}
    >
      {/* Stats Row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
      >
        {[
          { label: "Students", value: 45, icon: Users, color: "#7C3AED" },
          {
            label: "Today's Classes",
            value: todayClasses.length,
            icon: Calendar,
            color: "#0EA5E9",
          },
          { label: "Pending", value: 12, icon: BookMarked, color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div
              style={{
                width: 32,
                height: 32,
                background: `${s.color}20`,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <s.icon size={16} color={s.color} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#1E293B" }}>
              {s.value}
            </span>
            <span style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Attendance Overview */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1E293B" }}>
            Attendance Overview
          </h3>
          <span style={{ fontSize: 12, color: "#7C3AED", fontWeight: 600 }}>
            This Month
          </span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={ATTENDANCE_DATA}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="present" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" fill="#FB7185" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "#64748B" }}>
            <span style={{ color: "#7C3AED" }}>■</span> Present
          </span>
          <span style={{ fontSize: 11, color: "#64748B" }}>
            <span style={{ color: "#FB7185" }}>■</span> Absent
          </span>
        </div>
      </div>

      {/* Today's Timetable */}
      <div className="card">
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: 12,
          }}
        >
          Today's Schedule
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {todayClasses.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                background: "#F8FAFC",
                borderRadius: 10,
                borderLeft: `3px solid ${c.color}`,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  fontWeight: 600,
                  minWidth: 42,
                }}
              >
                {c.time}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>
                  {c.subject}
                </p>
                <p style={{ fontSize: 11, color: "#94A3B8" }}>{c.venue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="card">
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: 12,
          }}
        >
          Recent Uploads
        </h3>
        {MATERIALS.slice(0, 3).map((m) => (
          <MaterialCard key={m.id} material={m} />
        ))}
      </div>
    </div>
  );
}

function StudentDashboard({
  user: _user,
  todayClasses,
  darkMode: _darkMode,
}: {
  user: DemoUser;
  todayClasses: {
    time: string;
    subject: string;
    venue: string;
    color: string;
  }[];
  darkMode: boolean;
}) {
  const overallPct = 82;
  const isLow = overallPct < 75;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginTop: -20,
      }}
    >
      {/* Attendance Card */}
      <div
        className="card"
        style={{
          background: isLow
            ? "#FEF2F2"
            : "linear-gradient(135deg, #7C3AED, #5B36A8)",
          color: isLow ? "#1E293B" : "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ fontSize: 13, opacity: 0.8 }}>Overall Attendance</p>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>
                {overallPct}
              </span>
              <span style={{ fontSize: 24, fontWeight: 700 }}>%</span>
            </div>
            {isLow && (
              <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 600 }}>
                ⚠️ Below 75% threshold!
              </span>
            )}
            {!isLow && (
              <span style={{ fontSize: 12, opacity: 0.8 }}>
                ✓ Good standing
              </span>
            )}
          </div>
          {/* Donut */}
          <svg
            width={80}
            height={80}
            viewBox="0 0 80 80"
            aria-label="Attendance progress"
          >
            <title>Attendance progress</title>
            <circle
              cx={40}
              cy={40}
              r={30}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={8}
            />
            <circle
              cx={40}
              cy={40}
              r={30}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth={8}
              strokeDasharray={`${(overallPct / 100) * 188} 188`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
            <text
              x={40}
              y={44}
              textAnchor="middle"
              fill="white"
              fontSize={14}
              fontWeight={700}
            >
              {overallPct}%
            </text>
          </svg>
        </div>
      </div>

      {isLow && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 12,
            padding: 12,
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle
            size={16}
            color="#EF4444"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <p style={{ fontSize: 13, color: "#DC2626", lineHeight: 1.5 }}>
            Your attendance has dropped below 75%. Please contact your teacher
            immediately.
          </p>
        </div>
      )}

      {/* Assignments */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1E293B" }}>
            Assignments
          </h3>
          <span style={{ fontSize: 11, color: "#7C3AED", fontWeight: 600 }}>
            {ASSIGNMENTS.filter((a) => a.status === "pending").length} pending
          </span>
        </div>
        {ASSIGNMENTS.map((a) => (
          <div
            key={a.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background:
                  a.status === "submitted"
                    ? "#10B981"
                    : a.status === "overdue"
                      ? "#EF4444"
                      : "#F59E0B",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>
                {a.title}
              </p>
              <p style={{ fontSize: 11, color: "#64748B" }}>
                {a.subject} · Due: {a.due}
              </p>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 20,
                background:
                  a.status === "submitted"
                    ? "#D1FAE5"
                    : a.status === "overdue"
                      ? "#FEE2E2"
                      : "#FEF3C7",
                color:
                  a.status === "submitted"
                    ? "#059669"
                    : a.status === "overdue"
                      ? "#DC2626"
                      : "#D97706",
              }}
            >
              {a.status}
            </span>
          </div>
        ))}
      </div>

      {/* Today's Classes */}
      <div className="card">
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: 12,
          }}
        >
          Today's Classes
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {todayClasses.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                background: "#F8FAFC",
                borderRadius: 10,
                borderLeft: `3px solid ${c.color}`,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  fontWeight: 600,
                  minWidth: 42,
                }}
              >
                {c.time}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>
                  {c.subject}
                </p>
                <p style={{ fontSize: 11, color: "#94A3B8" }}>{c.venue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Materials */}
      <div className="card">
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: 12,
          }}
        >
          Recent Materials
        </h3>
        {MATERIALS.slice(0, 3).map((m) => (
          <MaterialCard key={m.id} material={m} />
        ))}
      </div>
    </div>
  );
}

function ParentDashboard({
  user,
  darkMode: _darkMode,
}: { user: DemoUser; darkMode: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginTop: -20,
      }}
    >
      {/* Child Info */}
      <div
        className="card"
        style={{ background: "linear-gradient(135deg, #0EA5E9, #0284C7)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: 800, fontSize: 18 }}>
              AK
            </span>
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
              Your Child
            </p>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: 16 }}>
              {user.childName || "Alex Kumar"}
            </h3>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
              Grade 10-A · Roll No. 10A-01
            </span>
          </div>
        </div>
      </div>

      {/* Attendance */}
      <div className="card">
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: 16,
          }}
        >
          Attendance Summary
        </h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PieChart width={180} height={140}>
            <Pie
              data={[
                { name: "Present", value: 82 },
                { name: "Absent", value: 18 },
              ]}
              cx={90}
              cy={70}
              innerRadius={45}
              outerRadius={65}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="#7C3AED" />
              <Cell fill="#F1F5F9" />
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#64748B" }}>
          82% attendance this semester
        </p>
      </div>

      {/* Alerts */}
      <div className="card">
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: 12,
          }}
        >
          Alerts & Notifications
        </h3>
        {[
          {
            msg: "Alex was absent on Dec 12",
            time: "2 days ago",
            type: "absent",
          },
          {
            msg: "Physics attendance at 76% - near threshold",
            time: "1 week ago",
            type: "warn",
          },
          {
            msg: "Assignment submitted: Wave Optics Lab Report",
            time: "1 week ago",
            type: "ok",
          },
        ].map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              padding: "10px 0",
              borderBottom: i < 2 ? "1px solid #F1F5F9" : "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background:
                  a.type === "absent"
                    ? "#FEE2E2"
                    : a.type === "warn"
                      ? "#FEF3C7"
                      : "#D1FAE5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {a.type === "absent" ? (
                <XCircle size={16} color="#EF4444" />
              ) : a.type === "warn" ? (
                <AlertTriangle size={16} color="#F59E0B" />
              ) : (
                <CheckCircle size={16} color="#10B981" />
              )}
            </div>
            <div>
              <p style={{ fontSize: 13, color: "#1E293B", fontWeight: 500 }}>
                {a.msg}
              </p>
              <p style={{ fontSize: 11, color: "#94A3B8" }}>{a.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Teacher Contact */}
      <div className="card">
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: 12,
          }}
        >
          Class Teachers
        </h3>
        {[
          {
            name: "Dr. Sarah Johnson",
            subject: "Mathematics & Physics",
            initials: "SJ",
          },
          { name: "Prof. R. Sharma", subject: "Chemistry", initials: "RS" },
        ].map((t) => (
          <div
            key={t.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: "#7C3AED20",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED" }}>
                {t.initials}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>
                {t.name}
              </p>
              <p style={{ fontSize: 12, color: "#64748B" }}>{t.subject}</p>
            </div>
            <button
              type="button"
              style={{
                background: "#7C3AED",
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard({ darkMode: _darkMode }: { darkMode: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginTop: -20,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          {
            label: "Total Students",
            value: 312,
            icon: Users,
            color: "#7C3AED",
            bg: "#7C3AED15",
          },
          {
            label: "Teachers",
            value: 24,
            icon: GraduationCap,
            color: "#0EA5E9",
            bg: "#0EA5E915",
          },
          {
            label: "Parents",
            value: 285,
            icon: User,
            color: "#10B981",
            bg: "#10B98115",
          },
          {
            label: "Active Alerts",
            value: 8,
            icon: AlertTriangle,
            color: "#F59E0B",
            bg: "#F59E0B15",
          },
        ].map((s) => (
          <div key={s.label} className="card">
            <div
              style={{
                width: 40,
                height: 40,
                background: s.bg,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <s.icon size={20} color={s.color} />
            </div>
            <span style={{ fontSize: 28, fontWeight: 900, color: "#1E293B" }}>
              {s.value}
            </span>
            <p style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: 12,
          }}
        >
          System Activity
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={ATTENDANCE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="present" fill="#7C3AED" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: 12,
          }}
        >
          Recent Activity
        </h3>
        {[
          {
            action: "New student registered",
            name: "Pooja Mehta",
            time: "5 min ago",
            icon: Users,
          },
          {
            action: "Material uploaded",
            name: "Dr. Sarah Johnson",
            time: "1 hour ago",
            icon: Upload,
          },
          {
            action: "Attendance marked",
            name: "Prof. Sharma",
            time: "2 hours ago",
            icon: CheckCircle,
          },
          {
            action: "New message",
            name: "Parent - Rajesh Kumar",
            time: "3 hours ago",
            icon: MessageCircle,
          },
        ].map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: i < 3 ? "1px solid #F1F5F9" : "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "#7C3AED15",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <a.icon size={16} color="#7C3AED" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>
                {a.action}
              </p>
              <p style={{ fontSize: 11, color: "#64748B" }}>
                {a.name} · {a.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Attendance Screen ────────────────────────────────────────────────────────
function AttendanceScreen({
  user,
  darkMode: _darkMode,
}: { user: DemoUser; darkMode: boolean }) {
  const [tab, setTab] = useState<"mark" | "view" | "history">(
    user.role === "teacher" ? "mark" : "view",
  );
  const [students, setStudents] = useState(STUDENTS_LIST);
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [submitted, setSubmitted] = useState(false);

  const toggleStudent = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s)),
    );
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0B1020, #2A1F5C)",
          padding: "48px 20px 20px",
        }}
      >
        <h2 style={{ color: "white", fontSize: 22, fontWeight: 800 }}>
          Attendance
        </h2>
        <p
          style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}
        >
          Track and manage attendance records
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          background: "white",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        {(user.role === "teacher"
          ? ["mark", "history"]
          : ["view", "history"]
        ).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t as typeof tab)}
            style={{
              flex: 1,
              padding: "14px",
              border: "none",
              background: "none",
              fontWeight: tab === t ? 700 : 500,
              color: tab === t ? "#7C3AED" : "#64748B",
              fontSize: 14,
              cursor: "pointer",
              borderBottom:
                tab === t ? "2px solid #7C3AED" : "2px solid transparent",
              textTransform: "capitalize",
            }}
          >
            {t === "mark"
              ? "Mark Attendance"
              : t === "view"
                ? "My Attendance"
                : "History"}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {user.role === "teacher" && tab === "mark" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Subject selector */}
            <div className="card">
              <label
                htmlFor="subject-sel"
                style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}
              >
                Subject
              </label>
              <select
                id="subject-sel"
                className="input-field"
                style={{ marginTop: 6 }}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {[
                  "Mathematics",
                  "Physics",
                  "Chemistry",
                  "English",
                  "History",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <span style={{ fontSize: 13, color: "#64748B" }}>
                  Date: {new Date().toLocaleDateString()}
                </span>
                <span
                  style={{ fontSize: 13, color: "#7C3AED", fontWeight: 600 }}
                >
                  {students.filter((s) => s.present).length}/{students.length}{" "}
                  Present
                </span>
              </div>
            </div>

            {/* Student list */}
            <div className="card">
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {students.map((s, i) => (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom:
                        i < students.length - 1 ? "1px solid #F1F5F9" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: "#7C3AED15",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#7C3AED",
                        }}
                      >
                        {getInitials(s.name)}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1E293B",
                        }}
                      >
                        {s.name}
                      </p>
                      <p style={{ fontSize: 11, color: "#94A3B8" }}>
                        {s.rollNo}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleStudent(s.id)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 20,
                        border: "none",
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: "pointer",
                        background: s.present ? "#D1FAE5" : "#FEE2E2",
                        color: s.present ? "#059669" : "#DC2626",
                      }}
                    >
                      {s.present ? "Present" : "Absent"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {submitted ? (
              <div
                style={{
                  background: "#D1FAE5",
                  borderRadius: 12,
                  padding: 16,
                  textAlign: "center",
                }}
              >
                <CheckCircle
                  size={24}
                  color="#059669"
                  style={{ margin: "0 auto 8px" }}
                />
                <p style={{ fontWeight: 700, color: "#059669" }}>
                  Attendance Saved!
                </p>
              </div>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setSubmitted(true)}
              >
                Submit Attendance
              </button>
            )}
          </div>
        )}

        {(user.role === "student" || user.role === "parent") &&
          tab === "view" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Overall */}
              <div
                className="card"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #5B36A8)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                      Overall Attendance
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 4,
                        marginTop: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 42,
                          fontWeight: 900,
                          color: "white",
                        }}
                      >
                        82
                      </span>
                      <span
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        %
                      </span>
                    </div>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      20 present · 4 absent
                    </p>
                  </div>
                  <PieChart width={90} height={90}>
                    <Pie
                      data={[{ value: 82 }, { value: 18 }]}
                      cx={45}
                      cy={45}
                      innerRadius={30}
                      outerRadius={40}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill="rgba(255,255,255,0.9)" />
                      <Cell fill="rgba(255,255,255,0.2)" />
                    </Pie>
                  </PieChart>
                </div>
              </div>

              {/* Subject-wise */}
              <div className="card">
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1E293B",
                    marginBottom: 12,
                  }}
                >
                  Subject-wise Attendance
                </h3>
                {SUBJECT_ATTENDANCE.map((s) => (
                  <div key={s.subject} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#1E293B",
                        }}
                      >
                        {s.subject}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: s.percentage < 75 ? "#EF4444" : "#7C3AED",
                        }}
                      >
                        {s.percentage}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "#F1F5F9",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${s.percentage}%`,
                          background: s.percentage < 75 ? "#EF4444" : "#7C3AED",
                          borderRadius: 3,
                          transition: "width 0.8s ease",
                        }}
                      />
                    </div>
                    {s.percentage < 75 && (
                      <p
                        style={{ fontSize: 11, color: "#EF4444", marginTop: 2 }}
                      >
                        ⚠️ Below threshold
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="card">
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1E293B",
                    marginBottom: 12,
                  }}
                >
                  Monthly Trend
                </h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={ATTENDANCE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar
                      dataKey="present"
                      fill="#7C3AED"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="absent"
                      fill="#FB7185"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        {tab === "history" && (
          <div className="card">
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1E293B",
                marginBottom: 12,
              }}
            >
              Attendance History
            </h3>
            {Array.from({ length: 10 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - i);
              const pct = Math.random() > 0.3;
              return { date: d.toLocaleDateString(), present: pct };
            }).map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < 9 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <span style={{ fontSize: 13, color: "#1E293B" }}>{h.date}</span>
                <span
                  className="badge"
                  style={{
                    background: h.present ? "#D1FAE5" : "#FEE2E2",
                    color: h.present ? "#059669" : "#DC2626",
                  }}
                >
                  {h.present ? "Present" : "Absent"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Chat Screen ──────────────────────────────────────────────────────────────
function ChatScreen({
  user,
  darkMode: _darkMode,
}: { user: DemoUser; darkMode: boolean }) {
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const conv = CONVERSATIONS.filter((c) =>
    user.role === "teacher"
      ? c.role === "Student" || c.role === "Parent"
      : c.role === "Teacher" || c.role === "Student",
  );

  const sendMessage = () => {
    if (!input.trim() || !activeConv) return;
    setMessages((prev) => ({
      ...prev,
      [activeConv]: [
        ...(prev[activeConv] || []),
        {
          id: Date.now().toString(),
          text: input.trim(),
          sent: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    }));
    setInput("");
    setTimeout(
      () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  if (activeConv) {
    const c = CONVERSATIONS.find((x) => x.id === activeConv)!;
    const msgs = messages[activeConv] || [];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)",
          maxHeight: "calc(100dvh - 64px)",
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0B1020, #2A1F5C)",
            padding: "48px 16px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveConv(null)}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 10,
              width: 36,
              height: 36,
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </button>
          <div
            style={{
              width: 40,
              height: 40,
              background: "#7C3AED",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>
              {c.avatar}
            </span>
          </div>
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: 15 }}>
              {c.name}
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
              {c.role} · Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: "#F8FAFC",
          }}
        >
          {msgs.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: m.sent ? "flex-end" : "flex-start",
              }}
            >
              <div>
                <div
                  className={m.sent ? "chat-bubble-sent" : "chat-bubble-recv"}
                >
                  {m.text}
                </div>
                <p
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    textAlign: m.sent ? "right" : "left",
                    marginTop: 3,
                  }}
                >
                  {m.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "12px 16px",
            background: "white",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input
            className="input-field"
            style={{ flex: 1, padding: "10px 14px" }}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            type="button"
            onClick={sendMessage}
            style={{
              width: 40,
              height: 40,
              background: "#7C3AED",
              border: "none",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Send size={18} color="white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, #0B1020, #2A1F5C)",
          padding: "48px 20px 20px",
        }}
      >
        <h2 style={{ color: "white", fontSize: 22, fontWeight: 800 }}>
          Messages
        </h2>
        <p
          style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}
        >
          Chat with teachers and students
        </p>
      </div>
      {/* Search */}
      <div
        style={{
          padding: "12px 16px",
          background: "white",
          borderBottom: "1px solid #F1F5F9",
        }}
      >
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            color="#94A3B8"
            style={{ position: "absolute", left: 12, top: 11 }}
          />
          <input
            className="input-field"
            placeholder="Search conversations..."
            style={{ paddingLeft: 36, padding: "10px 12px 10px 36px" }}
          />
        </div>
      </div>
      {/* Conversation List */}
      <div style={{ background: "white" }}>
        {conv.map((c, i) => (
          <button
            type="button"
            key={c.id}
            onClick={() => setActiveConv(c.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px",
              width: "100%",
              border: "none",
              background: "none",
              cursor: "pointer",
              borderBottom: i < conv.length - 1 ? "1px solid #F8FAFC" : "none",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                background: "#7C3AED",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>
                {c.avatar}
              </span>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  background: "#10B981",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}
                >
                  {c.name}
                </span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>{c.time}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "#64748B",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 200,
                  }}
                >
                  {c.lastMsg}
                </span>
                {c.unread > 0 && (
                  <span
                    style={{
                      minWidth: 18,
                      height: 18,
                      background: "#7C3AED",
                      borderRadius: 20,
                      color: "white",
                      fontSize: 11,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 4px",
                    }}
                  >
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Materials Screen ─────────────────────────────────────────────────────────
function MaterialsScreen({
  user: _user,
  darkMode: _darkMode,
}: { user: DemoUser; darkMode: boolean }) {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const subjects = ["All", "Mathematics", "Physics", "Chemistry", "English"];

  const filtered = MATERIALS.filter(
    (m) =>
      (subjectFilter === "All" || m.subject === subjectFilter) &&
      m.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, #0B1020, #2A1F5C)",
          padding: "48px 20px 20px",
        }}
      >
        <h2 style={{ color: "white", fontSize: 22, fontWeight: 800 }}>
          Study Materials
        </h2>
        <p
          style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}
        >
          Access all uploaded resources
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          padding: "12px 16px",
          background: "white",
          borderBottom: "1px solid #F1F5F9",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ position: "relative", marginBottom: 10 }}>
          <Search
            size={16}
            color="#94A3B8"
            style={{ position: "absolute", left: 12, top: 11 }}
          />
          <input
            className="input-field"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36, padding: "10px 12px 10px 36px" }}
          />
        </div>
        {/* Subject chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {subjects.map((s) => (
            <button
              type="button"
              key={s}
              className="subject-chip"
              onClick={() => setSubjectFilter(s)}
              style={{
                background: subjectFilter === s ? "#7C3AED" : "#F1F5F9",
                color: subjectFilter === s ? "white" : "#64748B",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Materials list */}
      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
            <BookOpen
              size={40}
              style={{ margin: "0 auto 8px", opacity: 0.3 }}
            />
            <p>No materials found</p>
          </div>
        ) : (
          filtered.map((m) => <MaterialCard key={m.id} material={m} large />)
        )}
      </div>
    </div>
  );
}

function MaterialCard({
  material: m,
  large,
}: { material: (typeof MATERIALS)[0]; large?: boolean }) {
  const icons = {
    pdf: <FileText size={20} color="#EF4444" />,
    link: <Link size={20} color="#0EA5E9" />,
    note: <StickyNote size={20} color="#F59E0B" />,
  };
  const colors = { pdf: "#FEE2E2", link: "#E0F2FE", note: "#FEF3C7" };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: large ? "12px 0" : "8px 0",
        borderBottom: "1px solid #F8FAFC",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          background: colors[m.type as keyof typeof colors],
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icons[m.type as keyof typeof icons]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#1E293B",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {m.title}
        </p>
        <p style={{ fontSize: 11, color: "#94A3B8" }}>
          {m.subject} · {m.date}
        </p>
        {large && (
          <p style={{ fontSize: 11, color: "#94A3B8" }}>by {m.uploadedBy}</p>
        )}
      </div>
      <button
        type="button"
        style={{
          background: "#7C3AED15",
          border: "none",
          borderRadius: 8,
          padding: "6px 10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Download size={14} color="#7C3AED" />
      </button>
    </div>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen({
  user,
  onLogout,
  darkMode,
  setDarkMode,
}: {
  user: DemoUser;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  const [notifications, setNotifications] = useState(true);
  const [showReport, setShowReport] = useState(false);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0B1020, #2A1F5C, #5B36A8)",
          padding: "48px 20px 32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            backdropFilter: "blur(10px)",
          }}
        >
          <span style={{ color: "white", fontWeight: 900, fontSize: 28 }}>
            {getInitials(user.name)}
          </span>
        </div>
        <h2 style={{ color: "white", fontWeight: 800, fontSize: 20 }}>
          {user.name}
        </h2>
        <p
          style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}
        >
          {user.email}
        </p>
        <span
          className="badge"
          style={{
            background: ROLE_COLORS[user.role],
            color: "white",
            marginTop: 8,
            display: "inline-block",
          }}
        >
          {ROLE_LABELS[user.role]}
        </span>
      </div>

      <div
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Info Card */}
        <div className="card">
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#64748B",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Profile Info
          </h3>
          {[
            { label: "Name", value: user.name },
            { label: "Email", value: user.email },
            { label: "Phone", value: user.phone || "+91 99999 99999" },
            { label: "Role", value: ROLE_LABELS[user.role] },
            ...(user.grade ? [{ label: "Grade", value: user.grade }] : []),
            ...(user.subjects
              ? [{ label: "Subjects", value: user.subjects.join(", ") }]
              : []),
          ].map((item, i, arr) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
              }}
            >
              <span style={{ fontSize: 13, color: "#64748B" }}>
                {item.label}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="card">
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#64748B",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Settings
          </h3>
          {[
            {
              label: "Dark Mode",
              icon: darkMode ? Moon : Sun,
              action: () => setDarkMode(!darkMode),
              toggle: darkMode,
            },
            {
              label: "Notifications",
              icon: Bell,
              action: () => setNotifications(!notifications),
              toggle: notifications,
            },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: i < 1 ? "1px solid #F1F5F9" : "none",
              }}
            >
              <s.icon size={18} color="#64748B" style={{ marginRight: 10 }} />
              <span style={{ flex: 1, fontSize: 14, color: "#1E293B" }}>
                {s.label}
              </span>
              <button
                type="button"
                onClick={s.action}
                style={{
                  width: 44,
                  height: 24,
                  background: s.toggle ? "#7C3AED" : "#E2E8F0",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    background: "white",
                    borderRadius: 9,
                    position: "absolute",
                    top: 3,
                    left: s.toggle ? 22 : 3,
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="card">
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#64748B",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Actions
          </h3>
          {[
            { label: "Edit Profile", icon: Edit3, color: "#7C3AED" },
            ...(user.role === "teacher" || user.role === "admin"
              ? [
                  {
                    label: "Download Report",
                    icon: Download,
                    color: "#0EA5E9",
                    onClick: () => setShowReport(true),
                  },
                ]
              : []),
            {
              label: "Academic Report",
              icon: BarChart3,
              color: "#10B981",
              onClick: () => setShowReport(true),
            },
            { label: "About AMS", icon: Star, color: "#F59E0B" },
          ].map((a, i, arr) => (
            <button
              type="button"
              key={a.label}
              onClick={(a as { onClick?: () => void }).onClick}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 0",
                width: "100%",
                border: "none",
                background: "none",
                cursor: "pointer",
                borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: a.color + "15",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <a.icon size={18} color={a.color} />
              </div>
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1E293B",
                  textAlign: "left",
                }}
              >
                {a.label}
              </span>
              <ChevronRight size={16} color="#94A3B8" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px",
            background: "#FEE2E2",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            width: "100%",
          }}
        >
          <LogOut size={18} color="#EF4444" />
          <span style={{ fontSize: 15, fontWeight: 700, color: "#EF4444" }}>
            Sign Out
          </span>
        </button>
      </div>

      {showReport && (
        <ReportModal onClose={() => setShowReport(false)} user={user} />
      )}
    </div>
  );
}

// ─── Report Modal ─────────────────────────────────────────────────────────────
function ReportModal({
  onClose,
  user: _user,
}: { onClose: () => void; user: DemoUser }) {
  return (
    <div
      className="overlay"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 24 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>Academic Report</h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#F1F5F9",
              border: "none",
              borderRadius: 8,
              padding: 8,
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 14 }}>
            <p
              style={{
                fontSize: 12,
                color: "#64748B",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Student
            </p>
            <p style={{ fontWeight: 700, color: "#1E293B" }}>Alex Kumar</p>
            <p style={{ fontSize: 13, color: "#64748B" }}>
              Grade 10-A · Semester: 2024-25
            </p>
          </div>
          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 14 }}>
            <p
              style={{
                fontSize: 12,
                color: "#64748B",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Attendance
            </p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13 }}>
                Overall: <strong>82%</strong>
              </span>
              <span style={{ fontSize: 13 }}>
                Present: <strong>20/24</strong>
              </span>
            </div>
          </div>
          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 14 }}>
            <p
              style={{
                fontSize: 12,
                color: "#64748B",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Assignments
            </p>
            <p style={{ fontSize: 13 }}>
              Submitted: <strong>3/4</strong>
            </p>
          </div>
          {SUBJECT_ATTENDANCE.map((s) => (
            <div
              key={s.subject}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 14px",
                background: "#F8FAFC",
                borderRadius: 10,
              }}
            >
              <span style={{ fontSize: 13 }}>{s.subject}</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: s.percentage < 75 ? "#EF4444" : "#7C3AED",
                }}
              >
                {s.percentage}%
              </span>
            </div>
          ))}
          <button
            type="button"
            className="btn-primary"
            onClick={() => window.print()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Download size={18} /> Download / Print Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Chatbot Modal ────────────────────────────────────────────────────────────
function ChatbotModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your Academic Assistant 🎓 Ask me about attendance, assignments, schedule, or materials!",
      bot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { text: input.trim(), bot: false };
    const botMsg = { text: getBotResponse(input), bot: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg]);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 600);
  };

  return (
    <div
      className="overlay"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{ height: "70vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0B1020, #2A1F5C)",
            padding: "20px 20px 16px",
            borderRadius: "24px 24px 0 0",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #2DD4BF, #7C3AED)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bot size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "white", fontWeight: 700 }}>
              Academic Assistant
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
              AI-powered help
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 8,
              padding: 8,
              cursor: "pointer",
            }}
          >
            <X size={16} color="white" />
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.bot ? "flex-start" : "flex-end",
              }}
            >
              <div
                className={m.bot ? "chat-bubble-recv" : "chat-bubble-sent"}
                style={{ maxWidth: "85%" }}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        <div
          style={{
            padding: "0 12px 8px",
            display: "flex",
            gap: 6,
            overflowX: "auto",
          }}
        >
          {["Attendance?", "Assignments?", "Today's schedule?"].map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => {
                setInput(s);
              }}
              style={{
                background: "#7C3AED15",
                border: "1px solid #7C3AED30",
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 12,
                color: "#7C3AED",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "10px 16px 20px",
            display: "flex",
            gap: 8,
            borderTop: "1px solid #F1F5F9",
          }}
        >
          <input
            className="input-field"
            style={{ flex: 1, padding: "10px 14px" }}
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            type="button"
            onClick={send}
            style={{
              width: 40,
              height: 40,
              background: "#7C3AED",
              border: "none",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Send size={16} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
