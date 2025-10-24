"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Clock,
  Calendar,
  Star,
  Zap,
  Brain,
  Cpu,
  Bot,
  Gamepad,
  Globe,
  Sparkles,
  Shield,
  Trophy,
  BookOpen,
  GraduationCap,
  MapPin,
  Briefcase,
  DollarSign,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building,
  Bookmark,
  Share2,
  Filter,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

type Internship = {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  duration: string;
  stipend: string;
  postedDate: string;
  applicationDeadline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  applications: number;
  featured: boolean;
  urgent: boolean;
};

export default function InternshipsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [expandedInternship, setExpandedInternship] = useState<string | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch internships data
  useEffect(() => {
    const loadInternships = async () => {
      try {
        const res = await fetch('/api/internships', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setInternships(data.internships || []);
        } else {
          setInternships(staticInternships);
        }
      } catch (error) {
        setInternships(staticInternships);
      } finally {
        setLoading(false);
      }
    };

    loadInternships();
  }, []);

  // Categories with icons
  const categories = [
    { id: "all", name: "All Roles", icon: Briefcase, color: "from-gray-500 to-gray-600" },
    { id: "development", name: "Development", icon: Cpu, color: "from-blue-500 to-cyan-500" },
    { id: "ai-ml", name: "AI & ML", icon: Brain, color: "from-purple-500 to-indigo-500" },
    { id: "robotics", name: "Robotics", icon: Bot, color: "from-green-500 to-emerald-500" },
    { id: "design", name: "Design", icon: Globe, color: "from-orange-500 to-amber-500" },
    { id: "data-science", name: "Data Science", icon: Zap, color: "from-red-500 to-pink-500" }
  ];

  // Types with icons
  const types = [
    { id: "all", name: "All Types", icon: Briefcase, color: "from-gray-500 to-gray-600" },
    { id: "full-time", name: "Full Time", icon: Clock, color: "from-blue-500 to-blue-600" },
    { id: "part-time", name: "Part Time", icon: Users, color: "from-green-500 to-green-600" },
    { id: "remote", name: "Remote", icon: MapPin, color: "from-purple-500 to-purple-600" }
  ];

  // Filter internships
  const filteredInternships = internships.filter(internship => {
    const categoryMatch = activeCategory === "all" || internship.category === activeCategory;
    const typeMatch = activeType === "all" || internship.type === activeType;
    return categoryMatch && typeMatch;
  });

  const toggleExpand = (id: string) => {
    setExpandedInternship(expandedInternship === id ? null : id);
  };

  const clearFilters = () => {
    setActiveCategory("all");
    setActiveType("all");
  };

  const activeFiltersCount = (activeCategory !== "all" ? 1 : 0) + (activeType !== "all" ? 1 : 0);

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-lg text-gray-600">Loading internships...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 px-4 py-20 md:px-6 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>

        <div className="mx-auto max-w-7xl relative">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-10">
              <div className="space-y-6">
                <Badge className="bg-green-100 text-green-700 px-4 py-2 text-sm mb-4">
                  <Sparkles className="h-4 w-4 mr-1" />
                  HIRING NOW
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  Launch Your Career with{" "}
                  <span className="bg-gradient-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
                    Tech Internships
                  </span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed max-w-2xl tracking-tight">
                  Gain real-world experience, build your portfolio, and kickstart your career with our curated internship opportunities from top tech companies.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#internships">
                  <Button className="rounded-full bg-gradient-to-r from-sky-500 to-sky-600 px-10 py-4 text-lg font-bold text-white hover:from-sky-600 hover:to-sky-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
                    VIEW OPENINGS
                  </Button>
                </Link>
                <Link href="/internships/apply">
                  <Button variant="outline" className="rounded-full border-2 border-gray-300 px-10 py-4 text-lg font-semibold">
                    <Briefcase className="mr-2 h-5 w-5" />
                    APPLY NOW
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                {[
                  { number: "50+", label: "Open Positions" },
                  { number: "25+", label: "Partner Companies" },
                  { number: "₹15K-50K", label: "Monthly Stipend" },
                  { number: "Flexible", label: "Work Options" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-60 blur-xl"></div>
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-br from-sky-200 to-sky-300 opacity-60 blur-xl"></div>
              <div className="relative group">
                <Image
                  src="/images/internships-hero.jpg"
                  alt="Tech Internships Opportunities"
                  width={700}
                  height={500}
                  className="relative z-10 rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Why Intern With <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Top Companies?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our internship program is designed to give you the best start in your tech career
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Award,
                title: "Industry Experience",
                description: "Work on real projects with experienced mentors",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Networking",
                description: "Connect with professionals and build your network",
                gradient: "from-purple-500 to-indigo-500"
              },
              {
                icon: Briefcase,
                title: "Career Growth",
                description: "Potential for full-time offers after internship",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: DollarSign,
                title: "Competitive Stipend",
                description: "Get paid while you learn and gain experience",
                gradient: "from-orange-500 to-amber-500"
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="group border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
                  <CardContent className="space-y-6 p-0">
                    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${benefit.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium tracking-tight text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Internships Listings */}
      <section id="internships" className="px-4 py-20 md:px-6 md:py-28 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-sm mb-4">
              <Briefcase className="h-4 w-4 mr-1" />
              CURRENT OPENINGS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Available <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Internships</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect internship opportunity to kickstart your tech career
            </p>
          </div>

          {/* Simplified Filters */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {filteredInternships.length} Internship{filteredInternships.length !== 1 ? 's' : ''} Found
                </h3>
                
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden border-gray-300"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filter Cards - Always visible on desktop, toggle on mobile */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6`}>
              {/* Category Filter */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                  Job Category
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map(category => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                          activeCategory === category.id 
                            ? `border-blue-500 bg-gradient-to-br ${category.color} text-white shadow-lg scale-105`
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            activeCategory === category.id 
                              ? 'bg-white/20' 
                              : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              activeCategory === category.id ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <span className="font-medium text-sm">{category.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Type Filter */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-green-600 mr-2" />
                  Job Type
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {types.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setActiveType(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                          activeType === type.id 
                            ? `border-green-500 bg-gradient-to-br ${type.color} text-white shadow-lg scale-105`
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            activeType === type.id 
                              ? 'bg-white/20' 
                              : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              activeType === type.id ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <span className="font-medium text-sm">{type.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Internships Grid */}
          <div className="space-y-6">
            {filteredInternships.map((internship) => (
              <InternshipCard 
                key={internship.id}
                internship={internship}
                isExpanded={expandedInternship === internship.id}
                onToggle={() => toggleExpand(internship.id)}
              />
            ))}
          </div>

          {filteredInternships.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No internships found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or check back later for new opportunities.</p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-20 md:px-6 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>

        <div className="mx-auto max-w-4xl text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to Launch Your Career?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto tracking-tight">
            Join hundreds of students who have kickstarted their tech careers through our internship program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/internships/apply">
              <Button 
                size="lg"
                className="rounded-full bg-white text-sky-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-xl tracking-tight"
              >
                APPLY FOR INTERNSHIPS
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-sky-600 bg-transparent px-10 py-4 text-lg font-semibold transition-all duration-200 tracking-tight"
              >
                <Users className="mr-2 h-5 w-5" />
                GET GUIDANCE
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Internship Card Component
function InternshipCard({ internship, isExpanded, onToggle }: { 
  internship: Internship; 
  isExpanded: boolean; 
  onToggle: () => void; 
}) {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-2xl shadow-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              {internship.companyLogo ? (
                <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 p-2 flex items-center justify-center">
                  <Image 
                    src={internship.companyLogo} 
                    alt={internship.company}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Building className="h-8 w-8 text-white" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {internship.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {internship.featured && (
                      <Badge className="bg-amber-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        FEATURED
                      </Badge>
                    )}
                    {internship.urgent && (
                      <Badge className="bg-red-500 text-white">
                        URGENT
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span className="font-medium">{internship.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{internship.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{internship.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {internship.stipend}
              </div>
              <div className="text-sm text-gray-500">Monthly Stipend</div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Level</div>
              <div className="font-semibold text-gray-900 capitalize">{internship.level}</div>
            </div>
            <div>
              <div className="text-gray-500">Applications</div>
              <div className="font-semibold text-gray-900">{internship.applications}+ applied</div>
            </div>
            <div>
              <div className="text-gray-500">Deadline</div>
              <div className="font-semibold text-gray-900">{internship.applicationDeadline}</div>
            </div>
            <div>
              <div className="text-gray-500">Category</div>
              <div className="font-semibold text-gray-900 capitalize">{internship.category.replace('-', ' ')}</div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {internship.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="p-6 bg-gray-50 border-b border-gray-200 space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">About the Role</h4>
              <p className="text-gray-700 leading-relaxed">{internship.description}</p>
            </div>

            {/* Responsibilities */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h4>
              <ul className="space-y-2">
                {internship.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
              <ul className="space-y-2">
                {internship.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Benefits & Perks</h4>
              <ul className="space-y-2">
                {internship.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onToggle}
                variant="outline" 
                className="border-gray-300"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    View Details
                  </>
                )}
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <Link href={`/internships/apply/${internship.id}`}>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Static internships data (expanded with more opportunities)
const staticInternships: Internship[] = [
  {
    id: "1",
    title: "Frontend Development Intern",
    company: "TechInnovate Solutions",
    location: "Remote",
    type: "remote",
    duration: "3 months",
    stipend: "₹25,000/month",
    postedDate: "2024-01-15",
    applicationDeadline: "2024-02-15",
    description: "Join our dynamic frontend team to build cutting-edge web applications using modern technologies. You'll work on real projects that impact thousands of users.",
    responsibilities: [
      "Develop responsive web applications using React.js and Next.js",
      "Collaborate with UI/UX designers to implement pixel-perfect designs",
      "Optimize applications for maximum speed and scalability",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and team meetings"
    ],
    requirements: [
      "Proficiency in HTML, CSS, and JavaScript",
      "Experience with React.js or similar frameworks",
      "Understanding of responsive design principles",
      "Familiarity with Git version control",
      "Strong problem-solving skills and attention to detail"
    ],
    skills: ["React", "JavaScript", "HTML/CSS", "Git", "Responsive Design"],
    benefits: [
      "Mentorship from senior developers",
      "Flexible working hours",
      "Certificate of completion",
      "Potential full-time offer",
      "Learning stipend for courses"
    ],
    category: "development",
    level: "intermediate",
    applications: 45,
    featured: true,
    urgent: false
  },
  {
    id: "2",
    title: "AI/ML Research Intern",
    company: "NeuralPatterns AI",
    location: "Bangalore",
    type: "full-time",
    duration: "6 months",
    stipend: "₹35,000/month",
    postedDate: "2024-01-10",
    applicationDeadline: "2024-02-10",
    description: "Work on cutting-edge machine learning projects and contribute to research that pushes the boundaries of artificial intelligence.",
    responsibilities: [
      "Research and implement state-of-the-art ML algorithms",
      "Process and analyze large datasets",
      "Develop and train neural network models",
      "Collaborate with research team on publications",
      "Present findings to technical teams"
    ],
    requirements: [
      "Strong foundation in machine learning concepts",
      "Experience with Python and ML libraries (TensorFlow/PyTorch)",
      "Knowledge of data structures and algorithms",
      "Familiarity with data preprocessing techniques",
      "Currently pursuing or completed degree in CS/AI/related field"
    ],
    skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis", "Research"],
    benefits: [
      "Work on publishable research",
      "Access to high-performance computing resources",
      "Conference attendance opportunities",
      "Research mentorship",
      "Competitive stipend"
    ],
    category: "ai-ml",
    level: "advanced",
    applications: 32,
    featured: true,
    urgent: true
  },
  {
    id: "3",
    title: "Robotics Software Intern",
    company: "AutoBot Systems",
    location: "Pune",
    type: "full-time",
    duration: "4 months",
    stipend: "₹30,000/month",
    postedDate: "2024-01-20",
    applicationDeadline: "2024-02-20",
    description: "Develop software for autonomous robotic systems and contribute to the future of automation and robotics.",
    responsibilities: [
      "Develop ROS-based applications for robotic systems",
      "Implement computer vision algorithms",
      "Work on sensor integration and data processing",
      "Test and debug robotic software in simulation and real environments",
      "Document code and create technical reports"
    ],
    requirements: [
      "Experience with ROS (Robot Operating System)",
      "Proficiency in C++ or Python",
      "Understanding of robotics fundamentals",
      "Familiarity with Linux environment",
      "Knowledge of algorithms and data structures"
    ],
    skills: ["ROS", "C++", "Python", "Computer Vision", "Robotics"],
    benefits: [
      "Hands-on experience with real robots",
      "Mentorship from robotics engineers",
      "Lab access and equipment",
      "Project ownership",
      "Career development workshops"
    ],
    category: "robotics",
    level: "intermediate",
    applications: 28,
    featured: false,
    urgent: false
  },
  {
    id: "4",
    title: "Backend Development Intern",
    company: "CloudScale Technologies",
    location: "Hyderabad",
    type: "full-time",
    duration: "3 months",
    stipend: "₹28,000/month",
    postedDate: "2024-01-18",
    applicationDeadline: "2024-02-18",
    description: "Build scalable backend systems and APIs that power our enterprise applications serving millions of users worldwide.",
    responsibilities: [
      "Design and develop RESTful APIs and microservices",
      "Implement database schemas and optimize queries",
      "Work with cloud platforms (AWS/Azure/GCP)",
      "Write unit tests and integration tests",
      "Collaborate with frontend and DevOps teams"
    ],
    requirements: [
      "Knowledge of Node.js, Python, or Java",
      "Understanding of databases (SQL/NoSQL)",
      "Familiarity with API design principles",
      "Basic knowledge of cloud services",
      "Understanding of software development best practices"
    ],
    skills: ["Node.js", "MongoDB", "AWS", "REST APIs", "Docker"],
    benefits: [
      "Cloud certification sponsorship",
      "Mentorship from architects",
      "Real-world scalability challenges",
      "Flexible work arrangements",
      "Performance bonuses"
    ],
    category: "development",
    level: "intermediate",
    applications: 38,
    featured: true,
    urgent: false
  },
  {
    id: "5",
    title: "Data Science Intern",
    company: "DataInsights Pro",
    location: "Remote",
    type: "remote",
    duration: "4 months",
    stipend: "₹32,000/month",
    postedDate: "2024-01-12",
    applicationDeadline: "2024-02-12",
    description: "Transform raw data into actionable insights and build predictive models that drive business decisions for our clients.",
    responsibilities: [
      "Analyze and visualize complex datasets",
      "Build and validate machine learning models",
      "Create data pipelines and ETL processes",
      "Generate reports and dashboards",
      "Collaborate with business teams on requirements"
    ],
    requirements: [
      "Strong statistical and analytical skills",
      "Proficiency in Python and data science libraries",
      "Experience with SQL and database querying",
      "Knowledge of data visualization tools",
      "Understanding of ML algorithms and techniques"
    ],
    skills: ["Python", "SQL", "Pandas", "Tableau", "Machine Learning"],
    benefits: [
      "Access to real business datasets",
      "Mentorship from senior data scientists",
      "Portfolio project development",
      "Remote work flexibility",
      "Structured learning path"
    ],
    category: "data-science",
    level: "intermediate",
    applications: 41,
    featured: false,
    urgent: true
  },
  {
    id: "6",
    title: "UI/UX Design Intern",
    company: "DesignCraft Studio",
    location: "Mumbai",
    type: "part-time",
    duration: "3 months",
    stipend: "₹20,000/month",
    postedDate: "2024-01-22",
    applicationDeadline: "2024-02-22",
    description: "Create beautiful and intuitive user experiences for digital products used by millions of users across various platforms.",
    responsibilities: [
      "Design user interfaces and experiences",
      "Create wireframes, prototypes, and mockups",
      "Conduct user research and usability testing",
      "Collaborate with developers on implementation",
      "Maintain design systems and style guides"
    ],
    requirements: [
      "Proficiency in Figma, Adobe XD, or Sketch",
      "Understanding of design principles and UX best practices",
      "Basic knowledge of HTML/CSS",
      "Strong visual design skills",
      "Portfolio of design projects"
    ],
    skills: ["Figma", "UI/UX Design", "Prototyping", "User Research", "Adobe Creative Suite"],
    benefits: [
      "Design mentorship program",
      "Latest design tools provided",
      "Client project exposure",
      "Creative freedom on projects",
      "Showcase in company portfolio"
    ],
    category: "design",
    level: "beginner",
    applications: 29,
    featured: false,
    urgent: false
  },
  {
    id: "7",
    title: "Mobile App Development Intern",
    company: "AppVenture Mobile",
    location: "Delhi",
    type: "full-time",
    duration: "4 months",
    stipend: "₹26,000/month",
    postedDate: "2024-01-14",
    applicationDeadline: "2024-02-14",
    description: "Develop cross-platform mobile applications using React Native and contribute to apps with millions of downloads.",
    responsibilities: [
      "Develop and maintain mobile applications",
      "Implement new features and fix bugs",
      "Optimize app performance and responsiveness",
      "Collaborate with backend teams on API integration",
      "Write clean, reusable, and maintainable code"
    ],
    requirements: [
      "Knowledge of React Native or Flutter",
      "Understanding of JavaScript/TypeScript",
      "Familiarity with mobile development concepts",
      "Experience with version control (Git)",
      "Problem-solving and debugging skills"
    ],
    skills: ["React Native", "JavaScript", "Mobile Development", "REST APIs", "Git"],
    benefits: [
      "App store deployment experience",
      "Code review from senior developers",
      "Performance optimization training",
      "Cross-platform development skills",
      "Potential app revenue sharing"
    ],
    category: "development",
    level: "intermediate",
    applications: 33,
    featured: true,
    urgent: false
  },
  {
    id: "8",
    title: "Computer Vision Intern",
    company: "VisionTech AI",
    location: "Bangalore",
    type: "full-time",
    duration: "6 months",
    stipend: "₹38,000/month",
    postedDate: "2024-01-08",
    applicationDeadline: "2024-02-08",
    description: "Work on advanced computer vision projects including object detection, image segmentation, and video analytics for real-world applications.",
    responsibilities: [
      "Implement computer vision algorithms",
      "Process and annotate image/video datasets",
      "Train and optimize deep learning models",
      "Deploy models to production environments",
      "Research latest CV papers and techniques"
    ],
    requirements: [
      "Strong knowledge of Python and OpenCV",
      "Experience with deep learning frameworks",
      "Understanding of image processing techniques",
      "Familiarity with neural network architectures",
      "Background in linear algebra and calculus"
    ],
    skills: ["Python", "OpenCV", "PyTorch", "Computer Vision", "Deep Learning"],
    benefits: [
      "GPU resources for training",
      "Research publication opportunities",
      "Industry conference participation",
      "Mentorship from PhD researchers",
      "Cutting-edge project work"
    ],
    category: "ai-ml",
    level: "advanced",
    applications: 26,
    featured: true,
    urgent: true
  },
  {
    id: "9",
    title: "DevOps Engineering Intern",
    company: "InfraScale Cloud",
    location: "Remote",
    type: "remote",
    duration: "3 months",
    stipend: "₹30,000/month",
    postedDate: "2024-01-25",
    applicationDeadline: "2024-02-25",
    description: "Learn and implement modern DevOps practices including CI/CD, infrastructure as code, and cloud infrastructure management.",
    responsibilities: [
      "Setup and maintain CI/CD pipelines",
      "Manage cloud infrastructure using IaC",
      "Monitor system performance and reliability",
      "Automate deployment and scaling processes",
      "Collaborate with development teams"
    ],
    requirements: [
      "Basic knowledge of Linux systems",
      "Familiarity with cloud platforms",
      "Understanding of containerization (Docker)",
      "Scripting skills (Bash/Python)",
      "Interest in infrastructure automation"
    ],
    skills: ["Docker", "AWS", "CI/CD", "Terraform", "Linux"],
    benefits: [
      "Cloud certification training",
      "Hands-on with production systems",
      "Mentorship from DevOps engineers",
      "Remote work setup allowance",
      "Infrastructure automation experience"
    ],
    category: "development",
    level: "intermediate",
    applications: 22,
    featured: false,
    urgent: false
  },
  {
    id: "10",
    title: "Game Development Intern",
    company: "Playful Studios",
    location: "Chennai",
    type: "part-time",
    duration: "4 months",
    stipend: "₹22,000/month",
    postedDate: "2024-01-16",
    applicationDeadline: "2024-02-16",
    description: "Create immersive gaming experiences using Unity and Unreal Engine, working on both gameplay mechanics and visual elements.",
    responsibilities: [
      "Implement game features and mechanics",
      "Create and optimize 3D assets",
      "Write clean and efficient game code",
      "Test and debug game functionality",
      "Collaborate with artists and designers"
    ],
    requirements: [
      "Experience with Unity or Unreal Engine",
      "Knowledge of C# or C++",
      "Understanding of game development principles",
      "Basic 3D math knowledge",
      "Portfolio of game projects"
    ],
    skills: ["Unity", "C#", "Game Development", "3D Modeling", "Physics"],
    benefits: [
      "Game publishing opportunity",
      "Mentorship from senior developers",
      "Access to game assets library",
      "Flexible creative environment",
      "Revenue sharing for successful games"
    ],
    category: "development",
    level: "beginner",
    applications: 19,
    featured: false,
    urgent: false
  },
  {
    id: "11",
    title: "NLP Engineering Intern",
    company: "LinguaTech AI",
    location: "Remote",
    type: "remote",
    duration: "5 months",
    stipend: "₹34,000/month",
    postedDate: "2024-01-11",
    applicationDeadline: "2024-02-11",
    description: "Develop natural language processing systems including chatbots, text analysis, and language generation models for enterprise applications.",
    responsibilities: [
      "Implement NLP pipelines and models",
      "Preprocess and analyze text data",
      "Fine-tune transformer models",
      "Develop chatbot interfaces",
      "Evaluate model performance and accuracy"
    ],
    requirements: [
      "Strong Python programming skills",
      "Experience with NLP libraries (NLTK, spaCy)",
      "Knowledge of transformer architectures",
      "Understanding of linguistics concepts",
      "Familiarity with deep learning frameworks"
    ],
    skills: ["Python", "NLP", "Transformers", "spaCy", "Deep Learning"],
    benefits: [
      "Work on cutting-edge NLP projects",
      "Access to large text datasets",
      "Research and development exposure",
      "Remote collaboration experience",
      "Technical writing opportunities"
    ],
    category: "ai-ml",
    level: "advanced",
    applications: 24,
    featured: true,
    urgent: false
  },
  {
    id: "12",
    title: "Web Design Intern",
    company: "PixelPerfect Digital",
    location: "Gurgaon",
    type: "part-time",
    duration: "2 months",
    stipend: "₹18,000/month",
    postedDate: "2024-01-28",
    applicationDeadline: "2024-02-28",
    description: "Create visually stunning and user-friendly website designs for clients across various industries, from concept to implementation.",
    responsibilities: [
      "Design website layouts and interfaces",
      "Create responsive design mockups",
      "Collaborate with developers on implementation",
      "Create design assets and graphics",
      "Participate in client meetings and presentations"
    ],
    requirements: [
      "Proficiency in design tools (Figma, Adobe XD)",
      "Understanding of web design principles",
      "Basic knowledge of HTML/CSS",
      "Creative thinking and attention to detail",
      "Portfolio of design work"
    ],
    skills: ["Web Design", "Figma", "HTML/CSS", "Responsive Design", "Adobe Creative Suite"],
    benefits: [
      "Client project experience",
      "Design tool training",
      "Portfolio building",
      "Flexible schedule",
      "Potential freelance opportunities"
    ],
    category: "design",
    level: "beginner",
    applications: 31,
    featured: false,
    urgent: true
  }
];