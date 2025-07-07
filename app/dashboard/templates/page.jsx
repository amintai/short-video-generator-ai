"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { Brush, ImageIcon, VideoIcon, Star } from "lucide-react";

// Mock Templates Data -- Replace with API integration
const mockTemplates = [
  {
    id: 1,
    name: "Marketing Video",
    description: "Perfect for promoting your product or service.",
    category: "Marketing",
    image: "/public/realistic.jpeg",
    isPremium: true,
  },
  {
    id: 2,
    name: "Educational Explainer",
    description: "Great for explaining concepts and tutorials.",
    category: "Education",
    image: "/public/real.jpg",
    isPremium: false,
  },
  {
    id: 3,
    name: "Social Media Clip",
    description: "Ideal for eye-catching content on social platforms.",
    category: "Social",
    image: "/public/comic.jpeg",
    isPremium: false,
  },
  {
    id: 4,
    name: "Business Overview",
    description: "Showcase your company's strengths and key values.",
    category: "Business",
    image: "/public/fantasy.jpg",
    isPremium: true,
  },
];

const Templates = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Load templates from API, here we use mock data
    setTemplates(mockTemplates);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brush className="w-4 h-4" /> Explore Templates
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Find the perfect template
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through a variety of customizable video templates to suit your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="shadow-lg">
              <CardHeader className="relative group">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-48 object-cover rounded-t-2xl group-hover:opacity-80 transition"
                />
                {template.isPremium && (
                  <div className="absolute top-3 right-3 bg-yellow-300 text-yellow-800 rounded-full px-3 py-0.5 text-xs font-bold">
                    <Star className="inline-block w-3 h-3 mr-1" /> Premium
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl font-bold mb-2">{template.name}</CardTitle>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <span className="inline-block bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {template.category}
                </span>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button variant="outline">
                  Customize
                </Button>
                <Button>
                  Preview
                  <VideoIcon className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
