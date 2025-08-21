import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isPublicroute = createRouteMatcher(['/','/sign-in(.*)', '/sign-up(.*)','/api/webhook/register'])
// const isAdminRoute = createRouteMatcher(['/admin(.*)'])
// const isSchoolAdminRoute = createRouteMatcher(['/school/admin(.*)'])
// const isInstructorRoute = createRouteMatcher(['/instructor(.*)'])
// const isTrainerRoute = createRouteMatcher(['/trainer(.*)'])


export default clerkMiddleware(async (auth, req) => {
//   if(!isPublicroute(req)){
//     await auth.protect()
//   }

//   if(isAdminRoute(req)){
//     await auth.protect((has) => {
//       return has({})
//     })
//   }

//   if(isSchoolAdminRoute(req)){
//     await auth.protect((has) => {
//       return has({})
//     })
//   }

//   if(isInstructorRoute(req)){
//     await auth.protect((has) => {
//       return has({ permission: 'instuctor:access'})
//     })
//   }

//   if(isTrainerRoute(req)){
//     await auth.protect((has) => {
//       return has({ permission: 'access_trainer_route:access_route'})
//     })
//   }

 
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}