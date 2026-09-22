
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About Makela</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
At Makela, we're committed to providing high-quality, sustainable products
                that make a positive impact on both your life and the environment. We believe 
                in responsible commerce that benefits everyone.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
Founded in 2025, Makela began as a small initiative to make eco-friendly
                products more accessible to everyone. Today, we're proud to serve customers 
                worldwide with our carefully curated selection of sustainable goods.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-6">Why Choose Makela?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl">🌱</span>
              </div>
              <h3 className="font-semibold mb-2">Sustainable Products</h3>
              <p className="text-muted-foreground text-sm">
                Every product is carefully selected for its environmental impact and sustainability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl">✨</span>
              </div>
              <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground text-sm">
                We stand behind every product with our quality guarantee and excellent customer service.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground text-sm">
                Quick and reliable shipping with eco-friendly packaging materials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
