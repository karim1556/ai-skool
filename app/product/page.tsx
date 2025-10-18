
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Star,
  CheckCircle,
  ArrowRight,
  Heart,
  Share2,
  ShoppingCart,
  Filter,
  Grid,
  List,
  ChevronDown,
  Search,
  Truck,
  Shield,
  RotateCcw,
  Sparkles,
  Award,
  Users,
  Clock,
  BookOpen,
  Zap,
  X,
  Eye,
  TrendingUp,
  Clock4,
  Tag,
  Calendar,
  MapPin,
  Video,
  Download,
  Package,
  Cog,
  MessageCircle,
  Crown,
  Gem,
  Rocket,
  Brain,
  Atom,
  Calculator,
  Loader2,
  AlertCircle,
  Play,
  Pause,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { Bebas_Neue } from "next/font/google";
import { useCart } from "@/hooks/use-cart";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Load condensed font
const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

// Add the missing useDebounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface Product {
  id: number;
  slug?: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isBestSeller: boolean;
  isNew: boolean;
  inStock: boolean;
  features: string[];
  delivery: string;
  level: string;
  instructor?: string;
  duration?: string;
  students?: number;
  tags: string[];
  discount?: number;
  videoPreview?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    }
  }
};

const fadeInUp = {
  initial: { y: 60, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ProductsPage() {
  const { addItem } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const [products, setProducts] = useState<Product[]>([])
  const [priceMax, setPriceMax] = useState<number>(1000)

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load products with better error handling
  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    
    fetch('/api/products')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load products: ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (!mounted) return
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received')
        }

        // Map DB fields to UI Product shape
        const mapped = data.map((p: any) => ({
          id: p.id,
          // preserve slug if present, otherwise generate from name
          slug: p.slug || (p.name ? String(p.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') : ''),
          name: p.name || 'Unnamed Product',
          description: p.description || p.tagline || 'No description available',
          price: Number(p.price) || 0,
          originalPrice: Number(p.original_price) || Number(p.originalPrice) || 0,
          rating: Math.min(5, Math.max(0, Number(p.rating) || 0)),
          reviews: Math.max(0, Number(p.reviews) || 0),
          image: p.image || p.hero_image || '/placeholder.svg',
          category: p.category || 'Uncategorized',
          isBestSeller: !!p.is_best_seller || !!p.isBestSeller,
          isNew: !!p.is_new || !!p.isNew,
          inStock: p.in_stock === undefined ? true : !!p.in_stock,
          features: Array.isArray(p.features) ? p.features : (p.features ? JSON.parse(p.features) : []),
          delivery: p.delivery || 'Instant',
          level: p.level || 'All Levels',
          instructor: p.instructor || p.instructor_name,
          duration: p.duration || undefined,
          students: p.students || undefined,
          tags: Array.isArray(p.tags) ? p.tags : (p.tags ? JSON.parse(p.tags) : []),
          discount: p.discount || 0,
          videoPreview: p.video_preview || p.videoPreview || undefined,
        }))

        // Normalize category and level strings
        const normalized = mapped.map((p: any) => {
          const cat = (p.category || 'Uncategorized').toString().trim()
          const catName = cat.split(/\s+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
          const levelRaw = (p.level || 'All Levels').toString().trim()
          const levelName = levelRaw.split(/\s+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
          return { ...p, category: catName, level: levelName }
        })

        setProducts(normalized)
        
        // Calculate dynamic price range
        const maxPrice = normalized.reduce((m: number, p: any) => Math.max(m, Number(p.price) || 0), 0)
        const upper = Math.max(1000, Math.ceil(maxPrice * 1.1)) // Add 10% buffer
        setPriceMax(upper)
        setPriceRange((prev) => prev[1] === 10000 ? [0, upper] : prev)
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          console.error('Failed to load products:', err)
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
      
    return () => { mounted = false }
  }, [])

  // Memoized computed values
  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1 })
    return PRODUCT_CATEGORIES.map((name) => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name, count: counts[name] || 0 }))
  }, [products])

  const levels = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach(p => { 
      const lvl = p.level || 'All Levels'; 
      counts[lvl] = (counts[lvl] || 0) + 1 
    })
    return Object.keys(counts).map((k) => ({ 
      id: k.toLowerCase().replace(/\s+/g, '-'), 
      name: k, 
      count: counts[k], 
      icon: k.toLowerCase().includes('beginner') ? Rocket : 
            k.toLowerCase().includes('advanced') ? Crown : TrendingUp 
    }))
  }, [products])


  const allTags = useMemo(() => 
    Array.from(new Set(products.flatMap(p => p.tags))).slice(0, 12), 
    [products]
  )

  // Filter and sort products with useMemo for performance
  const filteredProducts = useMemo(() => {
    if (!products.length) return []
    
    return products
      .filter(product => {
        const matchesSearch = debouncedSearchQuery === '' || 
          product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategories.length === 0 || 
          selectedCategories.includes(product.category);
        
        const matchesLevel = selectedLevels.length === 0 || 
          selectedLevels.includes(product.level);
        
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.some(tag => product.tags.includes(tag));
        
        return matchesSearch && matchesCategory && matchesLevel && matchesPrice && matchesTags;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'popular':
            return (b.reviews || 0) - (a.reviews || 0);
          case 'newest':
            return b.id - a.id;
          default:
            if (a.isBestSeller && !b.isBestSeller) return -1;
            if (!a.isBestSeller && b.isBestSeller) return 1;
            if (a.rating !== b.rating) return b.rating - a.rating;
            return (b.reviews || 0) - (a.reviews || 0);
        }
      })
  }, [products, debouncedSearchQuery, selectedCategories, selectedLevels, priceRange, selectedTags, sortBy])

  // Group products by fixed categories for display
  const groupedProducts = useMemo(() => {
    const map: Record<string, any[]> = {}
    PRODUCT_CATEGORIES.forEach(cat => map[cat] = [])
    filteredProducts.forEach(p => {
      const cat = PRODUCT_CATEGORIES.includes(p.category) ? p.category : 'Uncategorized'
      if (!map[cat]) map[cat] = []
      map[cat].push(p)
    })
    return map
  }, [filteredProducts])

  // Memoized event handlers
  const toggleWishlist = useCallback((productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }, [])

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }, [])

  const toggleLevel = useCallback((level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    )
  }, [])

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }, [])

  const clearAllFilters = useCallback(() => {
    setSelectedCategories([])
    setSelectedLevels([])
    setSelectedTags([])
    setPriceRange([0, priceMax])
    setSearchQuery('')
  }, [priceMax])

  const featuredProducts = useMemo(() => 
    products.filter(p => p.isBestSeller || p.isNew).slice(0, 3), 
    [products]
  )

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Loading Products...</h2>
            <p className="text-gray-600">Discovering amazing educational resources</p>
          </motion.div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans flex items-center justify-center`}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4 max-w-md mx-auto p-6"
        >
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Unable to Load Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-sky-600 hover:bg-sky-700"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 px-4 py-20 md:px-6 md:py-28">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full blur-3xl opacity-60 animate-float"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-40 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-200 rounded-full blur-2xl opacity-50 animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-amber-200 rounded-full blur-2xl opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="mx-auto max-w-7xl relative text-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-white/80 backdrop-blur-sm border-0 px-6 py-2 rounded-full text-sky-600 hover:bg-white font-semibold text-lg mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Discover Amazing Products
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
            >
              Explore Our{" "}
              <span className="bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Premium Collection
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed max-w-3xl mx-auto tracking-tight"
            >
              Discover cutting-edge educational products, tools, and resources designed to transform learning experiences
            </motion.p>

            {/* Enhanced Search */}
            <motion.div 
              variants={fadeInUp}
              className="relative max-w-2xl mx-auto mt-8"
            >
              <motion.div
                animate={{
                  scale: searchFocused ? 1.02 : 1,
                  y: searchFocused ? -2 : 0
                }}
                transition={{ duration: 0.2 }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search products, categories, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-12 pr-24 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-lg transition-all duration-300"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Button className="rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 px-6 transition-all duration-300 hover:scale-105">
                    Search
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-6 mt-8"
            >
              {[
                { label: "Products", value: products.length },
                { label: "Categories", value: categories.length },
                { label: "Best Sellers", value: products.filter(p => p.isBestSeller).length },
                { label: "New Arrivals", value: products.filter(p => p.isNew).length }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm"
                >
                  <div className="text-2xl font-bold text-gray-900">{stat.value}+</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="px-4 py-12 md:px-6"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured <span className="text-sky-600">Products</span>
              </h2>
              <Button variant="ghost" className="text-sky-600 hover:text-sky-700 group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <motion.div 
              className="grid gap-6 md:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProducts.map((product, index) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <FeaturedProductCard 
                    product={product} 
                    onQuickView={setQuickViewProduct}
                    delay={index * 0.1}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Main Products Section */}
      <section className="px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <Card className="rounded-3xl border-0 shadow-lg backdrop-blur-sm bg-white/80">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-sky-600 hover:text-sky-700">
                      Clear All
                    </Button>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Price Range</h4>
                    <Slider
                      value={[priceRange[0], priceRange[1]]}
                      min={0}
                      max={priceMax}
                      step={Math.max(1, Math.floor(priceMax / 100))}
                      onValueChange={(value) => setPriceRange([value[0], value[1]])}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(priceRange[0])}</span>
                      <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Categories */}
                  {categories.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Categories</h4>
                      {categories.map((category) => {
                        return (
                          <motion.button
                            key={category.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleCategory(category.name)}
                            className={`flex items-center justify-between w-full p-3 rounded-2xl transition-all duration-200 ${
                              selectedCategories.includes(category.name)
                                ? 'bg-sky-100 text-sky-700 border border-sky-200 shadow-md'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-left">{category.name}</span>
                              <span className="ml-2 text-sm text-gray-500">({category.count})</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {category.count}
                            </Badge>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Levels */}
                  {levels.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Level</h4>
                      {levels.map((level) => {
                        const Icon = level.icon;
                        return (
                          <motion.button
                            key={level.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleLevel(level.name)}
                            className={`flex items-center justify-between w-full p-3 rounded-2xl transition-all duration-200 ${
                              selectedLevels.includes(level.name)
                                ? 'bg-sky-100 text-sky-700 border border-sky-200 shadow-md'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4" />
                              <span className="text-left">{level.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {level.count}
                            </Badge>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Popular Tags */}
                  {allTags.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Popular Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <motion.div
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Badge
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer hover:bg-sky-100 hover:text-sky-700 transition-colors"
                              onClick={() => toggleTag(tag)}
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Special Offers */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="rounded-3xl border-0 bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg overflow-hidden">
                  <CardContent className="p-6 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10 text-center space-y-3">
                      <Sparkles className="h-8 w-8 mx-auto" />
                      <h3 className="text-xl font-bold">Special Offer!</h3>
                      <p className="text-sm opacity-90">Get 20% off on your first purchase with code WELCOME20</p>
                      <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105">
                        Claim Offer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Enhanced Controls */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      className="lg:hidden"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* Sort */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                      >
                        <option value="featured">Featured</option>
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="popular">Most Popular</option>
                      </select>
                    </div>

                    {/* View Mode */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-2xl bg-white p-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-xl transition-colors ${
                          viewMode === 'grid' ? 'bg-sky-100 text-sky-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl transition-colors ${
                          viewMode === 'list' ? 'bg-sky-100 text-sky-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                <AnimatePresence>
                  {(selectedCategories.length > 0 || selectedLevels.length > 0 || selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < priceMax) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2 mt-4"
                    >
                      {selectedCategories.map(category => (
                        <motion.div
                          key={category}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          <Badge variant="secondary" className="gap-1">
                            {category}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(category)} />
                          </Badge>
                        </motion.div>
                      ))}
                      {selectedLevels.map(level => (
                        <motion.div
                          key={level}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          <Badge variant="secondary" className="gap-1">
                            {level}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => toggleLevel(level)} />
                          </Badge>
                        </motion.div>
                      ))}
                      {selectedTags.map(tag => (
                        <motion.div
                          key={tag}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          <Badge variant="secondary" className="gap-1">
                            {tag}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTag(tag)} />
                          </Badge>
                        </motion.div>
                      ))}
                      {(priceRange[0] > 0 || priceRange[1] < priceMax) && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                        >
                          <Badge variant="secondary" className="gap-1">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(priceRange[0])} - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(priceRange[1])}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange([0, priceMax])} />
                          </Badge>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Products Grid/List */}
              {filteredProducts.length === 0 ? (
                <EmptyState 
                  searchQuery={searchQuery}
                  selectedCategories={selectedCategories}
                  selectedLevels={selectedLevels}
                  selectedTags={selectedTags}
                  onClearFilters={clearAllFilters}
                />
              ) : (
                <motion.div 
                  layout
                  className={viewMode === 'grid' 
                    ? "grid gap-6 md:grid-cols-2 xl:grid-cols-2" 
                    : "space-y-6"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ProductCard 
                          product={product}
                          viewMode={viewMode}
                          wishlist={wishlist}
                          onWishlistToggle={toggleWishlist}
                          onQuickView={setQuickViewProduct}
                          onAddToCart={addItem}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Banner */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500 px-4 py-16 md:px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="mx-auto max-w-7xl relative">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over ₹100" },
              { icon: Shield, title: "Secure Payment", desc: "100% protected" },
              { icon: RotateCcw, title: "30-Day Returns", desc: "No questions asked" },
              { icon: Clock4, title: "24/7 Support", desc: "Always here to help" },
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.05 }}
                className="flex flex-col items-center text-white"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal 
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={addItem}
            wishlist={wishlist}
            onWishlistToggle={toggleWishlist}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
}

// Featured Product Card Component
function FeaturedProductCard({ product, onQuickView, delay = 0 }: {
  product: Product;
  onQuickView: (product: Product) => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Card className="group overflow-hidden rounded-3xl border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer">
        <CardContent className="p-0" onClick={() => onQuickView(product)}>
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute top-4 left-4 flex gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                  <Crown className="w-3 h-3 mr-1" />
                  {product.isBestSeller ? 'Best Seller' : 'Featured'}
                </Badge>
              </motion.div>
              {product.discount && product.discount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-green-600 text-white shadow-lg">
                    {product.discount}% OFF
                  </Badge>
                </motion.div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <motion.h3 
                className="text-xl font-bold mb-1 line-clamp-1"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {product.name}
              </motion.h3>
              <motion.p 
                className="text-sm opacity-90 mb-2 line-clamp-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {product.description}
              </motion.p>
              <motion.div 
                className="flex items-center justify-between"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-lg font-bold">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                </span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg">
                    View Details
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Enhanced Product Card Component
function ProductCard({ product, viewMode, wishlist, onWishlistToggle, onQuickView, onAddToCart }: {
  product: Product;
  viewMode: 'grid' | 'list';
  wishlist: number[];
  onWishlistToggle: (id: number) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (item: any) => void;
}) {
  const isWishlisted = wishlist.includes(product.id);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`group overflow-hidden rounded-3xl border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 ${
        viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
      }`}>
        <CardContent className={`p-0 ${viewMode === 'list' ? 'flex flex-col md:flex-row flex-1' : ''}`}>
          {/* Product Image */}
          <div className={`relative overflow-hidden ${
            viewMode === 'list' ? 'md:w-80 md:flex-shrink-0' : 'aspect-square'
          }`}>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isBestSeller && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                    <Award className="w-3 h-3 mr-1" />
                    Best Seller
                  </Badge>
                </motion.div>
              )}
              {product.isNew && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Badge className="bg-blue-600 text-white shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New
                  </Badge>
                </motion.div>
              )}
              {product.discount && product.discount > 0 && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Badge className="bg-green-600 text-white shadow-lg">
                    {product.discount}% OFF
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-gray-100 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    onWishlistToggle(product.id)
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 transition-all duration-300 ${
                      isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600'
                    }`} 
                  />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-gray-100 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    onQuickView(product)
                  }}
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </Button>
              </motion.div>
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge className="bg-red-600 hover:bg-red-700 text-white text-lg py-2 px-4">
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Quick Actions Overlay */}
            <motion.div 
              className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <motion.div 
                className="flex gap-2"
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
              >
                <Button 
                  size="sm"
                  className="rounded-full bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    onQuickView(product)
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Quick View
                </Button>
                {product.videoPreview && (
                  <Button 
                    size="sm"
                    variant="outline"
                    className="rounded-full bg-white/90 backdrop-blur-sm text-gray-900 border-white hover:bg-white"
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 transition-colors ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{product.category}</p>
              </div>
            </div>
            
            <p className={`text-gray-600 mb-4 ${
              viewMode === 'list' ? 'line-clamp-3' : 'line-clamp-2'
            }`}>
              {product.description}
            </p>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {product.features.slice(0, viewMode === 'list' ? 6 : 3).map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {product.delivery}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {product.level}
              </div>
              {product.duration && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {product.duration}
                </div>
              )}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price and Action */}
            <div className={`flex items-center justify-between ${
              viewMode === 'list' ? 'mt-auto' : ''
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                </span>
                {(product.originalPrice || 0) > (product.price || 0) && (
                  <span className="text-sm text-gray-500 line-through">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href={`/product/${encodeURIComponent(product.slug || product.id)}`} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="rounded-full border-gray-300 hover:border-sky-400 hover:text-sky-600"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View more
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    disabled={!product.inStock}
                    className="rounded-full bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddToCart({
                        id: product.id,
                        title: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        provider: product.category,
                        type: "product",
                      })
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Empty State Component
function EmptyState({ 
  searchQuery, 
  selectedCategories, 
  selectedLevels, 
  selectedTags, 
  onClearFilters 
}: {
  searchQuery: string;
  selectedCategories: string[];
  selectedLevels: string[];
  selectedTags: string[];
  onClearFilters: () => void;
}) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedLevels.length > 0 || selectedTags.length > 0 || searchQuery.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <Search className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {hasActiveFilters ? 'No products match your filters' : 'No products available'}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {hasActiveFilters 
          ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
          : 'Check back later for new products and updates.'
        }
      </p>
      {hasActiveFilters && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onClearFilters}
            className="rounded-full bg-sky-600 text-white hover:bg-sky-700"
          >
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Quick View Modal Component
function QuickViewModal({ product, onClose, onAddToCart, wishlist, onWishlistToggle }: {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  wishlist: number[];
  onWishlistToggle: (id: number) => void;
}) {
  const isWishlisted = wishlist.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="relative">
          {/* Close Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-gray-100"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {product.isBestSeller && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      Best Seller
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-blue-600 text-white">
                      New
                    </Badge>
                  )}
                  {product.discount && product.discount > 0 && (
                    <Badge className="bg-green-600 text-white">
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.description}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">({product.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                </span>
                {(product.originalPrice || 0) > (product.price || 0) && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.originalPrice)}
                    </span>
                    <Badge variant="secondary" className="text-green-600 bg-green-100">
                      Save {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format((product.originalPrice || 0) - (product.price || 0))}
                    </Badge>
                  </>
                )}
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Features:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center gap-2 text-sm text-gray-600"
                        whileHover={{ x: 5 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Delivery: {product.delivery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>Level: {product.level}</span>
                </div>
                {product.instructor && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <span>Instructor: {product.instructor}</span>
                  </div>
                )}
                {product.duration && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Duration: {product.duration}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-2 border-gray-300 hover:border-sky-400 hover:text-sky-600 py-3"
                    onClick={() => onWishlistToggle(product.id)}
                  >
                    <Heart 
                      className={`h-5 w-5 mr-2 transition-all ${
                        isWishlisted ? 'fill-red-500 text-red-500 scale-110' : ''
                      }`} 
                    />
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    disabled={!product.inStock}
                    className="flex-1 rounded-full bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 py-3 text-lg font-semibold"
                    onClick={() => {
                      onAddToCart({
                        id: product.id,
                        title: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        provider: product.category,
                        type: "product",
                      });
                      onClose();
                    }}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                  </Button>
                </motion.div>
              </div>

              {!product.inStock && (
                <div className="text-center text-red-600 font-semibold">
                  This product is currently out of stock
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}