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
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Bebas_Neue } from "next/font/google";
import { useCart } from "@/hooks/use-cart";

// Load condensed font
const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

interface Product {
  id: number;
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

export default function ProductsPage() {
  const { addItem } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  // Widen default price range so new products with higher prices are visible by default
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [products, setProducts] = useState<Product[]>([])
  const [priceMax, setPriceMax] = useState<number>(1000)
  useEffect(() => {
    let mounted = true
    fetch('/api/products')
      .then(r => r.json())
      .then((data) => {
        if (!mounted) return
        // map DB fields (snake_case) to UI Product shape
        const mapped = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || p.tagline || '',
          price: Number(p.price) || 0,
          originalPrice: Number(p.original_price) || Number(p.originalPrice) || 0,
          rating: Number(p.rating) || 0,
          reviews: Number(p.reviews) || 0,
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
        setProducts(mapped)
        // Normalize category and level strings to avoid duplicates like
        // "Physical Product" vs "Physical product". Also compute maximum price
        // so the slider and labels can be dynamic.
        try {
          const normalized = mapped.map((p: any) => {
            const cat = (p.category || 'Uncategorized').toString().trim()
            const catName = cat.split(/\s+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
            const levelRaw = (p.level || 'All Levels').toString().trim()
            const levelName = levelRaw.split(/\s+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
            return { ...p, category: catName, level: levelName }
          })
          setProducts(normalized)
          const maxPrice = normalized.reduce((m: number, p: any) => Math.max(m, Number(p.price) || 0), 0)
          const upper = Math.max(1000, Math.ceil(maxPrice))
          setPriceMax(upper)
          setPriceRange((prev) => prev[1] === 10000 ? [0, upper] : prev)
        } catch (_) {
          setProducts(mapped)
        }
      }).catch(() => {})
    return () => { mounted = false }
  }, [])

  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1 })
    return Object.keys(counts).map((k) => ({ id: k.toLowerCase().replace(/\s+/g, '-'), name: k, count: counts[k], icon: k.includes('Software') ? Cog : Package }))
  }, [products])

  const levels = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach(p => { const lvl = p.level || 'All Levels'; counts[lvl] = (counts[lvl] || 0) + 1 })
    return Object.keys(counts).map((k) => ({ id: k.toLowerCase().replace(/\s+/g, '-'), name: k, count: counts[k], icon: k.toLowerCase().includes('beginner') ? Rocket : TrendingUp }))
  }, [products])

  const allTags = Array.from(new Set(products.flatMap(p => p.tags)));

  // Filter and sort products
  const filteredProducts = useMemo(() => 
    products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
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
            return b.rating - a.rating;
        }
      }), 
    [products, searchQuery, selectedCategories, selectedLevels, priceRange, selectedTags, sortBy]
  );

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedTags([]);
    setPriceRange([0, 1000]);
    setSearchQuery('');
  };

  const featuredProducts = products.filter(p => p.isBestSeller).slice(0, 3);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${bebas.variable} font-sans`}>
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 px-4 py-20 md:px-6 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full blur-3xl opacity-60 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-40 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-200 rounded-full blur-2xl opacity-50 animate-float" style={{animationDelay: '4s'}}></div>

        <div className="mx-auto max-w-7xl relative text-center">
          <div className="space-y-6">
            <Badge className="bg-white/80 backdrop-blur-sm border-0 px-6 py-2 rounded-full text-sky-600 hover:bg-white font-semibold text-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover Amazing Products
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Premium Collection
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed max-w-3xl mx-auto tracking-tight">
              Discover cutting-edge educational products, tools, and resources designed to transform learning experiences
            </p>

            {/* Enhanced Search */}
            <div className="relative max-w-2xl mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products, categories, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-24 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-lg"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Button className="rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 px-6">
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {[
                { label: "Products", value: "50+" },
                { label: "Categories", value: "12+" },
                { label: "Happy Customers", value: "10K+" },
                { label: "5-Star Ratings", value: "4.8/5" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="px-4 py-12 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured <span className="text-sky-600">Products</span>
            </h2>
            <Button variant="ghost" className="text-sky-600 hover:text-sky-700">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden rounded-3xl border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                      {product.discount && (
                        <Badge className="bg-green-600 text-white">
                          {product.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{product.name}</h3>
                      <p className="text-sm opacity-90">{product.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Products Section */}
      <section className="px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="rounded-3xl border-0 shadow-lg">
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
                      step={10}
                      onValueChange={(value) => setPriceRange([value[0], value[1]])}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(priceRange[0])}</span>
                      <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Categories</h4>
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => toggleCategory(category.name)}
                          className={`flex items-center justify-between w-full p-3 rounded-2xl transition-colors ${
                            selectedCategories.includes(category.name)
                              ? 'bg-sky-100 text-sky-700 border border-sky-200'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            <span>{category.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>

                  {/* Levels */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Level</h4>
                    {levels.map((level) => {
                      const Icon = level.icon;
                      return (
                        <button
                          key={level.id}
                          onClick={() => toggleLevel(level.name)}
                          className={`flex items-center justify-between w-full p-3 rounded-2xl transition-colors ${
                            selectedLevels.includes(level.name)
                              ? 'bg-sky-100 text-sky-700 border border-sky-200'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            <span>{level.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {level.count}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>

                  {/* Popular Tags */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Popular Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 8).map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-sky-100 hover:text-sky-700 transition-colors"
                          onClick={() => toggleTag(tag)}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Offers */}
              <Card className="rounded-3xl border-0 bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <Sparkles className="h-8 w-8 mx-auto" />
                    <h3 className="text-xl font-bold">Special Offer!</h3>
                    <p className="text-sm opacity-90">Get 20% off on your first purchase with code WELCOME20</p>
                    <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                      Claim Offer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Enhanced Controls */}
              <div className="mb-8">
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
                      Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* Sort */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-xl transition-colors ${
                          viewMode === 'grid' ? 'bg-sky-100 text-sky-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl transition-colors ${
                          viewMode === 'list' ? 'bg-sky-100 text-sky-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {(selectedCategories.length > 0 || selectedLevels.length > 0 || selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedCategories.map(category => (
                      <Badge key={category} variant="secondary" className="gap-1">
                        {category}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(category)} />
                      </Badge>
                    ))}
                    {selectedLevels.map(level => (
                      <Badge key={level} variant="secondary" className="gap-1">
                        {level}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => toggleLevel(level)} />
                      </Badge>
                    ))}
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTag(tag)} />
                      </Badge>
                    ))}
                    {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                      <Badge variant="secondary" className="gap-1">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(priceRange[0])} - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(priceRange[1])}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange([0, 1000])} />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Products Grid/List */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                  <Button
                    onClick={clearAllFilters}
                    className="rounded-full bg-sky-600 text-white hover:bg-sky-700"
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? "grid gap-6 md:grid-cols-2 xl:grid-cols-2" 
                  : "space-y-6"
                }>
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      wishlist={wishlist}
                      onWishlistToggle={toggleWishlist}
                      onQuickView={setQuickViewProduct}
                      onAddToCart={addItem}
                    />
                  ))}
                </div>
              )}

              {/* Load More */}
              {filteredProducts.length > 0 && (
                <div className="mt-16 text-center">
                  <Button variant="outline" className="rounded-full border-2 border-gray-300 px-8 py-4 text-lg font-semibold hover:border-sky-400 hover:text-sky-600">
                    Load More Products
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Banner */}
      <section className="bg-gradient-to-r from-sky-500 via-purple-600 to-pink-500 px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over ₹100", color: "text-white" },
              { icon: Shield, title: "Secure Payment", desc: "100% protected", color: "text-white" },
              { icon: RotateCcw, title: "30-Day Returns", desc: "No questions asked", color: "text-white" },
              { icon: Clock4, title: "24/7 Support", desc: "Always here to help", color: "text-white" },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addItem}
          wishlist={wishlist}
          onWishlistToggle={toggleWishlist}
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
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

  return (
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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isBestSeller && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Award className="w-3 h-3 mr-1" />
                Best Seller
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-blue-600 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
            {product.discount && (
              <Badge className="bg-green-600 text-white">
                {product.discount}% OFF
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-gray-100 transition-all hover:scale-110"
              onClick={() => onWishlistToggle(product.id)}
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`} 
              />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-gray-100 transition-all hover:scale-110"
              onClick={() => onQuickView(product)}
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge className="bg-red-600 hover:bg-red-700 text-white text-lg py-2 px-4">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Button 
                size="sm"
                className="rounded-full bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                onClick={() => onQuickView(product)}
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
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{product.category}</p>
            </div>
          </div>
          
          <p className={`text-gray-600 mb-4 ${
            viewMode === 'list' ? 'line-clamp-3' : 'line-clamp-2'
          }`}>
            {product.description}
          </p>

          {/* Features */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {product.features.slice(0, viewMode === 'list' ? 6 : 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

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
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Price and Action */}
          <div className={`flex items-center justify-between ${
            viewMode === 'list' ? 'mt-auto' : ''
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}</span>
              {(product.originalPrice || 0) > (product.price || 0) && (
                <span className="text-sm text-gray-500 line-through">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.originalPrice)}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="rounded-full border-gray-300 hover:border-sky-400 hover:text-sky-600"
                onClick={() => onQuickView(product)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button 
                disabled={!product.inStock}
                className="rounded-full bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={() => onAddToCart({
                  id: product.id,
                  title: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: product.image,
                  provider: product.category,
                  type: "product",
                })}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Additional images would go here */}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
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
                  {product.discount && (
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
                <span className="text-3xl font-bold text-gray-900">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}</span>
                {(product.originalPrice || 0) > (product.price || 0) && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.originalPrice)}</span>
                    <Badge variant="secondary" className="text-green-600 bg-green-100">
                      Save {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format((product.originalPrice || 0) - (product.price || 0))}
                    </Badge>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Features:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

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
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-2 border-gray-300 hover:border-sky-400 hover:text-sky-600 py-3"
                  onClick={() => onWishlistToggle(product.id)}
                >
                  <Heart 
                    className={`h-5 w-5 mr-2 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : ''
                    }`} 
                  />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </Button>
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
              </div>

              {!product.inStock && (
                <div className="text-center text-red-600 font-semibold">
                  This product is currently out of stock
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}