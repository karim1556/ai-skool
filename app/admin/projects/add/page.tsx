"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  Upload,
  BookOpen,
  Code,
  Cpu,
  GraduationCap,
  Package,
  Award
} from 'lucide-react';

export default function AddProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Arduino',
    difficulty: 'Beginner',
    duration: '2-3 hours',
    image: '/images/placeholder.svg',
    youtubeLink: '',
    codeDownloadLink: '',
    circuitDiagramLink: '',
    instructionsLink: '',
    views: '0',
    likes: '0',
    featured: false,
    tags: [] as string[],
    components: [] as string[],
    codeSnippet: '',
    circuitConnections: '',
    applications: '',
    studentName: '',
    studentAge: '',
    school: '',
    usesOurComponents: false,
    componentsFromUs: [] as string[],
    achievement: ''
  });

  const [newTag, setNewTag] = useState('');
  const [newComponent, setNewComponent] = useState('');
  const [newOurComponent, setNewOurComponent] = useState('');

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Tag management
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  // Component management
  const addComponent = () => {
    if (newComponent.trim() && !formData.components.includes(newComponent.trim())) {
      handleChange('components', [...formData.components, newComponent.trim()]);
      setNewComponent('');
    }
  };

  const removeComponent = (componentToRemove: string) => {
    handleChange('components', formData.components.filter(comp => comp !== componentToRemove));
  };

  // Our Components management
  const addOurComponent = () => {
    if (newOurComponent.trim() && !formData.componentsFromUs.includes(newOurComponent.trim())) {
      handleChange('componentsFromUs', [...formData.componentsFromUs, newOurComponent.trim()]);
      setNewOurComponent('');
    }
  };

  const removeOurComponent = (componentToRemove: string) => {
    handleChange('componentsFromUs', formData.componentsFromUs.filter(comp => comp !== componentToRemove));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        const newId = data?.project?.id ?? data?.id ?? null;
        if (newId) {
          // Redirect to the public project page
          router.push(`/projects/${newId}`);
        } else {
          router.push('/admin/projects');
        }
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function uploadFile(file: File | null) {
    if (!file) return null
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/projects/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        console.error('Upload failed')
        return null
      }
      const data = await res.json()
      return data?.url || null
    } catch (err) {
      console.error('Upload error', err)
      return null
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add Student Project</h1>
        <Button variant="outline" onClick={() => router.push('/admin/projects')}>
          Back to Projects
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Project Title *</label>
                <input 
                  value={formData.title} 
                  onChange={(e) => handleChange('title', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g., Obstacle Avoiding Robot"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Category *</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => handleChange('category', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                >
                  <option value="Arduino">Arduino</option>
                  <option value="IoT">IoT</option>
                  <option value="Robotics">Robotics</option>
                  <option value="AI">AI</option>
                  <option value="Raspberry Pi">Raspberry Pi</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Difficulty Level *</label>
                <select 
                  value={formData.difficulty} 
                  onChange={(e) => handleChange('difficulty', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Duration *</label>
                <input 
                  value={formData.duration} 
                  onChange={(e) => handleChange('duration', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g., 2-3 hours"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium">Short Description *</label>
                <input 
                  value={formData.shortDescription} 
                  onChange={(e) => handleChange('shortDescription', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="Brief description for project cards"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium">Project Image</label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const f = e.target.files ? e.target.files[0] : null
                  const url = await uploadFile(f)
                  if (url) handleChange('image', url)
                }} />
                {formData.image && (
                  <img src={formData.image} alt="preview" className="mt-2 max-h-40" />
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium">Circuit Diagram</label>
                <input type="file" accept="image/*,application/pdf" onChange={async (e) => {
                  const f = e.target.files ? e.target.files[0] : null
                  const url = await uploadFile(f)
                  if (url) handleChange('circuitDiagramLink', url)
                }} />
                {formData.circuitDiagramLink && (
                  <a href={formData.circuitDiagramLink} target="_blank" rel="noreferrer" className="text-blue-600">View diagram</a>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium">Full Description *</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => handleChange('description', e.target.value)} 
                  className="w-full border rounded-lg p-3 h-32"
                  placeholder="Detailed project description"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Information Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Student Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Student Name *</label>
                <input 
                  value={formData.studentName} 
                  onChange={(e) => handleChange('studentName', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g., Rahul Sharma"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Student Age</label>
                <input 
                  value={formData.studentAge} 
                  onChange={(e) => handleChange('studentAge', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g., 14 years"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">School/Institution</label>
                <input 
                  value={formData.school} 
                  onChange={(e) => handleChange('school', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g., Delhi Public School"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="block text-sm font-medium">Achievement/Award</label>
                <input 
                  value={formData.achievement} 
                  onChange={(e) => handleChange('achievement', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g., Winner - School Science Fair 2024"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components & Tags Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Components & Tags
            </h2>
            
            {/* Components */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Required Components</label>
                <div className="flex gap-2">
                  <input 
                    value={newComponent} 
                    onChange={(e) => setNewComponent(e.target.value)}
                    className="flex-1 border rounded-lg p-3"
                    placeholder="e.g., Arduino Uno"
                  />
                  <Button type="button" onClick={addComponent}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.components.map((component, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {component}
                      <button type="button" onClick={() => removeComponent(component)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Our Components */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.usesOurComponents}
                    onChange={(e) => handleChange('usesOurComponents', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm font-medium">Uses Our Components</label>
                </div>
                
                {formData.usesOurComponents && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        value={newOurComponent} 
                        onChange={(e) => setNewOurComponent(e.target.value)}
                        className="flex-1 border rounded-lg p-3"
                        placeholder="e.g., Arduino Starter Kit"
                      />
                      <Button type="button" onClick={addOurComponent}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.componentsFromUs.map((component, index) => (
                        <Badge key={index} className="bg-amber-100 text-amber-700 flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {component}
                          <button type="button" onClick={() => removeOurComponent(component)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Project Tags</label>
                <div className="flex gap-2">
                  <input 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 border rounded-lg p-3"
                    placeholder="e.g., Robotics, Arduino, Autonomous"
                  />
                  <Button type="button" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Technical Details
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Code Snippet</label>
                <textarea 
                  value={formData.codeSnippet} 
                  onChange={(e) => handleChange('codeSnippet', e.target.value)} 
                  className="w-full border rounded-lg p-3 h-48 font-mono text-sm"
                  placeholder="Paste Arduino/C++ code here..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Circuit Connections</label>
                <textarea 
                  value={formData.circuitConnections} 
                  onChange={(e) => handleChange('circuitConnections', e.target.value)} 
                  className="w-full border rounded-lg p-3 h-32 font-mono text-sm"
                  placeholder="Describe circuit connections..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Applications</label>
                <textarea 
                  value={formData.applications} 
                  onChange={(e) => handleChange('applications', e.target.value)} 
                  className="w-full border rounded-lg p-3 h-24"
                  placeholder="Describe real-world applications..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media & Links Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Media & Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Project Image URL</label>
                <input 
                  value={formData.image} 
                  onChange={(e) => handleChange('image', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="/images/project-name.jpg"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">YouTube Video Link</label>
                <input 
                  value={formData.youtubeLink} 
                  onChange={(e) => handleChange('youtubeLink', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Code Download Link</label>
                <input 
                  value={formData.codeDownloadLink} 
                  onChange={(e) => handleChange('codeDownloadLink', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="Link to download complete code"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Circuit Diagram Link</label>
                <input 
                  value={formData.circuitDiagramLink} 
                  onChange={(e) => handleChange('circuitDiagramLink', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="Link to circuit diagram"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Instructions Link</label>
                <input 
                  value={formData.instructionsLink} 
                  onChange={(e) => handleChange('instructionsLink', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="Link to detailed instructions"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Views Count</label>
                <input 
                  value={formData.views} 
                  onChange={(e) => handleChange('views', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g., 44,000"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Likes Count</label>
                <input 
                  value={formData.likes} 
                  onChange={(e) => handleChange('likes', e.target.value)} 
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g., 43,000"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="rounded"
                />
                <label className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Featured Project
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end pt-6 border-t">
          <Button 
            type="submit" 
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            {submitting ? 'Creating Project...' : 'Create Project'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/admin/projects')}
            className="px-8 py-3"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}