"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  Briefcase,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  FileText,
  Linkedin,
  Github,
  ExternalLink
} from "lucide-react";
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
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  duration: string;
  stipend: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
};

type ApplicationFormData = {
  selectedInternshipId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    portfolio: string;
    linkedin: string;
    github: string;
  };
  education: {
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
    cgpa: string;
  };
  experience: {
    resume: File | null;
    coverLetter: string;
    skills: string;
    projects: string;
    whyInterested: string;
  };
};

export default function InternshipApplicationPage() {
  const router = useRouter();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>({
    selectedInternshipId: "",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      portfolio: "",
      linkedin: "",
      github: "",
    },
    education: {
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
      cgpa: "",
    },
    experience: {
      resume: null,
      coverLetter: "",
      skills: "",
      projects: "",
      whyInterested: "",
    },
  });

  const selectedInternship = internships.find(internship => internship.id === formData.selectedInternshipId);

  useEffect(() => {
    // Load internships data
    const loadInternships = async () => {
      try {
        const res = await fetch('/api/internships', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setInternships(data.internships || []);
        } else {
          // Fallback to static data
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

  const handleInputChange = (section: keyof ApplicationFormData, field: string, value: any) => {
    setFormData(prev => {
      // selectedInternshipId is a top-level string (not an object) so handle it separately
      if (section === "selectedInternshipId") {
        return {
          ...prev,
          selectedInternshipId: value,
        };
      }

      // For nested object sections cast to a generic record so we can safely spread
      return {
        ...prev,
        [section]: {
          ...(prev[section] as Record<string, any>),
          [field]: value,
        },
      };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleInputChange('experience', 'resume', file);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Upload resume if present
      let resumeUrl: string | null = null
      if (formData.experience.resume) {
        const fd = new FormData()
        fd.append('file', formData.experience.resume)
        const up = await fetch('/api/upload', { method: 'POST', body: fd })
        if (up.ok) {
          const upJson = await up.json()
          resumeUrl = upJson.url || null
        } else {
          console.warn('Resume upload failed')
        }
      }

      // 2. Build payload
      const payload = {
        selectedInternshipId: formData.selectedInternshipId,
        fullName: formData.personalInfo.fullName,
        email: formData.personalInfo.email,
        phone: formData.personalInfo.phone,
        location: formData.personalInfo.location,
        portfolio: formData.personalInfo.portfolio,
        linkedin: formData.personalInfo.linkedin,
        github: formData.personalInfo.github,
        institution: formData.education.institution,
        degree: formData.education.degree,
        field: formData.education.field,
        graduationYear: formData.education.graduationYear,
        cgpa: formData.education.cgpa,
        resumeUrl,
        coverLetter: formData.experience.coverLetter,
        skills: formData.experience.skills,
        projects: formData.experience.projects,
        whyInterested: formData.experience.whyInterested,
      }

      const res = await fetch('/api/internship-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error('Application submit failed', err)
        // show basic alert for now
        alert('Failed to submit application. Please try again later.')
        return
      }

      const js = await res.json()
      if (js?.success) {
        router.push('/internships/apply/success')
      } else {
        alert('Failed to submit application. Please try again later.')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.selectedInternshipId !== "";
      case 2:
        return (
          formData.personalInfo.fullName.trim() !== "" &&
          formData.personalInfo.email.trim() !== "" &&
          formData.personalInfo.phone.trim() !== "" &&
          formData.personalInfo.location.trim() !== ""
        );
      case 3:
        return (
          formData.education.institution.trim() !== "" &&
          formData.education.degree.trim() !== "" &&
          formData.education.graduationYear.trim() !== ""
        );
      case 4:
        return (
          formData.experience.resume !== null &&
          formData.experience.skills.trim() !== "" &&
          formData.experience.whyInterested.trim() !== ""
        );
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-lg text-gray-600">Loading application form...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/internships">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Internships
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Apply for Internship</h1>
                <p className="text-gray-600">Complete your application in a few simple steps</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Step {currentStep} of 4
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Select Role</span>
            <span>Personal Info</span>
            <span>Education</span>
            <span>Experience</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Internship Selection */}
          {currentStep === 1 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
                  Select Internship Role
                </CardTitle>
                <p className="text-gray-600">Choose the internship position you want to apply for</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="internship">Available Internships</Label>
                  <Select
                    value={formData.selectedInternshipId}
                    onValueChange={(value) => handleInputChange('selectedInternshipId', '', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an internship..." />
                    </SelectTrigger>
                    <SelectContent>
                      {internships.map((internship) => (
                        <SelectItem key={internship.id} value={internship.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{internship.title}</span>
                            <span className="text-sm text-gray-600">
                              {internship.company} • {internship.location}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedInternship && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="font-medium">Company:</span>
                            <span className="ml-2">{selectedInternship.company}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="font-medium">Location:</span>
                            <span className="ml-2">{selectedInternship.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="font-medium">Duration:</span>
                            <span className="ml-2">{selectedInternship.duration}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="font-medium">Type:</span>
                            <span className="ml-2 capitalize">{selectedInternship.type}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="font-medium">Stipend:</span>
                            <span className="ml-2">{selectedInternship.stipend}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="font-medium">Level:</span>
                            <span className="ml-2 capitalize">{selectedInternship.level}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <User className="h-6 w-6 mr-2 text-green-600" />
                  Personal Information
                </CardTitle>
                <p className="text-gray-600">Tell us about yourself</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.personalInfo.fullName}
                      onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Current Location *</Label>
                    <Input
                      id="location"
                      value={formData.personalInfo.location}
                      onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                      placeholder="City, State"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">
                      <ExternalLink className="h-4 w-4 inline mr-1" />
                      Portfolio Website
                    </Label>
                    <Input
                      id="portfolio"
                      type="url"
                      value={formData.personalInfo.portfolio}
                      onChange={(e) => handleInputChange('personalInfo', 'portfolio', e.target.value)}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">
                      <Linkedin className="h-4 w-4 inline mr-1" />
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={formData.personalInfo.linkedin}
                      onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">
                      <Github className="h-4 w-4 inline mr-1" />
                      GitHub Profile
                    </Label>
                    <Input
                      id="github"
                      type="url"
                      value={formData.personalInfo.github}
                      onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Education */}
          {currentStep === 3 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <GraduationCap className="h-6 w-6 mr-2 text-purple-600" />
                  Education Details
                </CardTitle>
                <p className="text-gray-600">Tell us about your educational background</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution *</Label>
                    <Input
                      id="institution"
                      value={formData.education.institution}
                      onChange={(e) => handleInputChange('education', 'institution', e.target.value)}
                      placeholder="University or College Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree *</Label>
                    <Input
                      id="degree"
                      value={formData.education.degree}
                      onChange={(e) => handleInputChange('education', 'degree', e.target.value)}
                      placeholder="e.g., B.Tech, B.Sc, etc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field">Field of Study</Label>
                    <Input
                      id="field"
                      value={formData.education.field}
                      onChange={(e) => handleInputChange('education', 'field', e.target.value)}
                      placeholder="e.g., Computer Science, Electrical Engineering"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Expected Graduation Year *</Label>
                    <Input
                      id="graduationYear"
                      value={formData.education.graduationYear}
                      onChange={(e) => handleInputChange('education', 'graduationYear', e.target.value)}
                      placeholder="e.g., 2024"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">CGPA / Percentage</Label>
                    <Input
                      id="cgpa"
                      value={formData.education.cgpa}
                      onChange={(e) => handleInputChange('education', 'cgpa', e.target.value)}
                      placeholder="e.g., 8.5 or 85%"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Experience & Skills */}
          {currentStep === 4 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <FileText className="h-6 w-6 mr-2 text-orange-600" />
                  Experience & Skills
                </CardTitle>
                <p className="text-gray-600">Share your experience and why you're interested</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resume">Upload Resume *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label htmlFor="resume" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <div className="text-sm text-gray-600">
                        {formData.experience.resume 
                          ? `Selected: ${formData.experience.resume.name}`
                          : "Click to upload resume (PDF, DOC, DOCX)"
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Max file size: 5MB</div>
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Technical Skills *</Label>
                  <Textarea
                    id="skills"
                    value={formData.experience.skills}
                    onChange={(e) => handleInputChange('experience', 'skills', e.target.value)}
                    placeholder="List your technical skills (e.g., JavaScript, Python, React, Machine Learning, etc.)"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projects">Projects & Experience</Label>
                  <Textarea
                    id="projects"
                    value={formData.experience.projects}
                    onChange={(e) => handleInputChange('experience', 'projects', e.target.value)}
                    placeholder="Describe your relevant projects, work experience, or contributions..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whyInterested">Why are you interested in this internship? *</Label>
                  <Textarea
                    id="whyInterested"
                    value={formData.experience.whyInterested}
                    onChange={(e) => handleInputChange('experience', 'whyInterested', e.target.value)}
                    placeholder="Explain why you're interested in this specific internship and what you hope to achieve..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                  <Textarea
                    id="coverLetter"
                    value={formData.experience.coverLetter}
                    onChange={(e) => handleInputChange('experience', 'coverLetter', e.target.value)}
                    placeholder="Add any additional information you'd like to share..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isStepValid() || submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </form>

        {/* Application Summary Sidebar */}
        {selectedInternship && (
          <Card className="mt-8 border-0 shadow-lg bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-gray-900">{selectedInternship.title}</div>
                  <div className="text-sm text-gray-600">{selectedInternship.company}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Location:</span>
                    <div>{selectedInternship.location}</div>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <div className="capitalize">{selectedInternship.type}</div>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <div>{selectedInternship.duration}</div>
                  </div>
                  <div>
                    <span className="font-medium">Stipend:</span>
                    <div>{selectedInternship.stipend}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Static internships data (same as in the main page)
const staticInternships: Internship[] = [
  {
    id: "1",
    title: "Frontend Development Intern",
    company: "TechInnovate Solutions",
    location: "Remote",
    type: "remote",
    duration: "3 months",
    stipend: "₹25,000/month",
    category: "development",
    level: "intermediate"
  },
  {
    id: "2",
    title: "AI/ML Research Intern",
    company: "NeuralPatterns AI",
    location: "Bangalore",
    type: "full-time",
    duration: "6 months",
    stipend: "₹35,000/month",
    category: "ai-ml",
    level: "advanced"
  },
  {
    id: "3",
    title: "Robotics Software Intern",
    company: "AutoBot Systems",
    location: "Pune",
    type: "full-time",
    duration: "4 months",
    stipend: "₹30,000/month",
    category: "robotics",
    level: "intermediate"
  },
  {
    id: "4",
    title: "Backend Development Intern",
    company: "CloudScale Technologies",
    location: "Hyderabad",
    type: "full-time",
    duration: "3 months",
    stipend: "₹28,000/month",
    category: "development",
    level: "intermediate"
  },
  {
    id: "5",
    title: "Data Science Intern",
    company: "DataInsights Pro",
    location: "Remote",
    type: "remote",
    duration: "4 months",
    stipend: "₹32,000/month",
    category: "data-science",
    level: "intermediate"
  },
  {
    id: "6",
    title: "UI/UX Design Intern",
    company: "DesignCraft Studio",
    location: "Mumbai",
    type: "part-time",
    duration: "3 months",
    stipend: "₹20,000/month",
    category: "design",
    level: "beginner"
  },
  {
    id: "7",
    title: "Mobile App Development Intern",
    company: "AppVenture Mobile",
    location: "Delhi",
    type: "full-time",
    duration: "4 months",
    stipend: "₹26,000/month",
    category: "development",
    level: "intermediate"
  },
  {
    id: "8",
    title: "Computer Vision Intern",
    company: "VisionTech AI",
    location: "Bangalore",
    type: "full-time",
    duration: "6 months",
    stipend: "₹38,000/month",
    category: "ai-ml",
    level: "advanced"
  },
  {
    id: "9",
    title: "DevOps Engineering Intern",
    company: "InfraScale Cloud",
    location: "Remote",
    type: "remote",
    duration: "3 months",
    stipend: "₹30,000/month",
    category: "development",
    level: "intermediate"
  },
  {
    id: "10",
    title: "Game Development Intern",
    company: "Playful Studios",
    location: "Chennai",
    type: "part-time",
    duration: "4 months",
    stipend: "₹22,000/month",
    category: "development",
    level: "beginner"
  },
  {
    id: "11",
    title: "NLP Engineering Intern",
    company: "LinguaTech AI",
    location: "Remote",
    type: "remote",
    duration: "5 months",
    stipend: "₹34,000/month",
    category: "ai-ml",
    level: "advanced"
  },
  {
    id: "12",
    title: "Web Design Intern",
    company: "PixelPerfect Digital",
    location: "Gurgaon",
    type: "part-time",
    duration: "2 months",
    stipend: "₹18,000/month",
    category: "design",
    level: "beginner"
  }
];