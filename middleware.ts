import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


const isInstructorRoute = createRouteMatcher(['/instructor(.*)'])
const isTrainerRoute = createRouteMatcher(['/trainer(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
// const isCoordinatorRoute = createRouteMatcher(['/coordinator(.*)'])
const isCampCoordinatorRoute = createRouteMatcher(['/campCoordinator(.*)'])

export default clerkMiddleware(async (auth, req) => {

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

  if(isCampCoordinatorRoute(req)){
    await auth.protect((has) => {
      return has({role: 'campCoordinator'})
    })
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