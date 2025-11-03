import { redirect } from "next/navigation"

export default function LoginPage() {
  // Redirect /login to the consolidated sign-in page which now contains the role dropdown
  redirect('/sign-in')
}
