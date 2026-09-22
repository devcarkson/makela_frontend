
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 bg-brand-50 min-h-screen">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-2 border-brand-200">
            <CardHeader className="text-center bg-brand-600 text-primary-foreground rounded-t-lg">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-brand-400" />
              </div>
              <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
              <CardDescription className="text-brand-100">
                We've sent a password reset link to your email
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <p className="text-brand-700 mb-6">
                If you don't see the email, check your spam folder or try again.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  variant="outline"
                  className="w-full border-brand-300 text-brand-700 hover:bg-brand-100"
                >
                  Try another email
                </Button>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="w-full text-brand-600 hover:text-brand-700 hover:bg-brand-100"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-brand-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-2 border-brand-200">
          <CardHeader className="text-center bg-brand-600 text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
            <CardDescription className="text-brand-100">
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-brand-700 font-semibold">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-brand-200 focus:border-brand-400"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-brand-600 hover:bg-brand-700 text-primary-foreground font-semibold py-3"
              >
                Send reset link
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-brand-600 hover:text-brand-700 hover:bg-brand-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
