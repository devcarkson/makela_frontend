import React from 'react';
import FeaturedSlider from './FeaturedSlider';

const TestSlider = () => {
  const featuredProducts: any[] = [];
  const newArrivals: any[] = [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">Slider Test</h1>
      
      <FeaturedSlider 
        products={featuredProducts} 
        title="Featured Products (Auto-sliding)" 
      />
      
      <FeaturedSlider 
        products={newArrivals} 
        title="New Arrivals (Auto-sliding)" 
      />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>• Sliders auto-advance every 4 seconds</p>
        <p>• Hover to pause auto-sliding</p>
        <p>• Click indicators to jump to specific slides</p>
        <p>• Use arrow buttons for manual navigation</p>
      </div>
    </div>
  );
};

export default TestSlider;