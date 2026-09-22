import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner'; // ✅ Make sure you use `sonner` toast

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: ['Passwords do not match'] });
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setErrors({ acceptTerms: ['You must accept the terms and conditions'] });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        first_name: formData.first_name,
        last_name: formData.last_name,
      };

      await axios.post('https://makelacosmetic.uk/api/auth/register/', payload);

      toast.success('🎉 Account created! You can now log in.');
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrors(error.response.data);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-brand-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-2 border-brand-100">
          <CardHeader className="text-center bg-brand-600 text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription className="text-brand-100">
              Join Makela and start shopping today
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <Label htmlFor="first_name" className="text-brand-700 font-semibold">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
                {errors.first_name && <p className="text-destructive text-sm mt-1">{errors.first_name[0]}</p>}
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="last_name" className="text-brand-700 font-semibold">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
                {errors.last_name && <p className="text-destructive text-sm mt-1">{errors.last_name[0]}</p>}
              </div>

              {/* Username */}
              <div>
                <Label htmlFor="username" className="text-brand-700 font-semibold">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                {errors.username && <p className="text-destructive text-sm mt-1">{errors.username[0]}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-brand-700 font-semibold">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email[0]}</p>}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-brand-700 font-semibold">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone[0]}</p>}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-brand-700 font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-brand-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-destructive text-sm mt-1">{errors.password[0]}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-brand-700 font-semibold">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-brand-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword[0]}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                  }
                />
                <Label htmlFor="acceptTerms" className="text-sm text-brand-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline font-semibold">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && <p className="text-destructive text-sm mt-1">{errors.acceptTerms[0]}</p>}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 text-primary-foreground font-semibold py-3 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-primary-foreground" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="bg-brand-200" />
              <div className="mt-6 text-center">
                <p className="text-sm text-brand-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
