"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditCampPage() {
  const params = useParams()
  const id = params?.id
  const router = useRouter()
  const [camp, setCamp] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState('')

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

  useEffect(() => {
    if (!id) return
    fetch(`/api/camps/${id}`).then(r => r.json()).then(js => {
      const campData = js.camp || null
      if (campData) {
        // Ensure arrays are properly initialized
        setCamp({
          ...campData,
          subjects: campData.subjects || [],
          skills: campData.skills || []
        })
        if (campData.weeks && Array.isArray(campData.weeks) && campData.weeks[0]) {
          setStartDate(String(campData.weeks[0]))
        }
      }
    })
  }, [id])

  async function uploadFile(file: File | null) {
    if (!file) return null
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/projects/upload', { method: 'POST', body: fd })
    if (!res.ok) return null
    const js = await res.json()
    return js.url || null
  }

  const handleInputChange = (field: string, value: any) => {
    setCamp((prev: any) => prev ? { ...prev, [field]: value } : null)
  }

  const addSkill = () => {
    if (newSkill.trim() && camp && !camp.skills.includes(newSkill.trim())) {
      setCamp((prev: { skills: any }) => prev ? {
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      } : null)
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setCamp((prev: { skills: any[] }) => prev ? {
      ...prev,
      skills: prev.skills.filter((s: string) => s !== skill)
    } : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!camp) return
    setSaving(true)
    try {
      const imageUrl = imageFile ? await uploadFile(imageFile) : camp.image
      const weeks: string[] = camp.weeks || []
      if (startDate) {
        weeks[0] = startDate
      }
      const payload = { 
        ...camp,
        image: imageUrl,
        weeks
      }
      const res = await fetch(`/api/camps/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      })
      if (res.ok) router.push('/admin/camps')
      else alert('Failed to update camp')
    } catch (error) {
      alert('Error updating camp')
    } finally { 
      setSaving(false) 
    }
  }

  if (!camp) return (
    <div className="p-6 flex justify-center items-center min-h-64">
      <div className="text-lg text-gray-600">Loading camp data...</div>
    </div>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Camp</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-lg p-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Camp Title *</label>
            <input 
              value={camp.title || ''} 
              onChange={(e) => handleInputChange('title', e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select 
              value={camp.category || 'coding'} 
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
            value={camp.description || ''} 
            onChange={(e) => handleInputChange('description', e.target.value)} 
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Grade & Level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level *</label>
            <select 
              value={camp.grade || ''} 
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
              value={camp.level || 'Beginner'} 
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
              value={camp.format || 'Live Online'} 
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
              value={camp.duration || '1 Week'} 
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
              value={camp.schedule || ''} 
              onChange={(e) => handleInputChange('schedule', e.target.value)} 
              placeholder="e.g., Mon-Fri, 2 hours daily"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (₹) *</label>
            <input 
              type="number" 
              value={camp.price || 0} 
              onChange={(e) => handleInputChange('price', Number(e.target.value))} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
            <input 
              type="number" 
              value={camp.originalPrice || 0} 
              onChange={(e) => handleInputChange('originalPrice', Number(e.target.value))} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Seats</label>
            <input 
              type="number" 
              value={camp.seats || 20} 
              onChange={(e) => handleInputChange('seats', Number(e.target.value))} 
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
                {(camp.skills || []).map((skill: string) => (
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
                value={camp.rating || 4.5} 
                onChange={(e) => handleInputChange('rating', Number(e.target.value))} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Projects</label>
              <input 
                type="number" 
                value={camp.projects || 3} 
                onChange={(e) => handleInputChange('projects', Number(e.target.value))} 
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
              value={camp.emoji || '🚀'} 
              onChange={(e) => handleInputChange('emoji', e.target.value)} 
              placeholder="e.g., 🚀, 🤖, 🎮"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={camp.popular || false} 
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
                checked={camp.featured || false} 
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
          {camp.image && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Current Image:</p>
              <div className="w-32 h-24 border rounded-lg overflow-hidden">
                <img 
                  src={camp.image} 
                  alt="Current camp" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-1">Recommended: 800x600px or similar aspect ratio</p>
        </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate || ''}
                    onChange={(e) => setStartDate(e.target.value || null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6 border-t">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? 'Updating Camp...' : 'Update Camp'}
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
  )
}