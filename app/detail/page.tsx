"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  CheckCircle,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  MapPin,
  CreditCard,
  HeadphonesIcon,
  Sparkles,
  Award,
  Zap,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  category: string;
  isBestSeller: boolean;
  isNew: boolean;
  inStock: boolean;
  stockQuantity: number;
  features: string[];
  delivery: string;
  deliveryDate: string;
  warranty: string;
  specifications: { [key: string]: string };
  highlights: string[];
  whatInBox: string[];
  seller: {
    name: string;
    rating: number;
    reviews: number;
  };
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productSlug = params.slug as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [zoomImage, setZoomImage] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        if (!productSlug) {
          setLoading(false)
          return
        }
        const res = await fetch(`/api/products/${encodeURIComponent(productSlug)}`, { cache: 'no-store' })
        if (!res.ok) {
          // product not found
          setProduct(null)
          setLoading(false)
          return
        }
        const p = await res.json()
        if (ignore) return

        // map DB row to UI product shape
        const mapped: Product = {
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: p.price ? Number(p.price) : 0,
          originalPrice: p.original_price ? Number(p.original_price) : (p.price ? Number(p.price) : 0),
          rating: p.rating ? Number(p.rating) : 0,
          reviews: p.reviews ?? 0,
          image: p.image || p.hero_image || '/placeholder.jpg',
          images: Array.isArray(p.images) && p.images.length ? p.images : (p.hero_image ? [p.hero_image] : []),
          category: p.category || '',
          isBestSeller: Boolean(p.is_best_seller),
          isNew: Boolean(p.is_new),
          inStock: p.in_stock ?? true,
          stockQuantity: (p.theme && p.theme.stock_quantity) ?? p.students ?? 0,
          features: Array.isArray(p.features) ? p.features : [],
          delivery: p.delivery || (p.theme && p.theme.delivery_date) || '',
          deliveryDate: (p.theme && p.theme.delivery_date) || '',
          warranty: (p.theme && p.theme.warranty) || '',
          specifications: (p.tech_specs && typeof p.tech_specs === 'object') ? p.tech_specs : {},
          highlights: Array.isArray(p.highlights) ? p.highlights : [],
          whatInBox: Array.isArray(p.kits) ? p.kits : (Array.isArray(p.addons) ? p.addons : []),
          seller: (p.theme && p.theme.seller) ? p.theme.seller : (p.seller || { name: '', rating: 0, reviews: 0 }),
        }

        setProduct(mapped)
      } catch (err) {
        setProduct(null)
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [productSlug]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        title: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        provider: product.category,
        type: "product",
        // quantity: quantity, // Removed because CartItem does not accept 'quantity'
      });
    }
  };

  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomImage) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const images = product?.images && product.images.length > 0 
    ? [product.image, ...product.images] 
    : [product?.image || '/placeholder.svg'];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
          <Button onClick={() => router.push('/product')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-3 text-sm text-gray-600">
            <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <span>/</span>
            <Link href="/product" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <Link href={`/product?category=${product.category}`} className="hover:text-blue-600">{product.category}</Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </nav>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden cursor-zoom-in relative"
              onMouseEnter={() => setZoomImage(true)}
              onMouseLeave={() => setZoomImage(false)}
              onMouseMove={handleImageZoom}
            >
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                style={{
                  transform: zoomImage ? `scale(2) translate(${zoomPosition.x / 4}%, ${zoomPosition.y / 4}%)` : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isBestSeller && (
                  <Badge className="bg-orange-500 text-white text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Best Seller
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="bg-blue-600 text-white text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New
                  </Badge>
                )}
                {discount > 0 && (
                  <Badge className="bg-green-600 text-white text-xs">
                    {discount}% off
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Share Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                <Heart className="h-4 w-4" />
                Save for later
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-blue-600 font-medium ml-1">{product.rating}</span>
                </div>
                <span className="text-gray-500">|</span>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {product.reviews} ratings
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  100+ bought in past month
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>#1 Best Seller in</span>
                <span className="text-blue-600 hover:underline cursor-pointer">{product.category}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-light text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800 font-normal">
                      {discount}% off
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              <p className="text-green-600 font-medium">EMI starts at ₹2,166. No Cost EMI available</p>
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">About this item</h3>
              <ul className="space-y-1">
                {product.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="h-3 w-3 text-blue-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div>
                  <span className="text-gray-600">Delivery</span>
                  <p className="font-medium">
                    {product.delivery} <span className="text-blue-600">{product.deliveryDate}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-600" />
                <div>
                  <span className="text-gray-600">Free delivery</span>
                  <p className="font-medium">on your first order</p>
                </div>
              </div>

              {product.inStock ? (
                <p className="text-green-600 font-medium">
                  In Stock ({product.stockQuantity} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 rounded-lg border border-yellow-500 shadow-sm"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  disabled={!product.inStock}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg shadow-sm"
                >
                  Buy Now
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Secure transaction</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <span>EMI available</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Sold by</p>
                  <p className="font-medium text-blue-600 hover:underline cursor-pointer">
                    {product.seller.name}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span>{product.seller.rating} • {product.seller.reviews.toLocaleString()} ratings</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Visit store
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full justify-start border-b rounded-none p-0 bg-transparent">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-3 px-4"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-3 px-4"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="whatsinbox" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-3 px-4"
              >
                What's in the box
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent py-3 px-4"
              >
                Customer Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Why choose this product?</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Comprehensive STEM learning experience</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Age-appropriate programming challenges</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Professional customer support</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Learning Outcomes</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Develops logical thinking and problem-solving skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Introduces AI and machine learning concepts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Enhances creativity and innovation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Technical Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="whatsinbox">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">What's in the Box</h3>
                <div className="grid gap-3">
                  {product.whatInBox.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Rating Summary */}
                  <div className="md:w-1/3">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-gray-900 mb-2">{product.rating}</div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{product.reviews} ratings</p>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="md:w-2/3 space-y-6">
                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            AS
                          </div>
                          <div>
                            <div className="font-semibold">Aarav Sharma</div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 text-yellow-400 fill-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <h4 className="font-semibold mb-2">Excellent learning tool!</h4>
                        <p className="text-gray-700">
                          My 10-year-old absolutely loves this robotics kit. The instructions are clear, 
                          and the programming interface is intuitive. Great value for money!
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>Reviewed on 15 December 2024</span>
                          <span>|</span>
                          <span>Verified Purchase</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Frequently Bought Together */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Frequently bought together</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-500">Item 1</span>
                  </div>
                  <div>
                    <p className="font-medium">Advanced Coding Cards</p>
                    <p className="text-green-600 font-semibold">₹1,299</p>
                  </div>
                </div>
                <Plus className="h-5 w-5 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-500">Item 2</span>
                  </div>
                  <div>
                    <p className="font-medium">Sensor Expansion Pack</p>
                    <p className="text-green-600 font-semibold">₹2,499</p>
                  </div>
                </div>
                <Plus className="h-5 w-5 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-500">Item 3</span>
                  </div>
                  <div>
                    <p className="font-medium">Carrying Case</p>
                    <p className="text-green-600 font-semibold">₹899</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <p className="font-semibold">Total: ₹{(product.price + 1299 + 2499 + 899).toLocaleString('en-IN')}</p>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Add all to cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Support */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <HeadphonesIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Need help?</h3>
              <p className="text-gray-600 mb-4">Our support team is here to help you</p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <RotateCcw className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600 mb-4">30-day return policy</p>
              <Button variant="outline" className="w-full">
                View Policy
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Warranty</h3>
              <p className="text-gray-600 mb-4">{product.warranty}</p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}