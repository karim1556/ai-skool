// app/page.jsx
'use client';
import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, Award, ChevronRight, CheckCircle, LayoutDashboard, User, Book, BarChart, MessageSquare, Settings, Mail, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('admin');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Modern Gradient Header */}
      <header className="fixed w-full z-50 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-lg">
              <BookOpen className="h-7 w-7 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">Aiskool</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-white/90">
            <Link href="#" className="hover:text-white transition">Home</Link>
            <Link href="#" className="hover:text-white transition">Features</Link>
            <Link href="#" className="hover:text-white transition">Overview</Link>
            <Link href="#" className="hover:text-white transition">Demo</Link>
            <Link href="#" className="hover:text-white transition">Contact</Link>
          </nav>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link href="/login">View Demo</Link>
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-blue-50" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Transform Learning with <span className="text-blue-600">Aiskool</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl">
                A comprehensive Learning Management System designed for schools, camps, and workshops. Manage courses, track progress, and deliver exceptional educational experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href="/login">View Demo Dashboards</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-8 flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <div className="flex gap-4 mb-6">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <LayoutDashboard className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Book className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <BarChart className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Course Progress</span>
                      <span className="text-blue-600 font-bold">65%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <div className="text-sm text-indigo-600 mb-1">Live Sessions</div>
                      <div className="text-xl font-bold">12</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <div className="text-sm text-indigo-600 mb-1">Assignments</div>
                      <div className="text-xl font-bold">8</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-400 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Learning</h2>
            <p className="text-xl text-slate-600">
              Everything you need to create, manage, and deliver exceptional educational experiences.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:border-blue-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users className="h-7 w-7 text-blue-600 group-hover:text-white" />
                </div>
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription className="mt-2">
                  Separate dashboards for admins, trainers, coordinators, and students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="text-blue-600 p-0 group-hover:underline">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:border-green-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Calendar className="h-7 w-7 text-green-600 group-hover:text-white" />
                </div>
                <CardTitle>Session Management</CardTitle>
                <CardDescription className="mt-2">
                  Live sessions with unique codes, attendance tracking, and real-time participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="text-green-600 p-0 group-hover:underline">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:border-purple-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <BookOpen className="h-7 w-7 text-purple-600 group-hover:text-white" />
                </div>
                <CardTitle>Course Management</CardTitle>
                <CardDescription className="mt-2">
                  Create and manage courses, batches, assignments, and quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="text-purple-600 p-0 group-hover:underline">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:border-orange-500 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Award className="h-7 w-7 text-orange-600 group-hover:text-white" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription className="mt-2">
                  Comprehensive analytics and reporting for student progress and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="text-orange-600 p-0 group-hover:underline">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Aiskool Works</h2>
            <p className="text-xl text-slate-600">
              Our streamlined system makes learning management simple and effective
            </p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <div className="text-blue-600 bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">User Registration</h3>
                <p className="text-slate-600 mb-4">
                  Students and instructors register through our simple onboarding process
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Role-based registration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Admin approval workflow</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Profile customization</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <div className="text-green-600 bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Course Enrollment</h3>
                <p className="text-slate-600 mb-4">
                  Browse and enroll in courses with a single click
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Course catalog browsing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Batch scheduling</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Automated enrollment</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <div className="text-purple-600 bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Learning Experience</h3>
                <p className="text-slate-600 mb-4">
                  Engage with interactive content and live sessions
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Live video sessions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Interactive assignments</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Real-time feedback</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Dashboards</h2>
            <p className="text-xl text-slate-600">
              Experience the power of Aiskool through our interactive demos
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-1 mb-8 max-w-3xl mx-auto">
            <div className="flex justify-between">
              <Button 
                variant={activeTab === 'admin' ? 'default' : 'ghost'} 
                className={`${activeTab === 'admin' ? 'bg-white shadow' : 'text-slate-600 hover:bg-white/50'} flex-1 py-6`}
                onClick={() => setActiveTab('admin')}
              >
                Admin
              </Button>
              <Button 
                variant={activeTab === 'trainer' ? 'default' : 'ghost'} 
                className={`${activeTab === 'trainer' ? 'bg-white shadow' : 'text-slate-600 hover:bg-white/50'} flex-1 py-6`}
                onClick={() => setActiveTab('trainer')}
              >
                Trainer
              </Button>
              <Button 
                variant={activeTab === 'student' ? 'default' : 'ghost'} 
                className={`${activeTab === 'student' ? 'bg-white shadow' : 'text-slate-600 hover:bg-white/50'} flex-1 py-6`}
                onClick={() => setActiveTab('student')}
              >
                Student
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    {activeTab === 'admin' && 'Admin Dashboard'}
                    {activeTab === 'trainer' && 'Trainer Dashboard'}
                    {activeTab === 'student' && 'Student Dashboard'}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {activeTab === 'admin' && 'Manage your entire learning institution with powerful admin tools. Monitor system performance, manage users, and oversee all courses.'}
                    {activeTab === 'trainer' && 'Create engaging courses, manage live sessions, track student progress, and deliver exceptional learning experiences.'}
                    {activeTab === 'student' && 'Access your courses, join live sessions, submit assignments, and track your learning progress in one intuitive dashboard.'}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {activeTab === 'admin' && (
                      <>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> User management and role assignment</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Course and batch oversight</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> System analytics and reporting</li>
                      </>
                    )}
                    {activeTab === 'trainer' && (
                      <>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Session scheduling and management</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Attendance tracking</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Assignment creation and grading</li>
                      </>
                    )}
                    {activeTab === 'student' && (
                      <>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Course enrollment and access</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Live session participation</li>
                        <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Progress tracking and analytics</li>
                      </>
                    )}
                  </ul>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Try {activeTab} Dashboard
                  </Button>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-8 rounded-t-lg flex items-center px-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-b-lg">
                    <div className="flex gap-4 mb-4">
                      <div className={`p-2 rounded-lg ${activeTab === 'admin' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className={`p-2 rounded-lg ${activeTab === 'trainer' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className={`p-2 rounded-lg ${activeTab === 'student' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <BarChart className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">System Status</span>
                        <span className="text-green-600 text-sm font-bold">Active</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="text-xs text-blue-600 mb-1">Active Users</div>
                        <div className="text-lg font-bold">1,248</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="text-xs text-blue-600 mb-1">Live Sessions</div>
                        <div className="text-lg font-bold">42</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Join thousands of institutions already using Aiskool to enhance their educational programs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">Aiskool</h3>
              </div>
              <p className="mb-6 max-w-md">
                The comprehensive learning management system designed for modern educational institutions, training centers, and workshops.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-slate-400 hover:text-white transition"><Twitter className="h-5 w-5" /></Link>
                <Link href="#" className="text-slate-400 hover:text-white transition"><Facebook className="h-5 w-5" /></Link>
                <Link href="#" className="text-slate-400 hover:text-white transition"><Instagram className="h-5 w-5" /></Link>
                <Link href="#" className="text-slate-400 hover:text-white transition"><Linkedin className="h-5 w-5" /></Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition">Solutions</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition">Tutorials</Link></li>
                <li><Link href="#" className="hover:text-white transition">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition">Partners</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center">
            <p>&copy; 2024 Aiskool LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}