"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Code,
  Download,
  ArrowRight,
  ExternalLink,
  Filter,
  Search,
  Youtube,
  FileText,
  Cpu,
  Wifi,
  Zap,
  Brain,
  Smartphone,
  Home,
  Cloud,
  Bot,
  Eye,
  Clock,
  Users,
  Star,
  BookOpen,
  Wrench,
  Copy,
  Check,
  GraduationCap,
  Package,
  Award,
  Heart
} from "lucide-react";
import { useEffect, useState } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

// Project type used in this file
type Project = {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  difficulty: string;
  duration: string;
  components: string[];
  youtubeLink: string;
  codeDownloadLink: string;
  circuitDiagramLink: string;
  instructionsLink: string;
  image: string;
  views: string;
  likes: string;
  featured: boolean;
  tags: string[];
  codeSnippet?: string;
  circuitConnections?: string;
  applications?: string;
  studentName?: string;
  studentAge?: string;
  school?: string;
  usesOurComponents?: boolean;
  componentsFromUs?: string[];
  achievement?: string;
};

// Mock data structure - This would come from your admin panel/database
const projectsData: Project[] = [
  {
    id: 1,
    title: "Obstacle Avoiding Robot",
    description: "A smart car that uses an ultrasonic sensor to detect and avoid obstacles in its path autonomously. Built by our student as part of the Robotics Summer Camp 2024.",
    shortDescription: "Autonomous robot that navigates around obstacles",
    category: "Arduino",
    difficulty: "Beginner",
    duration: "2-3 hours",
    components: ["Arduino Uno", "HC-SR04 Ultrasonic Sensor", "L298N Motor Driver", "DC Motors", "Robot Chassis"],
    youtubeLink: "https://youtube.com/watch?v=example1",
    codeDownloadLink: "#",
    circuitDiagramLink: "#",
    instructionsLink: "#",
    image: "/images/obstacle-robot.jpg",
    views: "44,000",
    likes: "43,000",
    featured: true,
    tags: ["Robotics", "Autonomous", "Sensors", "Arduino"],
    codeSnippet: `#define trigPin 9
#define echoPin 8
#define motorPin1_L 2 // Left Motor IN1
#define motorPin2_L 3 // Left Motor IN2
#define motorPin1_R 4 // Right Motor IN1
#define motorPin2_R 5 // Right Motor IN2
#define enableL 6 // Left Motor Enable (PWM)
#define enableR 7 // Right Motor Enable (PWM)

long duration;
int distance;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(motorPin1_L, OUTPUT);
  pinMode(motorPin2_L, OUTPUT);
  pinMode(motorPin1_R, OUTPUT);
  pinMode(motorPin2_R, OUTPUT);
  pinMode(enableL, OUTPUT);
  pinMode(enableR, OUTPUT);
  Serial.begin(9600);
  
  // Set initial speed
  analogWrite(enableL, 150);
  analogWrite(enableR, 150);
}

void loop() {
  distance = calculateDistance();
  
  if (distance <= 20) { // If obstacle is within 20cm
    stopRobot();
    delay(500);
    turnRight();
    delay(700);
    distance = calculateDistance();
    
    if (distance <= 20) {
      stopRobot();
      delay(500);
      turnLeft();
      delay(1400);
      distance = calculateDistance();
      
      if (distance <= 20) {
        stopRobot();
        delay(500);
        turnAround();
      }
    }
  } else {
    moveForward();
  }
}

int calculateDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;
}`,
    circuitConnections: `Circuit Connections:

HC-SR04:
• VCC → Arduino 5V
• GND → Arduino GND  
• Trig → Arduino Digital Pin 9
• Echo → Arduino Digital Pin 8

L298N Motor Driver:
• ENA → Arduino Digital Pin 6 (PWM)
• ENB → Arduino Digital Pin 7 (PWM)
• IN1 → Arduino Digital Pin 2
• IN2 → Arduino Digital Pin 3
• IN3 → Arduino Digital Pin 4
• IN4 → Arduino Digital Pin 5
• OUT1/OUT2 → Left Motor
• OUT3/OUT4 → Right Motor
• External Power → 9V Battery for Motors`,
    applications: "This project lays the groundwork for more advanced autonomous robots, robotic vacuum cleaners, and automated guided vehicles (AGVs) in industrial settings.",
    studentName: "Rahul Sharma",
    studentAge: "14 years",
    school: "Delhi Public School",
    usesOurComponents: true,
    componentsFromUs: ["Arduino Uno Kit", "HC-SR04 Sensor", "L298N Motor Driver"],
    achievement: "Winner - School Science Fair 2024"
  },
  {
    id: 2,
    title: "Home Automation System",
    description: "Control home appliances using a mobile phone via Bluetooth and Arduino relay system. Compatible with Android devices. Created by our student during the IoT Workshop.",
    shortDescription: "Smart home control via Bluetooth",
    category: "Arduino",
    difficulty: "Intermediate",
    duration: "3-4 hours",
    components: ["Arduino Uno", "HC-05 Bluetooth", "Relay Module", "Android App", "Jumper Wires"],
    youtubeLink: "https://youtube.com/watch?v=example2",
    codeDownloadLink: "#",
    circuitDiagramLink: "#",
    instructionsLink: "#",
    image: "/images/home-automation.jpg",
    views: "33,000",
    likes: "34,000",
    featured: true,
    tags: ["IoT", "Bluetooth", "Home Automation", "Android"],
    codeSnippet: `#include <SoftwareSerial.h>

SoftwareSerial BT(10, 11); // RX, TX
int relayPin = 8;
char data;

void setup() {
  Serial.begin(9600);
  BT.begin(9600);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH); // Start with relay off
}

void loop() {
  if (BT.available()) {
    data = BT.read();
    Serial.println(data);
    
    switch(data) {
      case '1':
        digitalWrite(relayPin, LOW); // Turn ON
        break;
      case '0':
        digitalWrite(relayPin, HIGH); // Turn OFF
        break;
    }
  }
}`,
    circuitConnections: `HC-05 Bluetooth Module:
• VCC → Arduino 5V
• GND → Arduino GND
• TX → Arduino Digital Pin 10
• RX → Arduino Digital Pin 11

Relay Module:
• VCC → Arduino 5V
• GND → Arduino GND
• IN → Arduino Digital Pin 8
• COM → AC Supply
• NO → Appliance`,
    applications: "Home automation, smart lighting control, remote appliance control, IoT applications for home security systems.",
    studentName: "Priya Patel",
    studentAge: "16 years",
    school: "St. Mary's Convent",
    usesOurComponents: true,
    componentsFromUs: ["HC-05 Bluetooth Module", "4-Channel Relay", "Arduino Starter Kit"],
    achievement: "Selected for State Level Science Exhibition"
  },
  {
    id: 3,
    title: "Weather Monitoring Station",
    description: "Real-time weather monitoring system with temperature, humidity, and pressure sensors displaying data on LCD. Built using our sensor kit by a young innovator.",
    shortDescription: "Real-time environmental monitoring",
    category: "Arduino",
    difficulty: "Beginner",
    duration: "2 hours",
    components: ["DHT11 Sensor", "BMP180 Sensor", "16x2 LCD", "Arduino Uno", "Breadboard"],
    youtubeLink: "https://youtube.com/watch?v=example3",
    codeDownloadLink: "#",
    circuitDiagramLink: "#",
    instructionsLink: "#",
    image: "/images/weather-station.jpg",
    views: "33,000",
    likes: "35,000",
    featured: false,
    tags: ["Sensors", "Monitoring", "Environment", "Display"],
    studentName: "Arjun Kumar",
    studentAge: "13 years",
    school: "Kendriya Vidyalaya",
    usesOurComponents: true,
    componentsFromUs: ["DHT11 Sensor Pack", "BMP180 Sensor", "LCD Display"],
    achievement: "Best Innovation Award - School Level"
  },
  {
    id: 4,
    title: "Smart Irrigation System",
    description: "Automated plant watering system using soil moisture sensors and water pump control. Project created using our agriculture robotics kit.",
    shortDescription: "Automated plant watering system",
    category: "IoT",
    difficulty: "Intermediate",
    duration: "4 hours",
    components: ["Soil Moisture Sensor", "Water Pump", "Relay Module", "Arduino", "PVC Pipes"],
    youtubeLink: "https://youtube.com/watch?v=example4",
    codeDownloadLink: "#",
    circuitDiagramLink: "#",
    instructionsLink: "#",
    image: "/images/irrigation-system.jpg",
    views: "28,000",
    likes: "26,000",
    featured: false,
    tags: ["IoT", "Agriculture", "Automation", "Sensors"],
    studentName: "Neha Gupta",
    studentAge: "15 years",
    school: "Modern School",
    usesOurComponents: true,
    componentsFromUs: ["Soil Moisture Sensor", "Mini Water Pump", "Relay Module"],
    achievement: "Community Project Recognition"
  },
  {
    id: 5,
    title: "Line Following Robot",
    description: "Autonomous robot that follows a predefined path using infrared sensors and PID control algorithm. Built with our robotics competition kit.",
    shortDescription: "Path-following autonomous robot",
    category: "Robotics",
    difficulty: "Intermediate",
    duration: "3 hours",
    components: ["IR Sensors", "Motor Driver", "Arduino", "Chassis Kit", "Battery"],
    youtubeLink: "https://youtube.com/watch?v=example5",
    codeDownloadLink: "#",
    circuitDiagramLink: "#",
    instructionsLink: "#",
    image: "/images/line-follower.jpg",
    views: "38,000",
    likes: "36,000",
    featured: true,
    tags: ["Robotics", "Autonomous", "PID Control", "Sensors"],
    studentName: "Siddharth Rao",
    studentAge: "17 years",
    school: "DAV Public School",
    usesOurComponents: true,
    componentsFromUs: ["IR Sensor Array", "L298N Motor Driver", "Robot Chassis"],
    achievement: "1st Prize - Inter School Robotics Competition"
  },
  {
    id: 6,
    title: "Bluetooth Controlled Car",
    description: "Remote controlled car using Bluetooth module and smartphone app with real-time control. Created using our wireless robotics kit.",
    shortDescription: "Smartphone-controlled robotic car",
    category: "Arduino",
    difficulty: "Beginner",
    duration: "2 hours",
    components: ["HC-05 Bluetooth", "Motor Driver", "Arduino", "Android App", "Car Kit"],
    youtubeLink: "https://youtube.com/watch?v=example6",
    codeDownloadLink: "#",
    circuitDiagramLink: "#",
    instructionsLink: "#",
    image: "/images/bluetooth-car.jpg",
    views: "41,000",
    likes: "39,000",
    featured: false,
    tags: ["Bluetooth", "RC Car", "Android", "Wireless"],
    studentName: "Ananya Singh",
    studentAge: "14 years",
    school: "Sanskriti School",
    usesOurComponents: true,
    componentsFromUs: ["HC-05 Bluetooth Module", "Motor Driver Shield", "Car Chassis Kit"],
    achievement: "Most Creative Design Award"
  }
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "code" | "circuit">("overview");
  const [copied, setCopied] = useState(false);
  // Remote projects (from API) — fall back to bundled static list
  const [remoteProjects, setRemoteProjects] = useState<Project[] | null>(null);

  // Use remote projects if available, otherwise fallback to the bundled static list
  const effectiveProjects: Project[] = remoteProjects && remoteProjects.length ? remoteProjects : projectsData;

  // Extract unique categories
  const categories: string[] = ["All", ...Array.from(new Set(effectiveProjects.map((project: Project) => project.category)))];

  // Filter projects based on category and search
  const filteredProjects: Project[] = effectiveProjects.filter((project: Project) => {
    const q = searchQuery.toLowerCase();
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(q) ||
                         project.description.toLowerCase().includes(q) ||
                         project.tags.some((tag: string) => tag.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const featuredProjects: Project[] = effectiveProjects.filter((project: Project) => project.featured);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (!ignore && Array.isArray(data?.projects)) setRemoteProjects(data.projects as Project[]);
      } catch (err) {
        // keep fallback
      }
    }

    load();
    return () => { ignore = true; };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 px-4 py-20 md:px-6 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-300 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="mx-auto max-w-7xl relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg mb-4">
                <GraduationCap className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">Student Projects Gallery</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent bg-size-200 animate-gradient">
                  STUDENT
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  INNOVATIONS
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl font-medium text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Showcasing amazing robotics projects built by our students using our components and kits. 
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold"> Real projects, real achievements, real inspiration.</span>
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 py-8">
              {[
                { number: "500+", label: "Student Projects" },
                { number: "2K+", label: "Components Used" },
                { number: "50+", label: "Schools" },
                { number: "100%", label: "Our Kits" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Student Projects Info Banner */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-lg font-bold">Proudly Built with Our Components</h3>
                <p className="text-blue-100">All projects featured here are created by students using our robotics kits and components</p>
              </div>
            </div>
            <Badge className="bg-white text-blue-600 hover:bg-white px-4 py-2 font-semibold">
              <Package className="h-4 w-4 mr-1" />
              Quality Components Guaranteed
            </Badge>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <Badge className="bg-amber-100 text-amber-700 px-4 py-2 text-sm mb-4">
                <Award className="h-4 w-4 mr-1" />
                AWARD WINNING PROJECTS
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Featured <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Student Creations</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Exceptional projects built by our students that have won awards and recognition
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Student Info */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-blue-500 text-white">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          Student
                        </Badge>
                        {project.achievement && (
                          <Badge className="bg-green-500 text-white">
                            <Award className="h-3 w-3 mr-1" />
                            Award
                          </Badge>
                        )}
                      </div>

                      {/* Our Components Badge */}
                      {project.usesOurComponents && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-amber-500 text-white">
                            <Package className="h-3 w-3 mr-1" />
                            Our Kit
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Student Details */}
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">
                          {project.studentName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{project.studentName}</div>
                          <div className="text-gray-600 text-xs">{project.school}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {project.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {project.difficulty}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-gray-900 text-xl leading-tight">{project.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{project.shortDescription}</p>
                      </div>

                      {/* Achievement */}
                      {project.achievement && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700 text-xs">
                            <Award className="h-3 w-3" />
                            <span className="font-semibold">{project.achievement}</span>
                          </div>
                        </div>
                      )}

                      {/* Quick Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {project.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Wrench className="h-4 w-4" />
                          {project.components.length} components
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <a href={project.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button size="sm" className="w-full bg-red-500 hover:bg-red-600 text-white">
                            <Youtube className="h-4 w-4 mr-1" />
                            Watch
                          </Button>
                        </a>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedProject(project)}
                        >
                          <Code className="h-4 w-4 mr-1" />
                          Code
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Section */}
      <section className="px-4 py-16 md:px-6 md:py-20 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl">
          {/* Header with Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                All <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Student Projects</span>
              </h2>
              <p className="text-gray-600 text-lg">Browse through projects created by students using our robotics components and kits</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search student projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:shadow-xl shadow-lg">
                <CardContent className="p-6">
                  {/* Student Info Header */}
                  <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded-lg">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                      {project.studentName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{project.studentName}</div>
                      <div className="text-gray-600 text-xs">{project.studentAge}</div>
                    </div>
                    {project.usesOurComponents && (
                      <Badge className="bg-amber-100 text-amber-700 text-xs">
                        <Package className="h-3 w-3 mr-1" />
                        Our Kit
                      </Badge>
                    )}
                  </div>

                  {/* Category and Difficulty */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {project.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {project.difficulty}
                    </Badge>
                  </div>

                  {/* Title and Description */}
                  <h3 className="font-bold text-gray-900 text-xl mb-2 leading-tight">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{project.shortDescription}</p>

                  {/* Components Preview */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.components.slice(0, 3).map((component, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {component}
                      </Badge>
                    ))}
                    {project.components.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.components.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {project.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {project.likes}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {project.duration}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <a href={project.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                        <Play className="h-4 w-4 mr-1" />
                        Watch Tutorial
                      </Button>
                    </a>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No student projects found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {selectedProject.category}
                    </Badge>
                    <Badge variant="outline">{selectedProject.difficulty}</Badge>
                    {selectedProject.featured && (
                      <Badge className="bg-amber-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{selectedProject.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedProject(null);
                    setActiveTab("overview");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>

              {/* Student Information */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white text-lg font-bold">
                    {selectedProject.studentName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{selectedProject.studentName}</h4>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>{selectedProject.studentAge}</span>
                      <span>{selectedProject.school}</span>
                      {selectedProject.achievement && (
                        <span className="text-green-600 font-semibold">🏆 {selectedProject.achievement}</span>
                      )}
                    </div>
                  </div>
                  {selectedProject.usesOurComponents && (
                    <Badge className="bg-amber-500 text-white px-3 py-1">
                      <Package className="h-4 w-4 mr-1" />
                      Built with Our Components
                    </Badge>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === "code"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setActiveTab("circuit")}
                  className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === "circuit"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Circuit Diagram
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Project Image */}
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Description */}
                  <div className="prose prose-lg">
                    <p className="text-gray-600 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  {/* Components Used from Us */}
                  {selectedProject.usesOurComponents && selectedProject.componentsFromUs && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-500" />
                        Components Used from Our Store
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.componentsFromUs.map((component, index) => (
                          <Badge key={index} className="bg-amber-100 text-amber-700 border-amber-200">
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Components */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-blue-500" />
                        Components Required
                      </h4>
                      <ul className="space-y-2">
                        {selectedProject.components.map((component, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {component}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Project Info */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Project Details
                      </h4>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-semibold">{selectedProject.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Difficulty:</span>
                          <Badge variant="outline">{selectedProject.difficulty}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <span className="font-semibold">{selectedProject.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Likes:</span>
                          <span className="font-semibold">{selectedProject.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Applications */}
                  {selectedProject.applications && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Applications</h4>
                      <p className="text-gray-600 leading-relaxed">{selectedProject.applications}</p>
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "code" && selectedProject.codeSnippet && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-900">Arduino Code Snippet</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedProject.codeSnippet!)}
                      className="flex items-center gap-2"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy Code"}
                    </Button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-gray-100 text-sm font-mono">
                      <code>{selectedProject.codeSnippet}</code>
                    </pre>
                  </div>
                  <div className="flex gap-4">
                    <a href={selectedProject.codeDownloadLink} className="flex-1">
                      <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                        <Download className="h-5 w-5 mr-2" />
                        Download Complete Code
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {activeTab === "circuit" && selectedProject.circuitConnections && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Circuit Connections</h4>
                    <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                      <pre className="text-gray-700 text-sm font-mono whitespace-pre-wrap">
                        {selectedProject.circuitConnections}
                      </pre>
                    </div>
                  </div>
                  
                  {/* Circuit Diagram Image */}
                  <div className="bg-gray-100 rounded-lg p-8 border-2 border-dashed border-gray-300 text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Circuit diagram would be displayed here</p>
                    <a href={selectedProject.circuitDiagramLink}>
                      <Button variant="outline" className="border-2 border-gray-300 hover:border-blue-500">
                        <Download className="h-4 w-4 mr-2" />
                        Download Circuit Diagram
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                <a href={selectedProject.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button size="lg" className="w-full bg-red-500 hover:bg-red-600 text-white">
                    <Youtube className="h-5 w-5 mr-2" />
                    Watch Video Tutorial
                  </Button>
                </a>
                <a href={selectedProject.instructionsLink} className="flex-1">
                  <Button size="lg" variant="outline" className="w-full border-2 border-gray-300 hover:border-blue-500">
                    <BookOpen className="h-5 w-5 mr-2" />
                    View Instructions
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-20 md:px-6 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="mx-auto max-w-4xl text-center relative">
          <GraduationCap className="h-16 w-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Build Your Own Project!
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get started with our robotics kits and components. Join hundreds of students who have created amazing projects with our support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store">
              <Button 
                size="lg"
                className="rounded-full bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                <Package className="mr-2 h-5 w-5" />
                SHOP COMPONENTS
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent px-10 py-4 text-lg font-semibold transition-all duration-200"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                JOIN COURSES
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}