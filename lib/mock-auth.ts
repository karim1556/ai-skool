export interface MockUser {
  id: string
  name: string
  email: string
  role: string
  is_approved: boolean
}

export function getCurrentMockUser(): MockUser | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("demo-user")
  if (!userData) return null

  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export function signOutMock() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("demo-user")
  }
}

// Mock data for dashboards
export const mockData = {
  courses: [
    {
      id: "1",
      title: "Web Development Fundamentals",
      description: "Learn HTML, CSS, and JavaScript basics",
      duration_hours: 40,
      created_at: "2024-01-01",
    },
    {
      id: "2",
      title: "Data Science with Python",
      description: "Introduction to data analysis and machine learning",
      duration_hours: 60,
      created_at: "2024-01-02",
    },
    {
      id: "3",
      title: "Digital Marketing Essentials",
      description: "Master digital marketing strategies and tools",
      duration_hours: 30,
      created_at: "2024-01-03",
    },
  ],
  batches: [
    {
      id: "1",
      name: "Web Dev Batch 2024-A",
      status: "active",
      course: { title: "Web Development Fundamentals" },
      trainer: { full_name: "John Smith" },
      max_students: 25,
      enrolled_count: 18,
    },
    {
      id: "2",
      name: "Data Science Batch 2024-A",
      status: "pending",
      course: { title: "Data Science with Python" },
      trainer: { full_name: "Sarah Johnson" },
      max_students: 20,
      enrolled_count: 12,
    },
    {
      id: "3",
      name: "Digital Marketing Batch 2024-A",
      status: "approved",
      course: { title: "Digital Marketing Essentials" },
      trainer: { full_name: "John Smith" },
      max_students: 30,
      enrolled_count: 22,
    },
  ],
  sessions: [
    {
      id: "1",
      title: "HTML Fundamentals",
      status: "completed",
      batch: { name: "Web Dev Batch 2024-A" },
      session_code: "ABC123XY",
      scheduled_date: "2024-01-16T10:00:00Z",
    },
    {
      id: "2",
      title: "CSS Styling",
      status: "scheduled",
      batch: { name: "Web Dev Batch 2024-A" },
      session_code: "DEF456ZW",
      scheduled_date: "2024-01-18T10:00:00Z",
    },
    {
      id: "3",
      title: "JavaScript Basics",
      status: "scheduled",
      batch: { name: "Web Dev Batch 2024-A" },
      session_code: "GHI789UV",
      scheduled_date: "2024-01-20T10:00:00Z",
    },
  ],
  pendingUsers: [
    {
      id: "1",
      full_name: "Alice Cooper",
      email: "alice@example.com",
      role: "student",
      is_approved: false,
    },
    {
      id: "2",
      full_name: "Bob Wilson",
      email: "bob@example.com",
      role: "trainer",
      is_approved: false,
    },
  ],
  stats: {
    totalUsers: 156,
    pendingApprovals: 8,
    activeBatches: 12,
    totalCourses: 25,
  },
}
