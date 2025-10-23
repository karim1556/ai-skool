"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'

export default function NewCampPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tagline: '',
    longDescription: '',
    grade: '',
    duration: '1 Week',
    schedule: 'Mon-Fri, 2 hours daily',
    level: 'Beginner',
    format: 'Live Online',
    subjects: [] as string[],
    price: '0',
    originalPrice: '0',
    popular: false,
    featured: false,
    seats: '20',
    rating: '4.5',
    projects: '3',
    emoji: '🚀',
    skills: [] as string[],
    category: 'coding'
  })
  const [startDate, setStartDate] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [highlightsText, setHighlightsText] = useState('')
  const [highlights, setHighlights] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')

  const campCategories = [
    { id: 'coding', name: 'Coding Camps' },
    { id: 'ai', name: 'AI & Machine Learning' },
    { id: 'robotics', name: 'Robotics & Arduino' },
    { id: 'game-dev', name: 'Game Development' },
    { id: 'web-dev', name: 'Web Development' },
    { id: 'python', name: 'Python Programming' }
  ]

  const gradeLevels = ['Grades K-2', 'Grades 3-5', 'Grades 4-6', 'Grades 5-8', 'Grades 6-9', 'Grades 7-12', 'Grades 9-12']
  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced']
  const formats = ['Live Online', 'Hybrid', 'In-Person', 'Live Online + Kit']
  const durations = ['4 Days', '1 Week', '2 Weeks', '3 Weeks', '4 Weeks']

  async function uploadFile(file: File | null) {
    if (!file) return null
    const fd = new FormData()
    fd.append('file', file)
    // Prefer the 'course-thumbnails' bucket for camp images
    fd.append('bucket', 'course-thumbnails')
    const res = await fetch('/api/projects/upload', { method: 'POST', body: fd })
    if (!res.ok) return null
    const js = await res.json()
    return js.url || null
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addHighlight = () => {
    const v = highlightsText.trim()
    if (!v) return
    if (!highlights.includes(v)) setHighlights(prev => [...prev, v])
    setHighlightsText('')
  }

  const removeHighlight = (h: string) => {
    setHighlights(prev => prev.filter(x => x !== h))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // validate start date is not in the past
    if (startDate) {
      const sd = new Date(startDate)
      const today = new Date()
      today.setHours(0,0,0,0)
      if (sd < today) {
        alert('Start date cannot be in the past')
        return
      }
    }
    setSaving(true)
    try {
      const imageUrl = await uploadFile(imageFile)
      // compute weeks array from startDate and duration (duration like '1 Week' or '4 Days')
      const weeks: string[] = []
      if (startDate) {
        const sd = new Date(startDate)
        // We'll push the start ISO (yyyy-mm-dd) as the week identifier for now
        weeks.push(sd.toISOString().slice(0,10))
      }
      const highlightsArr = highlights.length ? highlights : (highlightsText
        ? highlightsText.split(/\r?\n|,\s*/).map(h => h.trim()).filter(Boolean)
        : [])
      const payload = { 
        ...formData, 
        tagline: formData.tagline || null,
        longDescription: formData.longDescription || null,
        video: videoUrl || null,
        highlights: highlightsArr,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        rating: Number(formData.rating),
        projects: Number(formData.projects),
        seats: Number(formData.seats),
        image: imageUrl,
        createdAt: new Date().toISOString(),
        weeks
      }
      const res = await fetch('/api/camps', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      })
      if (res.ok) router.push('/admin/camps')
      else alert('Failed to create camp')
    } catch (error) {
      alert('Error creating camp')
    } finally { 
      setSaving(false) 
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Camp</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-lg p-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Camp Title *</label>
            <input 
              value={formData.title} 
              onChange={(e) => handleInputChange('title', e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select 
              value={formData.category} 
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {campCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea 
            value={formData.description} 
            onChange={(e) => handleInputChange('description', e.target.value)} 
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
          <input
            value={formData.tagline}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Long Description (for detail page)</label>
          <textarea
            value={formData.longDescription}
            onChange={(e) => handleInputChange('longDescription', e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
          <div className="flex gap-2 mb-2">
            <input
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              placeholder="Add a highlight"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight() } }}
            />
            <button type="button" onClick={() => addHighlight()} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {highlights.map(h => (
              <span key={h} className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                {h}
                <button type="button" onClick={() => removeHighlight(h)} className="text-gray-500 hover:text-gray-800">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Grade & Level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level *</label>
            <select 
              value={formData.grade} 
              onChange={(e) => handleInputChange('grade', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Grade Level</option>
              {gradeLevels.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level *</label>
            <select 
              value={formData.level} 
              onChange={(e) => handleInputChange('level', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format *</label>
            <select 
              value={formData.format} 
              onChange={(e) => handleInputChange('format', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {formats.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
            <select 
              value={formData.duration} 
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {durations.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule *</label>
            <input 
              value={formData.schedule} 
              onChange={(e) => handleInputChange('schedule', e.target.value)} 
              placeholder="e.g., Mon-Fri, 2 hours daily"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value || null)}
              min={new Date().toISOString().slice(0,10)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (₹) *</label>
            <input 
              type="number" 
              value={formData.price} 
              onChange={(e) => handleInputChange('price', e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
            <input 
              type="number" 
              value={formData.originalPrice} 
              onChange={(e) => handleInputChange('originalPrice', e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Seats</label>
            <input 
              type="number" 
              value={formData.seats} 
              onChange={(e) => handleInputChange('seats', e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Skills & Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills Learned</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button 
                  type="button" 
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="5"
                value={formData.rating} 
                onChange={(e) => handleInputChange('rating', e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
              <input 
                type="number" 
                value={formData.projects} 
                onChange={(e) => handleInputChange('projects', e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
            <input 
              value={formData.emoji} 
              onChange={(e) => handleInputChange('emoji', e.target.value)} 
              placeholder="e.g., 🚀, 🤖, 🎮"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={formData.popular} 
                onChange={(e) => handleInputChange('popular', e.target.checked)} 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
            </label>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={formData.featured} 
                onChange={(e) => handleInputChange('featured', e.target.checked)} 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Camp Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">Recommended: 800x600px or similar aspect ratio</p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6 border-t">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? 'Creating Camp...' : 'Create Camp'}
          </button>
          <button 
            type="button" 
            onClick={() => router.push('/admin/camps')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
        </div>
        </form>
      </div>
    </AdminLayout>
  )
}