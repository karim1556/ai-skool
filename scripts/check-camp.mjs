import dotenv from 'dotenv'
dotenv.config()
import { supabase, hasSupabase } from '../lib/supabase.js'

async function run() {
  if (!hasSupabase || !supabase) {
    console.error('Supabase not configured in env.');
    process.exit(2)
  }
  const id = 5
  try {
    const { data, error } = await supabase.from('camps').select('*').eq('id', id)
    if (error) {
      console.error('Supabase error:', error)
      process.exit(1)
    }
    console.log('rows:', data)
  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(1)
  }
}
run()
