
import React, { useState, useEffect } from 'react';
import {
  fetchProfile,
  updateProfile,
  fetchAccountStats,
  UserProfile
} from '@/api/profile';
import { User, Mail, Phone, MapPin, Calendar, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Profile = () => {
  const { email } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [originalData, setOriginalData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalOrders: number;
    totalSpent: number;
    wishlistItems: number;
    memberSince: string;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProfile()
      .then(data => {
        setFormData(data);
        setOriginalData(data);
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
    setStatsLoading(true);
    fetchAccountStats()
      .then(data => setStats(data))
      .catch(() => setStatsError('Failed to load statistics'))
      .finally(() => setStatsLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
  };

  const handleSave = async () => {
    if (!formData) return;
    // Convert empty date_of_birth to null
    const payload = {
      ...formData,
      date_of_birth: formData.date_of_birth === '' ? null : formData.date_of_birth,
    };
    try {
      const updated = await updateProfile(payload);
      setFormData(updated);
      setOriginalData(updated);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      if (err?.response?.data) {
        toast.error(
          typeof err.response.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response.data)
        );
      } else {
        toast.error('Failed to update profile');
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(originalData);
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }
  if (error || !formData) {
    return <div className="text-center text-destructive py-8">{error || 'Profile not found.'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and account settings.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={formData.avatarUrl || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {formData.first_name?.[0] || '?'}{formData.last_name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" disabled>
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              {/* <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth (optional)</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account Stats */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="text-center py-4">Loading statistics...</div>
          ) : statsError || !stats ? (
            <div className="text-center text-destructive py-4">{statsError || 'No statistics found.'}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalOrders}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">£{stats.totalSpent.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.wishlistItems}</div>
                <div className="text-sm text-muted-foreground">Wishlist Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.memberSince}</div>
                <div className="text-sm text-muted-foreground">Member Since</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
