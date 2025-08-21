import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Trash2, Image as ImageIcon, Save, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroData {
  title: string;
  rating: number;
  reviews_count: number;
  old_price: number;
  new_price: number;
  features: string[];
  buttons: {
    view_product_details: {
      label: string;
      popup_link: string;
    };
    learn_more: {
      label: string;
      url: string;
    };
  };
  hero_image: string;
}

const defaultHeroData: HeroData = {
  title: "Nutritious Snack Box with Breakfast Bars and Delicious Chips | Gift A Snack (42 Count)",
  rating: 4.6,
  reviews_count: 23,
  old_price: 42.99,
  new_price: 31.95,
  features: [
    "Fresh & high-quality snacks",
    "Walmart+ offer eligible",
    "Fast & reliable delivery",
    "Limited stock available"
  ],
  buttons: {
    view_product_details: {
      label: "View Product Details",
      popup_link: ""
    },
    learn_more: {
      label: "Learn More About This Product",
      url: ""
    }
  },
  hero_image: ""
};

export default function Hero() {
  const [heroData, setHeroData] = useState<HeroData>(defaultHeroData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setHeroData(prev => ({ ...prev, title: value }));
  };

  const handleRatingChange = (value: string) => {
    const rating = parseFloat(value);
    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
      setHeroData(prev => ({ ...prev, rating }));
    }
  };

  const adjustRating = (increment: number) => {
    const newRating = Math.max(0, Math.min(5, heroData.rating + increment));
    setHeroData(prev => ({ ...prev, rating: newRating }));
  };

  const handleReviewsCountChange = (value: string) => {
    const count = parseInt(value);
    if (!isNaN(count) && count >= 0) {
      setHeroData(prev => ({ ...prev, reviews_count: count }));
    }
  };

  const handlePriceChange = (field: 'old_price' | 'new_price', value: string) => {
    const price = parseFloat(value);
    if (!isNaN(price) && price >= 0) {
      setHeroData(prev => ({ ...prev, [field]: price }));
    }
  };

  const addFeature = () => {
    setHeroData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setHeroData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    if (heroData.features.length > 1) {
      setHeroData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const handleButtonChange = (buttonType: 'view_product_details' | 'learn_more', field: string, value: string) => {
    setHeroData(prev => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        [buttonType]: {
          ...prev.buttons[buttonType],
          [field]: value
        }
      }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload to a storage service
      // For now, we'll create a temporary URL
      const imageUrl = URL.createObjectURL(file);
      setHeroData(prev => ({ ...prev, hero_image: imageUrl }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would save to your backend/database
      // For now, we'll just simulate a save operation
      console.log("Saving hero data:", heroData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // You could save to localStorage, send to API, etc.
      localStorage.setItem('hero_section', JSON.stringify(heroData));
      
      alert("Hero section saved successfully!");
    } catch (error) {
      console.error("Error saving hero data:", error);
      alert("Error saving hero section. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('hero_section');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setHeroData(parsed);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Hero Section Management</h2>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Form Fields */}
        <div className="space-y-6">
          {/* Main Title */}
          <Card>
            <CardHeader>
              <CardTitle>Main Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={heroData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter the main hero title..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Rating Section */}
          <Card>
            <CardHeader>
              <CardTitle>Star Rating</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="rating">Rating Value</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={heroData.rating}
                    onChange={(e) => handleRatingChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Adjust Rating</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustRating(-0.1)}
                      disabled={heroData.rating <= 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustRating(0.1)}
                      disabled={heroData.rating >= 5}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Star Display */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(heroData.rating) 
                          ? "text-yellow-400 fill-current" 
                          : i < heroData.rating 
                            ? "text-yellow-400 fill-current" 
                            : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <Badge variant="secondary">{heroData.rating.toFixed(1)}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Count */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Label htmlFor="reviews">Number of reviews:</Label>
                <Input
                  id="reviews"
                  type="number"
                  min="0"
                  value={heroData.reviews_count}
                  onChange={(e) => handleReviewsCountChange(e.target.value)}
                  className="w-24"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Preview: "from {heroData.reviews_count} reviews"
              </p>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="old-price">Old Price ($)</Label>
                  <Input
                    id="old-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={heroData.old_price}
                    onChange={(e) => handlePriceChange('old_price', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-price">New Price ($)</Label>
                  <Input
                    id="new-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={heroData.new_price}
                    onChange={(e) => handlePriceChange('new_price', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">Preview:</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-500 line-through">${heroData.old_price.toFixed(2)}</span>
                  <span className="text-green-600 font-bold text-lg">${heroData.new_price.toFixed(2)}</span>
                  <Badge variant="secondary" className="text-xs">
                    Save ${(heroData.old_price - heroData.new_price).toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buttons Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Button Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="btn1-label">Button 1 - Label</Label>
                <Input
                  id="btn1-label"
                  value={heroData.buttons.view_product_details.label}
                  onChange={(e) => handleButtonChange('view_product_details', 'label', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="btn1-popup">Button 1 - Popup Modal Link</Label>
                <Input
                  id="btn1-popup"
                  value={heroData.buttons.view_product_details.popup_link}
                  onChange={(e) => handleButtonChange('view_product_details', 'popup_link', e.target.value)}
                  placeholder="Enter popup modal link..."
                  className="mt-1"
                />
              </div>
              
              <Separator />
              
              <div>
                <Label htmlFor="btn2-label">Button 2 - Label</Label>
                <Input
                  id="btn2-label"
                  value={heroData.buttons.learn_more.label}
                  onChange={(e) => handleButtonChange('learn_more', 'label', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="btn2-url">Button 2 - URL</Label>
                <Input
                  id="btn2-url"
                  value={heroData.buttons.learn_more.url}
                  onChange={(e) => handleButtonChange('learn_more', 'url', e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Features and Image */}
        <div className="space-y-6">
          {/* Features/Bullet Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Bullet Points / Features
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {heroData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature description..."
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    disabled={heroData.features.length === 1}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {heroData.hero_image ? (
                  <div className="space-y-4">
                    <img
                      src={heroData.hero_image}
                      alt="Hero preview"
                      className="max-w-full h-32 object-contain mx-auto rounded"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Replace Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600">No image uploaded</p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="mt-2 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {heroData.hero_image && (
                <div>
                  <Label htmlFor="image-url">Or enter image URL:</Label>
                  <Input
                    id="image-url"
                    value={heroData.hero_image}
                    onChange={(e) => setHeroData(prev => ({ ...prev, hero_image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
