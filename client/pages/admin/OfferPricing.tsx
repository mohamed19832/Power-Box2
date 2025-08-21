import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface OfferPricingData {
  promo_text: string;
  title: string;
  subtitle: string;
  offer_card: {
    product_name: string;
    old_price: string;
    new_price: string;
    features: string[];
    button: {
      label: string;
      popup_link: string;
      popup_title: string;
    };
    guarantees: string[];
  };
}

const defaultOfferPricingData: OfferPricingData = {
  promo_text: "Bestseller - Limited Time Offer",
  title: "Ready to Fuel Your Day?",
  subtitle: "Get your 42-count nutritious snack box today!",
  offer_card: {
    product_name: "Nutritious Snack Box",
    old_price: "$42.99",
    new_price: "$31.95",
    features: [
      "42 premium snacks included",
      "Fresh & high-quality snacks from top brands",
      "Perfect for gifting or office sharing",
      "Fast & reliable delivery nationwide",
      "Greeting card included",
    ],
    button: {
      label: "Get Your Snack Box Now",
      popup_link: "",
      popup_title: "",
    },
    guarantees: ["Secure Payment", "Fast Shipping", "Satisfaction Guaranteed"],
  },
};

export default function OfferPricing() {
  const [offerData, setOfferData] = useState<OfferPricingData>(
    defaultOfferPricingData,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (field: string, value: string) => {
    setOfferData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOfferCardChange = (field: string, value: string) => {
    setOfferData((prev) => ({
      ...prev,
      offer_card: {
        ...prev.offer_card,
        [field]: value,
      },
    }));
  };

  const handleButtonChange = (field: string, value: string) => {
    setOfferData((prev) => ({
      ...prev,
      offer_card: {
        ...prev.offer_card,
        button: {
          ...prev.offer_card.button,
          [field]: value,
        },
      },
    }));
  };

  const addFeature = () => {
    setOfferData((prev) => ({
      ...prev,
      offer_card: {
        ...prev.offer_card,
        features: [...prev.offer_card.features, ""],
      },
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setOfferData((prev) => ({
      ...prev,
      offer_card: {
        ...prev.offer_card,
        features: prev.offer_card.features.map((feature, i) =>
          i === index ? value : feature,
        ),
      },
    }));
  };

  const removeFeature = (index: number) => {
    if (offerData.offer_card.features.length > 1) {
      setOfferData((prev) => ({
        ...prev,
        offer_card: {
          ...prev.offer_card,
          features: prev.offer_card.features.filter((_, i) => i !== index),
        },
      }));
    }
  };

  const addGuarantee = () => {
    setOfferData((prev) => ({
      ...prev,
      offer_card: {
        ...prev.offer_card,
        guarantees: [...prev.offer_card.guarantees, ""],
      },
    }));
  };

  const updateGuarantee = (index: number, value: string) => {
    setOfferData((prev) => ({
      ...prev,
      offer_card: {
        ...prev.offer_card,
        guarantees: prev.offer_card.guarantees.map((guarantee, i) =>
          i === index ? value : guarantee,
        ),
      },
    }));
  };

  const removeGuarantee = (index: number) => {
    if (offerData.offer_card.guarantees.length > 1) {
      setOfferData((prev) => ({
        ...prev,
        offer_card: {
          ...prev.offer_card,
          guarantees: prev.offer_card.guarantees.filter((_, i) => i !== index),
        },
      }));
    }
  };

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from("offer_pricing")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading data:", error);
        return;
      }

      if (data) {
        setOfferData(data.content);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from("offer_pricing").upsert({
        id: 1,
        content: offerData,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error saving data:", error);
        alert("Error saving Offer/Pricing section. Please try again.");
      } else {
        alert("Offer/Pricing section saved successfully!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving Offer/Pricing section. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Offer / Pricing Section
        </h2>
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

      {/* Section Headers */}
      <Card>
        <CardHeader>
          <CardTitle>Section Headers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="promo-text">Promo Text</Label>
            <Input
              id="promo-text"
              value={offerData.promo_text}
              onChange={(e) => handleChange("promo_text", e.target.value)}
              placeholder="Enter promo text..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="section-title">Main Title</Label>
            <Input
              id="section-title"
              value={offerData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter main title..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="section-subtitle">Subtitle</Label>
            <Input
              id="section-subtitle"
              value={offerData.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter subtitle..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Offer Card */}
      <Card className="border-2 border-orange-100">
        <CardHeader>
          <CardTitle>Offer Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={offerData.offer_card.product_name}
                onChange={(e) =>
                  handleOfferCardChange("product_name", e.target.value)
                }
                placeholder="Enter product name..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="old-price">Old Price</Label>
              <Input
                id="old-price"
                value={offerData.offer_card.old_price}
                onChange={(e) =>
                  handleOfferCardChange("old_price", e.target.value)
                }
                placeholder="$42.99"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-price">New Price</Label>
              <Input
                id="new-price"
                value={offerData.offer_card.new_price}
                onChange={(e) =>
                  handleOfferCardChange("new_price", e.target.value)
                }
                placeholder="$31.95"
                className="mt-1"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Product Features</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Feature
              </Button>
            </div>
            <div className="space-y-2">
              {offerData.offer_card.features.map((feature, index) => (
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
                    disabled={offerData.offer_card.features.length === 1}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Button Configuration */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Label className="text-sm font-medium text-blue-800 mb-3 block">
              Call-to-Action Button
            </Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="button-label">Button Label</Label>
                <Input
                  id="button-label"
                  value={offerData.offer_card.button.label}
                  onChange={(e) => handleButtonChange("label", e.target.value)}
                  placeholder="Enter button label..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="button-popup-title">Popup Title</Label>
                <Input
                  id="button-popup-title"
                  value={offerData.offer_card.button.popup_title}
                  onChange={(e) =>
                    handleButtonChange("popup_title", e.target.value)
                  }
                  placeholder="Enter popup title..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="button-popup-link">Popup Modal Link</Label>
                <div className="flex items-center gap-2 mt-1">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <Input
                    id="button-popup-link"
                    value={offerData.offer_card.button.popup_link}
                    onChange={(e) =>
                      handleButtonChange("popup_link", e.target.value)
                    }
                    placeholder="Enter popup modal link..."
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Trust Guarantees</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addGuarantee}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Guarantee
              </Button>
            </div>
            <div className="space-y-2">
              {offerData.offer_card.guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      value={guarantee}
                      onChange={(e) => updateGuarantee(index, e.target.value)}
                      placeholder="Enter guarantee text..."
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeGuarantee(index)}
                    disabled={offerData.offer_card.guarantees.length === 1}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg">
            <div className="text-center mb-6">
              <Badge variant="secondary" className="mb-4">
                {offerData.promo_text}
              </Badge>
              <h3 className="text-2xl font-bold mb-2">{offerData.title}</h3>
              <p className="text-gray-600">{offerData.subtitle}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <h4 className="font-semibold mb-3">
                {offerData.offer_card.product_name}
              </h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-500 line-through">
                  {offerData.offer_card.old_price}
                </span>
                <span className="text-green-600 font-bold text-xl">
                  {offerData.offer_card.new_price}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {offerData.offer_card.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full mb-4" disabled>
                {offerData.offer_card.button.label}
              </Button>

              <div className="flex justify-between text-xs text-gray-500">
                {offerData.offer_card.guarantees.map((guarantee, index) => (
                  <span key={index}>{guarantee}</span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
