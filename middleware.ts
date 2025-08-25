import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'


const isInstructorRoute = createRouteMatcher(['/instructor(.*)'])
const isTrainerRoute = createRouteMatcher(['/trainer(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
<<<<<<< HEAD
const isCampCoordinatorRoute = createRouteMatcher(['/campCoordinator(.*)'])
=======
const isCoordinatorRoute = createRouteMatcher(['/coordinator(.*)'])
const isStudentRoute = createRouteMatcher(['/student(.*)'])
const isCampCoordinatorRoute = createRouteMatcher(['/camp-coordinator(.*)'])
>>>>>>> f19ddb63bf9239caf09c7b7f2ce9ce5eefbd7cd2

export default clerkMiddleware(async (auth, req) => {
  // Debug trace for routing in development
  if (process.env.NODE_ENV !== 'production') {
    const p = req.nextUrl.pathname
    const flags = {
      admin: isAdminRoute(req),
      instructor: isInstructorRoute(req),
      trainer: isTrainerRoute(req),
      coordinator: isCoordinatorRoute(req),
      student: isStudentRoute(req),
      campCoordinator: isCampCoordinatorRoute(req),
    }
    console.log('[middleware]', p, flags)
  }

  if(isAdminRoute(req)){
    await auth.protect((has) => {
      return has({role: 'admin'})
    })
  } 

  if(isInstructorRoute(req)){
    await auth.protect((has) => {
      return has({role: 'instructor'})
    })
  }

  if(isTrainerRoute(req)){
    await auth.protect((has) => {
      return has({role: 'trainer'})
    })
  }

  if (isCoordinatorRoute(req)) {
    await auth.protect((has) => (
      has({ role: 'coordinator' }) ||
      has({ role: 'school_coordinator' }) ||
      has({ role: 'schoolCoordinator' }) ||
      has({ role: 'school-coordinator' }) ||
      has({ role: 'schoolcoordinator' })
    ))
  }

  if(isStudentRoute(req)){
    await auth.protect((has) => {
      return has({role: 'student'})
    })
  }

  if (isCampCoordinatorRoute(req)) {
    await auth.protect((has) => (
      has({ role: 'campCoordinator' }) ||
      has({ role: 'camp_coordinator' }) ||
      has({ role: 'camp-coordinator' }) ||
      has({ role: 'campcoordinator' })
    ))
  }

  // For org-scoped sections, ensure an active organization is selected
  if (isCoordinatorRoute(req) || isTrainerRoute(req) || isStudentRoute(req) || isCampCoordinatorRoute(req)) {
    const { orgId } = await auth()
    if (!orgId) {
      // No active organization
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
  }

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}