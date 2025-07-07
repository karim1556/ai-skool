import { createClient } from "@supabase/supabase-js"

// You'll need to use your service role key for this script
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // This is the service role key, not anon key

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

async function createDemoUsers() {
  console.log("Creating demo users...")

  for (const userData of demoUsers) {
    try {
      console.log(`Creating user: ${userData.email}`)

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: userData.user_metadata,
        email_confirm: true, // Auto-confirm email
      })

      if (authError) {
        console.error(`Error creating auth user ${userData.email}:`, authError)
        continue
      }

      console.log(`✅ Created auth user: ${userData.email}`)

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
        console.error(`Error creating profile for ${userData.email}:`, profileError)
      } else {
        console.log(`✅ Created profile: ${userData.email}`)
      }
    } catch (error) {
      console.error(`Unexpected error for ${userData.email}:`, error)
    }
  }

  console.log("Demo users creation completed!")
}

function getOrganization(role) {
  const orgs = {
    admin: "EduFlow LMS",
    trainer: "Tech Training Institute",
    instructor: "Digital Learning Academy",
    student: "State University",
    school_coordinator: "Springfield School District",
    camp_coordinator: "Summer Tech Camp",
  }
  return orgs[role] || "EduFlow LMS"
}

function getState(role) {
  const states = {
    admin: "California",
    trainer: "California",
    instructor: "New York",
    student: "Texas",
    school_coordinator: "Illinois",
    camp_coordinator: "Florida",
  }
  return states[role] || "California"
}

function getDistrict(role) {
  const districts = {
    admin: "San Francisco",
    trainer: "Los Angeles",
    instructor: "Manhattan",
    student: "Austin",
    school_coordinator: "Springfield",
    camp_coordinator: "Miami",
  }
  return districts[role] || "San Francisco"
}

function getSchoolName(role) {
  const schools = {
    student: "Austin High School",
    school_coordinator: "Springfield Elementary",
    camp_coordinator: "Summer Tech Camp",
  }
  return schools[role] || null
}

// Run the script
createDemoUsers().catch(console.error)
