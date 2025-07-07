import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const demoUsers = [
  {
    email: "admin@eduflow.com",
    password: "admin123",
    user_metadata: {
      full_name: "System Administrator",
      role: "admin",
    },
  },
  {
    email: "trainer@eduflow.com",
    password: "trainer123",
    user_metadata: {
      full_name: "John Smith",
      role: "trainer",
    },
  },
  {
    email: "instructor@eduflow.com",
    password: "instructor123",
    user_metadata: {
      full_name: "Sarah Johnson",
      role: "instructor",
    },
  },
  {
    email: "student@eduflow.com",
    password: "student123",
    user_metadata: {
      full_name: "Mike Davis",
      role: "student",
    },
  },
  {
    email: "coordinator@eduflow.com",
    password: "coordinator123",
    user_metadata: {
      full_name: "Emily Wilson",
      role: "school_coordinator",
    },
  },
  {
    email: "camp@eduflow.com",
    password: "camp123",
    user_metadata: {
      full_name: "David Brown",
      role: "camp_coordinator",
    },
  },
]

function getOrganization(role: string) {
  const orgs: Record<string, string> = {
    admin: "EduFlow LMS",
    trainer: "Tech Training Institute",
    instructor: "Digital Learning Academy",
    student: "State University",
    school_coordinator: "Springfield School District",
    camp_coordinator: "Summer Tech Camp",
  }
  return orgs[role] || "EduFlow LMS"
}

function getState(role: string) {
  const states: Record<string, string> = {
    admin: "California",
    trainer: "California",
    instructor: "New York",
    student: "Texas",
    school_coordinator: "Illinois",
    camp_coordinator: "Florida",
  }
  return states[role] || "California"
}

function getDistrict(role: string) {
  const districts: Record<string, string> = {
    admin: "San Francisco",
    trainer: "Los Angeles",
    instructor: "Manhattan",
    student: "Austin",
    school_coordinator: "Springfield",
    camp_coordinator: "Miami",
  }
  return districts[role] || "San Francisco"
}

function getSchoolName(role: string) {
  const schools: Record<string, string> = {
    student: "Austin High School",
    school_coordinator: "Springfield Elementary",
    camp_coordinator: "Summer Tech Camp",
  }
  return schools[role] || ""
}

export async function POST() {
  try {
    const results = []

    for (const userData of demoUsers) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase.auth.admin.getUserByEmail(userData.email)

        if (existingUser.user) {
          results.push({ email: userData.email, status: "already_exists" })
          continue
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          user_metadata: userData.user_metadata,
          email_confirm: true,
        })

        if (authError) {
          results.push({ email: userData.email, status: "auth_error", error: authError.message })
          continue
        }

        // Create corresponding profile
        const profileData = {
          id: authData.user.id,
          email: userData.email,
          full_name: userData.user_metadata.full_name,
          phone: `+123456789${Math.floor(Math.random() * 10)}`,
          role: userData.user_metadata.role,
          organization: getOrganization(userData.user_metadata.role),
          state: getState(userData.user_metadata.role),
          district: getDistrict(userData.user_metadata.role),
          school_name: getSchoolName(userData.user_metadata.role),
          is_approved: true,
        }

        const { error: profileError } = await supabase.from("profiles").upsert(profileData)

        if (profileError) {
          results.push({ email: userData.email, status: "profile_error", error: profileError.message })
        } else {
          results.push({ email: userData.email, status: "success" })
        }
      } catch (error: any) {
        results.push({ email: userData.email, status: "error", error: error.message })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
