// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { useSignIn } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Eye, EyeOff } from "lucide-react";

// export default function SignIn() {
//   const { isLoaded, signIn, setActive } = useSignIn();
//   const [emailAddress, setEmailAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   if (!isLoaded) {
//     return null;
//   }

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!isLoaded) {
//       return;
//     }

//     try {
//       const result = await signIn.create({
//         identifier: emailAddress,
//         password,
//       });

//       if (result.status === "complete") {
//         await setActive({ session: result.createdSessionId });
//         router.push("/dashboard");
//       } else {
//         console.error(JSON.stringify(result, null, 2));
//       }
//     } catch (err: any) {
//       console.error("error", err.errors[0].message);
//       setError(err.errors[0].message);
//     }
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-background">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">
//             Sign In to AISKOOL
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={submit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 type="email"
//                 id="email"
//                 value={emailAddress}
//                 onChange={(e) => setEmailAddress(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-2 top-1/2 -translate-y-1/2"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-gray-500" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-gray-500" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
//             <Button type="submit" className="w-full">
//               Sign In
//             </Button>
//           </form>
//         </CardContent>
//         <CardFooter className="justify-center">
//           <p className="text-sm text-muted-foreground">
//             Don&apos;t have an account?{" "}
//             <Link
//               href="/sign-up"
//               className="font-medium text-primary hover:underline"
//             >
//               Sign up
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, Sparkles, BookOpen, Brain, Zap } from "lucide-react";
const demoRoles = [
  { id: "admin", name: "Admin" },
  { id: "trainer", name: "Trainer" },
  { id: "instructor", name: "Instructor" },
  { id: "student", name: "Student" },
  { id: "school_coordinator", name: "School Coordinator" },
  { id: "camp_coordinator", name: "Camp Coordinator" },
];

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("student");
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
          // For demo mode: store a demo-user object so role-aware UI can use it
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "demo-user",
                JSON.stringify({
                  id: emailAddress,
                  name: emailAddress.split("@")[0] || emailAddress,
                  email: emailAddress,
                  role: selectedRole,
                  is_approved: true,
                })
              );
            }
          } catch (e) {
            // ignore storage errors
          }

          router.push("/dashboard");
      } else {
        console.error(JSON.stringify(result, null, 2));
      }
    } catch (err: any) {
      console.error("error", err.errors[0].message);
      setError(err.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AISKOOL
                </h1>
                <p className="text-gray-600 text-sm font-medium">Learn Smarter, Not Harder</p>
              </div>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Features */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                  Welcome Back to{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Your Learning Journey
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Continue your path to mastering AI and technology with personalized learning experiences.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Sparkles,
                    title: "Personalized Learning",
                    description: "AI-powered recommendations tailored to your progress"
                  },
                  {
                    icon: BookOpen,
                    title: "Expert Courses",
                    description: "Learn from industry professionals and AI experts"
                  },
                  {
                    icon: Zap,
                    title: "Hands-on Projects",
                    description: "Build real-world projects with guided mentorship"
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4 pb-8">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    Sign In
                  </CardTitle>
                  <p className="text-gray-600">
                    Enter your credentials to access your account
                  </p>
                </CardHeader>

                <CardContent>
                  <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="role" className="text-sm font-semibold text-gray-700">Role (demo)</Label>
                        <select
                          id="role"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 bg-white"
                        >
                          {demoRoles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type="email"
                            id="email"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            required
                            className="pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 rounded-xl"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-10 pr-12 py-3 border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 rounded-xl"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800 font-medium">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full py-3 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        "Sign In to Your Account"
                      )}
                    </Button>

                    <div className="text-center">
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </form>
                </CardContent>

                <CardFooter className="justify-center border-t border-gray-100 pt-6">
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Create account
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2024 AISKOOL. Empowering the next generation of AI innovators.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}