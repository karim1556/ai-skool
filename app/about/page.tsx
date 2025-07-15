"use client"


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Breadcrumb */}
      <div className="bg-gray-800 text-white px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm">
            <span className="text-gray-300">Home</span>
            <span className="mx-2">/</span>
            <span>About us</span>
          </nav>
          <h1 className="text-2xl font-bold mt-2">About us</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us :-</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Kodable Education is an innovation hub of STEAM education since 2010. Kodable Education provides One-stop
            Educational Solutions from primary schools to secondary schools, vocational schools, K-12 and engineering
            students. Kodable Education aims to build functional literacy in students and empowers them with the 21st
            Century skills. The goal is to increase primary and high school students' motivation to excel in math and
            science and better prepare them for college careers in Engineering, Pre-Med, Computer Science and Education
            through hands-on learning experiences building and programming educational games and apps.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Kodable Education features a fusion of mechanics, electronics and programming. It provides the core platform
            for schools, and enables the possibilities to include various platforms. We use interdisciplinary and
            experiential learning approach to teach Design and Creative Thinking, Visual Communication, Technology and
            Digital Skills.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            Our objective is to prepare every student from Consumer to Creator, Problem Mindset to Solution Mindset and
            a Doing Mind to Thinking Mind and in the process, obtain their overall physical, social, emotional, moral
            and creative development.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision :-</h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            To be recognized globally for bringing innovative learning through artificial intelligence in education and
            contributing to the society by making learning accessible to all children for overall development.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission :-</h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Kodable Education provides challenging learning environment that inspires young minds to apply and sharpen
            their science, technology, engineering, and math skills with problem based learning.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Methodology :-</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            At Kodable Education, we believe in learning by doing. Our methodology is built around hands-on experiences
            that engage students in active learning. We combine traditional educational approaches with modern
            technology to create an immersive learning environment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-sky-600 mb-4">Interactive Learning</h3>
              <p className="text-gray-600">
                Students engage with educational content through interactive games, simulations, and hands-on projects
                that make learning fun and memorable.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-purple-600 mb-4">Problem-Based Approach</h3>
              <p className="text-gray-600">
                We present real-world challenges that require students to apply their knowledge and develop critical
                thinking skills to find solutions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-green-600 mb-4">Collaborative Environment</h3>
              <p className="text-gray-600">
                Students work together in teams, fostering communication skills and learning from each other's
                perspectives and experiences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-orange-600 mb-4">Personalized Learning</h3>
              <p className="text-gray-600">
                Our adaptive learning platform adjusts to each student's pace and learning style, ensuring optimal
                educational outcomes for every child.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
