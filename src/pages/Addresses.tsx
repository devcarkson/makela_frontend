
import React, { useState, useEffect } from 'react';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  splitPhone,
  joinPhone,
  Address as AddressType
} from '@/api/addresses';
import { apiErrorMessage } from '@/api/client';
import { Plus, MapPin, Edit, Trash2, Home, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UK_EU_COUNTRIES, getStatesForCountry, getStateLabel } from '@/utils/countries';
import { toast } from 'sonner';

const EMPTY_FORM = {
  type: 'home' as 'home' | 'work' | 'other',
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  country: 'GB',
  zipCode: '',
  phoneCountryCode: '+44',
  phone: '',
};

const PHONE_COUNTRY_CODES = UK_EU_COUNTRIES.map(country => country.phoneCode);

// Everything the checkout shipping step needs.
const REQUIRED_FIELDS: Array<{ key: keyof typeof EMPTY_FORM; label: string }> = [
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'street', label: 'Street address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State/Region' },
  { key: 'country', label: 'Country' },
  { key: 'zipCode', label: 'Postcode' },
  { key: 'phone', label: 'Phone number' },
];

const countryName = (code?: string): string =>
  UK_EU_COUNTRIES.find(country => country.code === (code ?? '').toUpperCase())?.name ?? (code || '—');

const Addresses = () => {
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  const resetForm = () => {
    setFormData({ ...EMPTY_FORM });
    setEditingAddress(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTypeChange = (value: 'home' | 'work' | 'other') => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleCountryChange = (value: string) => {
    const phoneCode = UK_EU_COUNTRIES.find(country => country.code === value)?.phoneCode;
    setFormData(prev => ({
      ...prev,
      country: value,
      phoneCountryCode: phoneCode ?? prev.phoneCountryCode,
      // Regions are country specific, so the old value cannot be kept.
      state: '',
    }));
  };

  useEffect(() => {
    let cancelled = false;
    const loadAddresses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAddresses();
        if (cancelled) return;
        setAddresses(data);
      } catch (err: unknown) {
        if (cancelled) return;
        console.warn('Addresses: failed to fetch addresses:', err);
        setError(apiErrorMessage(err, 'Failed to load addresses'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadAddresses();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async () => {
    const missing = REQUIRED_FIELDS.find(({ key, label }) => !formData[key]?.trim());
    if (missing) {
      toast.error(`${missing.label} is required`);
      return;
    }

    const payload = {
      ...formData,
      // Store one international number so checkout can always reuse it.
      phone: joinPhone(formData.phoneCountryCode, formData.phone),
    };

    try {
      if (editingAddress) {
        const updated = await updateAddress(editingAddress.id, payload);
        setAddresses(prev => prev.map(addr => addr.id === updated.id ? updated : addr));
        toast.success('Address updated successfully');
      } else {
        const created = await addAddress(payload);
        setAddresses(prev => [...prev, created]);
        toast.success('Address added successfully');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Failed to save address'));
    }
  };

  const handleEdit = (address: AddressType) => {
    const { code, number } = splitPhone(address.phone);
    setEditingAddress(address);
    setFormData({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      state: address.state,
      country: (address.country ?? 'GB').toUpperCase(),
      zipCode: address.zipCode ?? '',
      phoneCountryCode: PHONE_COUNTRY_CODES.includes(code) ? code : '+44',
      phone: number,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast.success('Address deleted successfully');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const updated = await setDefaultAddress(id);
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === id })));
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to set default address');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'work': return <Briefcase className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'home': return 'default';
      case 'work': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Addresses</h1>
          <p className="text-muted-foreground">Manage your delivery addresses.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Address Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={handleCountryChange}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent position="item">
                      {UK_EU_COUNTRIES.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State/Region *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={value => setFormData(prev => ({ ...prev, state: value }))}
                    disabled={!formData.country}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder={formData.country ? 'Select Region' : 'Select Country First'} />
                    </SelectTrigger>
                    <SelectContent position="item">
                      {getStatesForCountry(formData.country).map(state => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">Postcode / ZIP *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.phoneCountryCode}
                    onValueChange={value => setFormData(prev => ({ ...prev, phoneCountryCode: value }))}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="+44" />
                    </SelectTrigger>
                    <SelectContent position="item">
                      {PHONE_COUNTRY_CODES.map(code => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingAddress ? 'Update Address' : 'Add Address'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading addresses...</div>
      ) : error ? (
        <div className="text-center text-destructive py-8">{error}</div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(address.type)}
                      <Badge variant={getTypeColor(address.type)}>
                        {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                      </Badge>
                      {address.isDefault && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {address.firstName} {address.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.street}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {getStateLabel(address.country, address.state)}
                        {address.zipCode ? `, ${address.zipCode}` : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">{countryName(address.country)}</p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      disabled={address.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
