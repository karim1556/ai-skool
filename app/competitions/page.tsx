"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Zap,
  Crown,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Trophy,
  Star,
  Clock,
  Award,
  Sparkles,
  Eye,
  Gamepad2,
  Brain,
  Cpu,
  Lightbulb,
  Shield,
  Target,
  ArrowRight,
  ExternalLink,
  Play,
  Download,
  BookOpen,
  GraduationCap,
  Code,
  Wrench,
  FileText,
  CheckCircle,
  ArrowDown,
  IndianRupee
} from "lucide-react";
import { useState } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

// --- Types ---
type StatusKey = 'registration-open' | 'early-registration' | 'coming-soon' | 'in-progress';
type DifficultyKey = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface CompetitionDetailedCategory {
  name: string;
  description: string;
  ageGroups: string[];
  teamSize: string;
  hardware: string;
  rules: string[];
}

interface CompetitionDetailedInfo {
  overview: string;
  categories: CompetitionDetailedCategory[];
  timeline: { stage: string; date: string; status: string }[];
  rules: { name: string; type: string; size: string }[];
  prizes: string[];
  requirements: string[];
  partners?: string[];
}

interface Competition {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  image: string;
  status: StatusKey;
  deadline: string;
  location: string;
  ageGroups: string[];
  categories: string[];
  difficulty: DifficultyKey;
  popularity: number;
  registrationLink: string;
  learnMoreLink: string;
  stats: Record<string, string>;
  gradient: string;
  accentColor: string;
  detailedInfo?: CompetitionDetailedInfo;
}

export default function CompetitionsShowcasePage() {
  const [activeCompetition, setActiveCompetition] = useState("wro-2025");
  const [showAllCompetitions, setShowAllCompetitions] = useState(false);

  // Featured Competitions
  const competitions: Competition[] = [
    {
      id: "wro-2025",
      title: "World Robot Olympiad 2025",
      subtitle: "National Robotics Championship",
      tagline: "Build. Learn. Compete. Represent at Global Finals",
      description: "Join the national robotics competition with 5,000+ teams. Winners represent at International WRO Finals. Perfect platform for students to showcase innovation.",
      image: "/images/wro.jpg",
      status: "registration-open",
      deadline: "2025-06-15",
      location: "Hyderabad → International Finals",
      ageGroups: ["Elementary: 8-12", "Junior: 11-15", "Senior: 14-19"],
      categories: ["RoboMission", "Future Innovators", "RoboSports", "Future Engineers"],
      difficulty: "intermediate",
      popularity: 98,
      registrationLink: "https://wro.org/register",
      learnMoreLink: "#wro-details",
      stats: {
        teams: "5,000+",
        regions: "28+",
        years: "Since 2006",
        prize: "Global Representation"
      },
      gradient: "from-blue-500 to-cyan-500",
      accentColor: "blue",
      
      detailedInfo: {
        overview: "National robotics competition that selects teams to represent at the international level. Organized in partnership with educational institutions, it promotes STEM education and innovation among youth.",
        
        categories: [
          {
            name: "RoboMission",
            description: "Build and program autonomous robots to solve specific challenges on a game field",
            ageGroups: ["8-12", "11-15", "14-19"],
            teamSize: "2-3 students",
            hardware: "Any robotics kits",
            rules: [
              "Robot size: Max 250x250x250 mm",
              "Autonomous operation only",
              "2.5 minute time limit",
              "Themed around real-world contexts"
            ]
          },
          {
            name: "Future Innovators",
            description: "Develop innovative robot projects solving real-world problems",
            ageGroups: ["8-12", "11-15", "14-19"],
            teamSize: "2-3 students",
            hardware: "Any robotics kits",
            rules: [
              "Solve social/environmental problems",
              "2x2x2m booth space",
              "Focus on innovation initiatives",
              "Multilingual presentation allowed"
            ]
          },
          {
            name: "RoboSports",
            description: "Team vs team robot sports competition",
            ageGroups: ["11-19"],
            teamSize: "2-3 students",
            hardware: "LEGO/Arduino platforms",
            rules: [
              "2 robots per team",
              "Sports-themed challenges",
              "Head-to-head competition",
              "Promoting sports education"
            ]
          },
          {
            name: "Future Engineers",
            description: "Advanced robotics for engineering challenges",
            ageGroups: ["14-22"],
            teamSize: "2-3 students",
            hardware: "Any platform",
            rules: [
              "Solve engineering problems",
              "Real-world applications",
              "Research and development focus",
              "Align with innovation mission"
            ]
          }
        ],

        timeline: [
          { stage: "Registration Opens", date: "February 1, 2025", status: "completed" },
          { stage: "Regional Competitions", date: "April-May 2025", status: "upcoming" },
          { stage: "National Championship", date: "August 15-16, 2025", status: "upcoming" },
          { stage: "International Finals", date: "November 2025", status: "upcoming" }
        ],

        rules: [
          { name: "General Rules 2025", type: "pdf", size: "2.4 MB" },
          { name: "RoboMission Game Rules", type: "pdf", size: "1.8 MB" },
          { name: "Future Innovators Guidelines", type: "pdf", size: "1.5 MB" },
          { name: "Team Selection Process", type: "pdf", size: "1.2 MB" }
        ],

        prizes: [
          "Gold, Silver, Bronze Medals",
          "Represent at International Finals",
          "Cash Prizes up to ₹2,00,000",
          "STEM Scholarships",
          "Innovation Recognition Awards"
        ],

        requirements: [
          "School/college students",
          "2-3 students per team + teacher mentor",
          "Valid school ID card required",
          "Registration fee required",
          "Original robot design and code"
        ],

        partners: [
          "Ministry of Education",
          "Innovation Mission",
          "Technical Universities",
          "Education Boards",
          "Digital Foundation"
        ]
      }
    },
    {
      id: "robotics-olympiad-2025",
      title: "Robotics Olympiad 2025",
      subtitle: "National Level School Competition",
      tagline: "Promoting Robotics Education",
      description: "Official robotics olympiad for schools recognized by education boards. Perfect for beginners to advanced students across all regions.",
      image: "/images/robotics-olympiad.jpg",
      status: "early-registration",
      deadline: "2025-04-30",
      location: "Delhi (National Finals)",
      ageGroups: ["Class 4-6", "Class 7-9", "Class 10-12"],
      categories: ["Junior Level", "Middle Level", "Senior Level"],
      difficulty: "beginner",
      popularity: 95,
      registrationLink: "https://roboticsolympiad.org/register",
      learnMoreLink: "#olympiad-details",
      stats: {
        teams: "8,000+",
        schools: "2,500+",
        years: "Since 2018",
        prize: "Board Recognition"
      },
      gradient: "from-purple-500 to-indigo-500",
      accentColor: "purple",
      
      detailedInfo: {
        overview: "The Robotics Olympiad is recognized by education boards. It aims to integrate robotics into mainstream education and identify young talent.",
        
        categories: [
          {
            name: "Junior Level (Class 4-6)",
            description: "Basic robotics concepts and simple programming",
            ageGroups: ["9-11 years"],
            teamSize: "2 students",
            hardware: "Basic robotics kits",
            rules: [
              "Drag-and-drop programming only",
              "Simple mechanical structures",
              "Theme: Digital applications",
              "1 hour time limit"
            ]
          },
          {
            name: "Middle Level (Class 7-9)",
            description: "Intermediate robotics with sensors and automation",
            ageGroups: ["12-14 years"],
            teamSize: "2-3 students",
            hardware: "Advanced robotics kits",
            rules: [
              "Block-based programming",
              "Multiple sensor integration",
              "Theme: Smart Cities",
              "2 hour time limit"
            ]
          },
          {
            name: "Senior Level (Class 10-12)",
            description: "Advanced robotics with AI and IoT concepts",
            ageGroups: ["15-17 years"],
            teamSize: "3 students",
            hardware: "Any platform with programming",
            rules: [
              "Text-based programming (Python/C++)",
              "AI and IoT integration",
              "Theme: Sustainable Development",
              "3 hour time limit"
            ]
          }
        ],

        timeline: [
          { stage: "School Registration", date: "January 15, 2025", status: "completed" },
          { stage: "School Level Round", date: "March 2025", status: "upcoming" },
          { stage: "Regional Finals", date: "May 2025", status: "upcoming" },
          { stage: "National Finals", date: "July 2025", status: "upcoming" }
        ],

        rules: [
          { name: "Rulebook 2025", type: "pdf", size: "3.1 MB" },
          { name: "Recognition Letter", type: "pdf", size: "0.8 MB" },
          { name: "Syllabus and Topics", type: "pdf", size: "1.2 MB" },
          { name: "School Registration Guide", type: "pdf", size: "1.5 MB" }
        ],

        prizes: [
          "Merit Certificates",
          "Gold/Silver/Bronze Medals",
          "Cash Awards up to ₹1,00,000",
          "STEM Kit Prizes worth ₹50,000",
          "School Trophy and Recognition"
        ],

        requirements: [
          "School students only",
          "School registration mandatory",
          "Teacher coordinator required",
          "Registration fee per student",
          "School ID card mandatory"
        ],

        partners: [
          "Education Boards",
          "State Education Departments",
          "Technical Universities",
          "Science Organizations",
          "National Science Centre"
        ]
      }
    },
    {
      id: "techfest-2025",
      title: "Techfest 2025",
      subtitle: "Science & Technology Festival",
      tagline: "Where Innovation Meets Excellence",
      description: "Join the major science and technology festival. Robotics competitions with cutting-edge challenges and massive participation.",
      image: "/images/techfest.jpg",
      status: "coming-soon",
      deadline: "2025-09-15",
      location: "Mumbai",
      ageGroups: ["School: 13-18", "College: 18-25", "Open: No limit"],
      categories: ["Robowars", "Line Follower", "Drone Race", "Innovation Challenge"],
      difficulty: "advanced",
      popularity: 99,
      registrationLink: "https://techfest.org/competitions",
      learnMoreLink: "#techfest-details",
      stats: {
        participants: "1,50,000+",
        colleges: "2,000+",
        years: "Since 1998",
        prize: "₹25 Lakhs+"
      },
      gradient: "from-green-500 to-emerald-500",
      accentColor: "green",
      
      detailedInfo: {
        overview: "Major science and technology festival attracting participants from all regions. The robotics competitions are among the most prestigious.",
        
        categories: [
          {
            name: "Robowars",
            description: "Combat robotics - Build robots that fight in an arena",
            ageGroups: ["College students"],
            teamSize: "4-6 students",
            hardware: "Custom built robots",
            rules: [
              "Weight categories: 15kg, 30kg, 60kg",
              "Combat arena with hazards",
              "KO or points based winning",
              "Safety protocols mandatory"
            ]
          },
          {
            name: "Line Follower",
            description: "Classic autonomous line following challenge",
            ageGroups: ["School & College"],
            teamSize: "2-4 students",
            hardware: "Any autonomous robot",
            rules: [
              "Fully autonomous operation",
              "Complex track with intersections",
              "Speed and accuracy scoring",
              "Time-based elimination"
            ]
          },
          {
            name: "Drone Race",
            description: "FPV drone racing through obstacle courses",
            ageGroups: ["Open to all"],
            teamSize: "1-2 participants",
            hardware: "Custom racing drones",
            rules: [
              "FPV first-person view",
              "Time-trial and head-to-head",
              "Obstacle course completion",
              "Technical inspection required"
            ]
          }
        ],

        timeline: [
          { stage: "Registrations Open", date: "August 1, 2025", status: "upcoming" },
          { stage: "Online Prelims", date: "October 2025", status: "upcoming" },
          { stage: "Main Event", date: "December 27-29, 2025", status: "upcoming" }
        ],

        rules: [
          { name: "Robowars Rulebook 2025", type: "pdf", size: "4.2 MB" },
          { name: "Line Follower Guidelines", type: "pdf", size: "2.1 MB" },
          { name: "Drone Racing Specifications", type: "pdf", size: "1.8 MB" },
          { name: "General Rules", type: "pdf", size: "2.5 MB" }
        ],

        prizes: [
          "Total Prize Pool: ₹25,00,000+",
          "Robowars Champion: ₹5,00,000",
          "Line Follower: ₹2,00,000",
          "Drone Race: ₹1,50,000",
          "Certificates and Medals"
        ],

        requirements: [
          "Students/enthusiasts",
          "College ID for student categories",
          "Safety compliance mandatory",
          "Technical documentation",
          "On-campus participation for finals"
        ],

        partners: [
          "Host Institute",
          "Electronics Ministry",
          "Space Research Organisation",
          "Research Organisations",
          "Tech Companies"
        ]
      }
    }
  ];

  const allCompetitions: Competition[] = competitions;
  const displayedCompetitions = showAllCompetitions ? allCompetitions : competitions;

  const statusConfig: Record<StatusKey, { label: string; color: string; text: string }> = {
    "registration-open": { label: "Registration Open", color: "bg-green-500", text: "text-green-700" },
    "early-registration": { label: "Early Registration", color: "bg-blue-500", text: "text-blue-700" },
    "coming-soon": { label: "Coming Soon", color: "bg-purple-500", text: "text-purple-700" },
    "in-progress": { label: "In Progress", color: "bg-orange-500", text: "text-orange-700" }
  };

  const difficultyConfig: Record<DifficultyKey, { label: string; color: string }> = {
    "beginner": { label: "Beginner", color: "bg-green-100 text-green-700" },
    "intermediate": { label: "Intermediate", color: "bg-blue-100 text-blue-700" },
    "advanced": { label: "Advanced", color: "bg-purple-100 text-purple-700" },
    "expert": { label: "Expert", color: "bg-red-100 text-red-700" }
  };

  const activeCompetitionData = allCompetitions.find((comp: Competition) => comp.id === activeCompetition) as Competition | undefined;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-white to-green-50 px-4 py-24 md:px-6 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-200 to-green-300 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="mx-auto max-w-7xl relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg mb-4">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold text-gray-700">Competitions 2025</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-orange-500 via-green-500 to-orange-500 bg-clip-text text-transparent bg-size-200 animate-gradient">
                  COMPETE
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  IN ROBOTICS
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl font-medium text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Join premier robotics competitions. 
              <span className="bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent font-bold"> Showcase your talent, win recognition, and represent globally.</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 py-6">
              {[
                { icon: Users, value: "20,000+", label: "Teams" },
                { icon: IndianRupee, value: "₹5Cr+", label: "Prize Money" },
                { icon: MapPin, value: "28+", label: "Regions" },
                { icon: Award, value: "100+", label: "Cities" }
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-gray-200 shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-green-600">
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <a href="#competitions-grid">
                <Button className="rounded-full bg-gradient-to-r from-orange-500 to-green-600 px-8 py-6 text-lg font-bold text-white hover:from-orange-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group">
                  <Eye className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  View Competitions
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Competitions Grid Section */}
      <section id="competitions-grid" className="px-4 py-20 md:px-6 md:py-32 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 px-4 py-2 text-sm mb-4 hover:bg-orange-200 transition-colors cursor-pointer">
              <Zap className="h-4 w-4 mr-1" />
              Competitions 2025
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Choose Your <span className="bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent"> Challenge</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From school-level olympiads to national championships. Find the perfect platform to showcase your robotics skills.
            </p>
          </div>

          {/* Competition Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {displayedCompetitions.map((competition) => (
              <Button
                key={competition.id}
                variant={activeCompetition === competition.id ? "default" : "outline"}
                className={`rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                  activeCompetition === competition.id 
                    ? "bg-gradient-to-r from-orange-500 to-green-600 text-white shadow-lg" 
                    : "border-2 border-gray-300 hover:border-orange-500"
                }`}
                onClick={() => setActiveCompetition(competition.id)}
              >
                {competition.title.split(' ')[0]}
              </Button>
            ))}
          </div>

          {/* Active Competition Details */}
          {activeCompetitionData && (
            <div className="space-y-12">
              {/* Main Competition Card */}
              <Card className="border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2">
                    {/* Left Side - Image */}
                    <div className="relative h-80 lg:h-full min-h-[400px]">
                      <Image
                        src={activeCompetitionData.image}
                        alt={activeCompetitionData.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent lg:bg-gradient-to-t"></div>
                      
                      {/* Overlay info */}
                      <div className="absolute bottom-6 left-6 text-white">
                        <Badge className={`${statusConfig[activeCompetitionData.status].color} text-white mb-2`}>
                          {statusConfig[activeCompetitionData.status].label}
                        </Badge>
                        <Badge variant="secondary" className={difficultyConfig[activeCompetitionData.difficulty].color}>
                          {difficultyConfig[activeCompetitionData.difficulty].label}
                        </Badge>
                      </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="p-8 space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                          {activeCompetitionData.title}
                        </h3>
                        <p className="text-lg font-semibold text-gray-600">
                          {activeCompetitionData.subtitle}
                        </p>
                        <p className="text-xl font-bold text-gray-800 leading-tight">
                          {activeCompetitionData.tagline}
                        </p>
                      </div>

                      <p className="text-gray-600 leading-relaxed">
                        {activeCompetitionData.description}
                      </p>

                      {/* Quick Info Grid */}
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Deadline</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {new Date(activeCompetitionData.deadline).toLocaleDateString('en-IN')}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Location</span>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {activeCompetitionData.location}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Age Groups</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {activeCompetitionData.ageGroups.map((age, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {age}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Categories</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {activeCompetitionData.categories.slice(0, 2).map((cat, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                            {activeCompetitionData.categories.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{activeCompetitionData.categories.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                        {Object.entries(activeCompetitionData.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{value}</div>
                            <div className="text-sm text-gray-600 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        <a 
                          href={activeCompetitionData.registrationLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white font-semibold py-3 text-lg">
                            <Rocket className="h-5 w-5 mr-2" />
                            Register Now
                          </Button>
                        </a>
                        <Button variant="outline" className="border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50">
                          <FileText className="h-5 w-5 mr-2" />
                          Download Rules
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Information */}
              {activeCompetitionData.detailedInfo && (
                <div className="space-y-8">
                  {/* Overview */}
                  <Card className="border-0 shadow-xl">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-orange-500" />
                        Competition Overview
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {activeCompetitionData.detailedInfo?.overview}
                      </p>

                      {/* Partners */}
                      {activeCompetitionData.detailedInfo?.partners && (
                        <div className="mt-6">
                          <h4 className="text-lg font-bold text-gray-900 mb-3">Supported by:</h4>
                          <div className="flex flex-wrap gap-2">
                            {activeCompetitionData.detailedInfo.partners.map((partner: string, index: number) => (
                              <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                                {partner}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Categories */}
                  <Card className="border-0 shadow-xl">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Cpu className="h-6 w-6 text-orange-500" />
                        Competition Categories
                      </h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        {activeCompetitionData.detailedInfo?.categories.map((category: CompetitionDetailedCategory, index: number) => (
                          <div key={index} className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h4>
                            <p className="text-gray-600 mb-4">{category.description}</p>
                            
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Age: {category.ageGroups.join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Wrench className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Hardware: {category.hardware}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Code className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Team: {category.teamSize}</span>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h5 className="font-semibold text-gray-900 mb-2">Key Rules:</h5>
                              <ul className="space-y-1">
                                {category.rules.map((rule: string, ruleIndex: number) => (
                                  <li key={ruleIndex} className="flex items-start gap-2 text-sm text-gray-600">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {rule}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline & Rules Side by Side */}
                  <div className="grid gap-8 lg:grid-cols-2">
                    {/* Timeline */}
                    <Card className="border-0 shadow-xl">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <Calendar className="h-6 w-6 text-orange-500" />
                          Important Dates
                        </h3>
                        <div className="space-y-4">
                          {activeCompetitionData.detailedInfo?.timeline.map((item: { stage: string; date: string; status: string }, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-semibold text-gray-900">{item.stage}</div>
                                <div className="text-sm text-gray-600">{item.date}</div>
                              </div>
                              <Badge className={
                                item.status === 'completed' ? 'bg-green-500' :
                                item.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                              }>
                                {item.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Rules & Resources */}
                    <Card className="border-0 shadow-xl">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <Download className="h-6 w-6 text-orange-500" />
                          Rules & Resources
                        </h3>
                        <div className="space-y-3">
                          {activeCompetitionData.detailedInfo?.rules.map((rule: { name: string; type: string; size: string }, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div>
                                  <div className="font-medium text-gray-900">{rule.name}</div>
                                  <div className="text-sm text-gray-500">{rule.size}</div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Prizes & Requirements */}
                  <div className="grid gap-8 lg:grid-cols-2">
                    {/* Prizes */}
                    <Card className="border-0 shadow-xl">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <Trophy className="h-6 w-6 text-orange-500" />
                          Prizes & Awards
                        </h3>
                        <div className="space-y-3">
                          {activeCompetitionData.detailedInfo?.prizes.map((prize: string, index: number) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg">
                              <Award className="h-5 w-5 text-orange-500" />
                              <span className="font-medium text-gray-900">{prize}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card className="border-0 shadow-xl">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <CheckCircle className="h-6 w-6 text-orange-500" />
                          Requirements
                        </h3>
                        <div className="space-y-3">
                          {activeCompetitionData.detailedInfo?.requirements.map((requirement: string, index: number) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="font-medium text-gray-900">{requirement}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Show More/Less Button */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="rounded-full border-2 border-gray-300 px-8 py-4 text-lg font-semibold hover:border-orange-500 hover:bg-orange-50 group"
              onClick={() => setShowAllCompetitions(!showAllCompetitions)}
            >
                {showAllCompetitions ? 'Show Less' : 'Show All Competitions'}
              <ArrowDown className={`ml-2 h-5 w-5 transition-transform ${showAllCompetitions ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-green-600 px-4 py-20 md:px-6 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="mx-auto max-w-4xl text-center relative">
          <Crown className="h-16 w-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Start Your Robotics Journey
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the robotics revolution. Register for competitions, showcase your talent, and achieve excellence on global platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#competitions-grid">
              <Button 
                size="lg"
                className="rounded-full bg-white text-orange-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <Rocket className="mr-2 h-5 w-5" />
                View Competitions
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}