import dotenv from 'dotenv'
dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('SUPABASE_URL or KEY not set in environment')
  process.exit(2)
}

const id = 5
const url = `${SUPABASE_URL}/rest/v1/camps?id=eq.${id}&select=*`

async function run() {
  try {
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json'
      }
    })
    const text = await res.text()
    console.log('status', res.status)
    console.log('body:', text)
  } catch (err) {
    console.error('Fetch error', err)
  }
}

run()
