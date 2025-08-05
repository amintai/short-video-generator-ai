"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../@/components/ui/select";
import { Upload, Link2, Loader2, Image } from "lucide-react";
import toast from "react-hot-toast";

const ProductInputForm = ({ formData, onProductDataChange, onToneChange, onLanguageChange }) => {
  const [inputMode, setInputMode] = useState("manual"); // "manual" or "url"
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const handleManualInput = (field, value) => {
    onProductDataChange({ ...formData, [field]: value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreviewImage(imageUrl);
        onProductDataChange({ ...formData, productImage: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlFetch = async () => {
    if (!productUrl.trim()) {
      toast.error("Please enter a valid product URL");
      return;
    }

    setIsLoadingUrl(true);
    try {
      // This would typically call your API to scrape product data
      const response = await fetch("/api/scrape-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl })
      });

      const data = await response.json();
      
      if (data.success) {
        onProductDataChange({
          ...formData,
          productName: data.name,
          productDescription: data.description,
          productImage: data.image
        });
        setPreviewImage(data.image);
        toast.success("Product details fetched successfully!");
      } else {
        toast.error("Failed to fetch product details");
      }
    } catch (error) {
      toast.error("Error fetching product details");
      console.error(error);
    } finally {
      setIsLoadingUrl(false);
    }
  };

const tones = [
  { value: "excited", label: "🤩 Excited", description: "High energy, very enthusiastic" },
  { value: "casual", label: "😊 Casual", description: "Friendly and relaxed" },
  { value: "professional", label: "👔 Professional", description: "Polished and credible" },
  { value: "enthusiastic", label: "🔥 Enthusiastic", description: "Passionate and engaging" },
  { value: "friendly", label: "🤗 Friendly", description: "Warm and approachable" },
  { value: "serious", label: "😐 Serious", description: "Straightforward and earnest" }
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
  { value: "jp", label: "Japanese" }
];

  return (
    <div className="space-y-6">
      {/* Input Mode Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setInputMode("manual")}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            inputMode === "manual"
              ? "bg-white text-violet-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Manual Input
        </button>
        <button
          onClick={() => setInputMode("url")}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            inputMode === "url"
              ? "bg-white text-violet-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          From URL
        </button>
      </div>

      {inputMode === "manual" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <Input
              placeholder="Enter product name..."
              value={formData.productName || ""}
              onChange={(e) => handleManualInput("productName", e.target.value)}
              className="rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description *
            </label>
            <textarea
              placeholder="Describe your product..."
              rows={4}
              value={formData.productDescription || ""}
              onChange={(e) => handleManualInput("productDescription", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm resize-none"
            />
          </div>

          {/* Product Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <Upload className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Upload Image</span>
                </div>
              </label>
              
              {previewImage && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={previewImage}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product URL *
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/product"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
              />
              <Button
                onClick={handleUrlFetch}
                disabled={isLoadingUrl}
                className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl px-6"
              >
                {isLoadingUrl ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Fetched Product Details */}
          {formData.productName && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">Fetched Product Details:</h4>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Name:</strong> {formData.productName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Description:</strong> {formData.productDescription}
              </p>
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Product"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Language, Tone, 6 Voice Style Selection */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <Select onValueChange={onLanguageChange} defaultValue="en">
            <SelectTrigger className="rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone
          </label>
          <Select onValueChange={onToneChange} defaultValue="excited">
            <SelectTrigger className="rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voice Style
          </label>
          <Select onValueChange={(value) => onProductDataChange({ ...formData, voiceStyle: value })} defaultValue="friendly">
            <SelectTrigger className="rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {["friendly", "corporate", "excited", "serious"].map((style) => (
                <SelectItem key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProductInputForm;
