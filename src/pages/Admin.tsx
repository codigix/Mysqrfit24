import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties, useCreateProperty, useUpdateProperty, useDeleteProperty } from '@/hooks/useProperties';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property } from '@/types/property';
import { Plus, Edit, Trash2, Building, Eye, MapPin, LogOut, Upload, X, MessageSquare, User, Phone, MapPinIcon } from 'lucide-react';
import { uploadImage, deleteImage } from '@/lib/imageUpload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatbotInquiry {
  id: string;
  property_type: 'rent' | 'buy';
  budget: string;
  location: string;
  contact: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: properties, isLoading } = useProperties();
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  
  const [inquiries, setInquiries] = useState<ChatbotInquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [uploading, setUploading] = useState<boolean[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'sale' as 'sale' | 'rent',
    property_type: 'apartment' as 'apartment' | 'house' | 'villa' | 'commercial' | 'land',
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    address: '',
    features: [] as string[],
    images: [''],
    developer_name: '',
    developer_phone: '',
    developer_whatsapp: '',
    is_featured: false,
    // Conditional fields
    plot_facing: '',
    plot_type: '',
    commercial_type: '',
    floor_number: '',
    furnishing: '',
    deposit: '',
  });

  // Features based on listing type and property type
  const getAvailableFeatures = (type: string, propertyType: string) => {
    const commonFeatures = ['parking', 'security', 'wifi'];
    const saleFeatures = ['garden', 'pool', 'gym', 'balcony', 'fireplace', 'terrace', 'study_room'];
    const rentFeatures = ['furnished', 'semi_furnished', 'unfurnished', 'maintenance_included', 'power_backup'];
    
    const residentialFeatures = ['balcony', 'garden', 'pool', 'gym', 'children_play_area'];
    const commercialFeatures = ['conference_room', 'reception', 'pantry', 'server_room', 'parking_slots'];
    const landFeatures = ['corner_plot', 'facing_road', 'clear_title', 'development_ready'];
    
    let features = [...commonFeatures];
    
    // Add type-specific features
    if (type === 'sale') {
      features = [...features, ...saleFeatures];
    } else {
      features = [...features, ...rentFeatures];
    }
    
    // Add property-type specific features
    if (['apartment', 'house', 'villa'].includes(propertyType)) {
      features = [...features, ...residentialFeatures];
    } else if (propertyType === 'commercial') {
      features = [...features, ...commercialFeatures];
    } else if (propertyType === 'land') {
      features = [...features, ...landFeatures];
    }
    
    return [...new Set(features)]; // Remove duplicates
  };

  // Fields that should be shown/hidden based on property type
  const getVisibleFields = (propertyType: string) => {
    const residential = ['apartment', 'house', 'villa'];
    return {
      bedrooms: residential.includes(propertyType),
      bathrooms: residential.includes(propertyType),
      furnished: propertyType !== 'land',
      floor_details: residential.includes(propertyType) || propertyType === 'commercial',
      plot_details: propertyType === 'land',
      commercial_details: propertyType === 'commercial'
    };
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      type: 'sale',
      property_type: 'apartment',
      bedrooms: '',
      bathrooms: '',
      area: '',
      location: '',
      address: '',
      features: [],
      images: [''],
      developer_name: '',
      developer_phone: '',
      developer_whatsapp: '',
      is_featured: false,
      plot_facing: '',
      plot_type: '',
      commercial_type: '',
      floor_number: '',
      furnishing: '',
      deposit: '',
    });
    setEditingProperty(null);
    setUploading([]);
  };

  const openDialog = (property?: Property) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        title: property.title,
        description: property.description || '',
        price: property.price.toString(),
        type: property.type,
        property_type: property.property_type,
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        area: property.area.toString(),
        location: property.location,
        address: property.address,
        features: property.features || [],
        images: property.images || [''],
        developer_name: property.developer_name,
        developer_phone: property.developer_phone,
        developer_whatsapp: property.developer_whatsapp || '',
        is_featured: property.is_featured || false,
        plot_facing: '',
        plot_type: '',
        commercial_type: '',
        floor_number: '',
        furnishing: '',
        deposit: '',
      });
      setUploading(new Array(property.images?.length || 1).fill(false));
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const propertyData = {
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
      area: parseFloat(formData.area),
      images: formData.images.filter(img => img.trim() !== ''),
      // Handle new optional fields - convert empty strings to null
      plot_facing: formData.plot_facing || null,
      plot_type: formData.plot_type || null,
      commercial_type: formData.commercial_type || null,
      floor_number: formData.floor_number || null,
      furnishing: formData.furnishing || null,
      deposit: formData.deposit ? parseFloat(formData.deposit) : null,
    };

    if (editingProperty) {
      updateProperty.mutate({ id: editingProperty.id, ...propertyData });
    } else {
      createProperty.mutate(propertyData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteProperty.mutate(id);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleFileUpload = async (index: number, file: File) => {
    try {
      const newUploading = [...uploading];
      newUploading[index] = true;
      setUploading(newUploading);

      const imageUrl = await uploadImage(file);
      handleImageChange(index, imageUrl);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      const newUploading = [...uploading];
      newUploading[index] = false;
      setUploading(newUploading);
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
    setUploading([...uploading, false]);
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newUploading = uploading.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setUploading(newUploading);
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    setFormData({ ...formData, features: newFeatures });
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    
    return type === 'rent' ? `${formatted}/month` : formatted;
  };

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const { data, error } = await supabase
        .from('chatbot_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inquiries:', error);
        toast({
          title: "Error",
          description: "Failed to load inquiries.",
          variant: "destructive",
        });
      } else {
        setInquiries((data || []) as ChatbotInquiry[]);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of the admin panel.",
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Manage your property listings and inquiries</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Chatbot Inquiries</TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Property
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Listing Type *</Label>
                    <Select value={formData.type} onValueChange={(value: 'sale' | 'rent') => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="property_type">Property Type *</Label>
                    <Select value={formData.property_type} onValueChange={(value: any) => setFormData({ ...formData, property_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Conditional fields based on property type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getVisibleFields(formData.property_type).bedrooms && (
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      />
                    </div>
                  )}
                  
                  {getVisibleFields(formData.property_type).bathrooms && (
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="area">
                      Area ({formData.property_type === 'land' ? 'sq yards' : 'sqft'}) *
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Additional conditional fields */}
                {formData.property_type === 'land' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plot_facing">Plot Facing</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, plot_facing: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facing direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="north">North</SelectItem>
                          <SelectItem value="south">South</SelectItem>
                          <SelectItem value="east">East</SelectItem>
                          <SelectItem value="west">West</SelectItem>
                          <SelectItem value="north-east">North-East</SelectItem>
                          <SelectItem value="south-east">South-East</SelectItem>
                          <SelectItem value="north-west">North-West</SelectItem>
                          <SelectItem value="south-west">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="plot_type">Plot Type</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, plot_type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plot type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="agricultural">Agricultural</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {formData.property_type === 'commercial' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="commercial_type">Commercial Type</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, commercial_type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select commercial type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office">Office Space</SelectItem>
                          <SelectItem value="retail">Retail Shop</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="showroom">Showroom</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="floor_number">Floor Number</Label>
                      <Input
                        id="floor_number"
                        type="number"
                        placeholder="e.g., 1, 2, Ground"
                        onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {formData.type === 'rent' && formData.property_type !== 'land' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="furnishing">Furnishing Status</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, furnishing: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select furnishing status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="furnished">Fully Furnished</SelectItem>
                          <SelectItem value="semi_furnished">Semi Furnished</SelectItem>
                          <SelectItem value="unfurnished">Unfurnished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="deposit">Security Deposit</Label>
                      <Input
                        id="deposit"
                        type="number"
                        placeholder="Enter deposit amount"
                        onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Features ({formData.type === 'sale' ? 'Sale' : 'Rental'} specific)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {getAvailableFeatures(formData.type, formData.property_type).map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={formData.features.includes(feature)}
                          onCheckedChange={() => toggleFeature(feature)}
                        />
                        <Label htmlFor={feature} className="capitalize text-sm">
                          {feature.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Images</Label>
                  <div className="space-y-3 mt-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Image URL or upload file below"
                            value={image}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                          />
                          {formData.images.length > 1 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              onClick={() => removeImageField(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">or</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={uploading[index]}
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  handleFileUpload(index, file);
                                }
                              };
                              input.click();
                            }}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            {uploading[index] ? 'Uploading...' : 'Upload File'}
                          </Button>
                        </div>
                        
                        {image && (
                          <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addImageField}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Another Image
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="developer_name">Developer Name *</Label>
                    <Input
                      id="developer_name"
                      value={formData.developer_name}
                      onChange={(e) => setFormData({ ...formData, developer_name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="developer_phone">Developer Phone *</Label>
                    <Input
                      id="developer_phone"
                      value={formData.developer_phone}
                      onChange={(e) => setFormData({ ...formData, developer_phone: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="developer_whatsapp">WhatsApp Number</Label>
                    <Input
                      id="developer_whatsapp"
                      value={formData.developer_whatsapp}
                      onChange={(e) => setFormData({ ...formData, developer_whatsapp: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: !!checked })}
                  />
                  <Label htmlFor="is_featured">Mark as Featured</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProperty ? 'Update Property' : 'Create Property'}
                  </Button>
                </div>
              </form>
            </DialogContent>
            </Dialog>
            </div>

            {/* Properties List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : properties && properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {properties.map((property) => (
                    <Card key={property.id} className="group hover:shadow-card transition-shadow">
                  {property.is_featured && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
                        Featured
                      </Badge>
                    </div>
                  )}
                  
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={property.images?.[0] || '/placeholder.svg'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${
                        property.type === 'sale' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      For {property.type === 'sale' ? 'Sale' : 'Rent'}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {formatPrice(property.price, property.type)}
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => openDialog(property)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => window.open(`/property/${property.id}`, '_blank')}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Property</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{property.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(property.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first property listing</p>
                <Button onClick={() => openDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Property
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Inquiries Tab */}
        <TabsContent value="inquiries" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Chatbot Inquiries</h2>
            <Button onClick={fetchInquiries} variant="outline">
              Refresh
            </Button>
          </div>

          {inquiriesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : inquiries.length > 0 ? (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={inquiry.property_type === 'rent' ? 'secondary' : 'default'}>
                            {inquiry.property_type === 'rent' ? 'Rent' : 'Buy'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Budget</p>
                              <p className="text-sm text-muted-foreground">{inquiry.budget}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Location</p>
                              <p className="text-sm text-muted-foreground">{inquiry.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Contact</p>
                              <p className="text-sm text-muted-foreground">{inquiry.contact}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Inquiries Yet</h3>
              <p className="text-muted-foreground">Chatbot inquiries will appear here when users interact with your chatbot.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
};

export default Admin;