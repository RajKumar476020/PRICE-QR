import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Store,
  Clock,
  Image,
  UtensilsCrossed,
  QrCode,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { QRGenerator } from '../../components/ui/QRGenerator';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { toast } from '../../components/ui/Toast';

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { setBusinesses, setCurrentBusiness } = useAuthStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Restaurant');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [currency, setCurrency] = useState('₹');

  // Branding
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  // Hours
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('22:00');

  // First Menu Item
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('Main Course');
  const [productImage, setProductImage] = useState('');

  // Result from creation
  const [createdBusiness, setCreatedBusiness] = useState<any>(null);

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      toast.error('Please enter your business name');
      return;
    }
    if (step < 5) {
      setStep((s) => s + 1);
    } else if (step === 5) {
      handleFinalSubmission();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleFinalSubmission = async () => {
    setLoading(true);
    try {
      // 1. Create Business
      const businessData = {
        name: name.trim(),
        category,
        tagline: tagline.trim() || undefined,
        description: description.trim() || undefined,
        phone: phone.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        website: website.trim() || undefined,
        instagram: instagram.trim() || undefined,
        currency,
        logoUrl: logoUrl.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
      };

      const business = await api.createBusiness(businessData);

      // 2. Create initial category & first product if provided
      if (productName.trim() && productPrice) {
        try {
          const cat = await api.createCategory(business.id, {
            name: productCategory.trim() || 'General Menu',
          });

          await api.createProduct(business.id, {
            name: productName.trim(),
            categoryId: cat.id,
            price: parseFloat(productPrice),
            imageUrl: productImage.trim() || undefined,
          });
        } catch (e) {
          console.error('Failed to create initial product during onboarding:', e);
        }
      }

      // Update store
      const allBusinesses = await api.getMyBusinesses();
      setBusinesses(allBusinesses);
      setCurrentBusiness(business);
      setCreatedBusiness(business);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      toast.success('Your digital business is live!');
      setStep(6);
    } catch (err: any) {
      toast.error('Setup error', err.message || 'Could not complete business creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl w-full mx-auto">
        {/* Progress Bar & Step Counter */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>
              Step {step} of 6: {step === 1 && 'Business Basics'}
              {step === 2 && 'Contact & Info'}
              {step === 3 && 'Branding'}
              {step === 4 && 'Opening Hours'}
              {step === 5 && 'First Menu Item'}
              {step === 6 && 'Ready to Scan!'}
            </span>
            <span>{Math.round((step / 6) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white p-6 sm:p-9 rounded-3xl border border-slate-200/90 shadow-card">
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-left">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Step 1
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Let's create your business.
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Start with the name and industry category that best represents your brand.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <Input
                  label="Business Name *"
                  placeholder="e.g. Copper Chimney Cafe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />

                <Select
                  label="Business Category *"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Retail">Retail Store & Boutique</option>
                  <option value="Salon">Salon, Spa & Beauty Care</option>
                  <option value="Fitness">Gym & Fitness Center</option>
                  <option value="Healthcare">Healthcare & Clinic</option>
                  <option value="Auto Repair">Auto Repair & Garage</option>
                  <option value="Electronics">Electronics, Mobile & IT</option>
                  <option value="Home Services">Home Maintenance & Services</option>
                  <option value="Professional">Professional Services & Consulting</option>
                  <option value="Grocery store">Grocery & Gourmet Supermarket</option>
                  <option value="Bakery">Artisan Bakery & Pastry</option>
                  <option value="Cafe">Cafe & Coffee Roastery</option>
                  <option value="Restaurant">Restaurant & Bistro</option>
                  <option value="Service">General Services & Other</option>
                </Select>

                <Input
                  label="Tagline (Optional)"
                  placeholder="e.g. Quality products, fast service & transparent prices"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />

                <Select
                  label="Currency Symbol"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="₹">₹ (INR)</option>
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="AED">AED (Dirham)</option>
                </Select>
              </div>
            </div>
          )}

          {/* STEP 2: Contact & Location */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-left">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Step 2
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Business Information & Contacts
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  How should customers contact you or locate your physical storefront?
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <Textarea
                  label="About Your Business"
                  placeholder="Tell your customers about your story, ingredients, specialties..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    placeholder="+91 98765 43210"
                    leftIcon={<Phone className="w-4 h-4" />}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input
                    label="WhatsApp Number"
                    placeholder="+91 98765 43210"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Street Address"
                    placeholder="Shop 12, High Street"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Input
                    label="City / Area"
                    placeholder="Indiranagar, Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Website (Optional)"
                    placeholder="https://yourbrand.com"
                    leftIcon={<Globe className="w-4 h-4" />}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                  <Input
                    label="Instagram Username (Optional)"
                    placeholder="e.g. copperchimney"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Branding */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-left">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Step 3
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Branding & Visuals
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Add your brand logo and storefront cover image to wow customers when they scan.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <ImageUpload
                  label="Brand Logo"
                  value={logoUrl}
                  onChange={setLogoUrl}
                  aspectRatio="square"
                  helperText="Upload your company logo or choose a sample"
                />

                <ImageUpload
                  label="Storefront Cover / Banner"
                  value={coverUrl}
                  onChange={setCoverUrl}
                  aspectRatio="banner"
                  helperText="Banner image shown at the top of your digital catalog"
                />

                {/* Quick Presets */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    Or select quick sample visuals:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl(
                          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
                        );
                        setCoverUrl(
                          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
                        );
                      }}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-xs font-semibold text-slate-700"
                    >
                      🍽️ Restaurant & Cafe Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl(
                          'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80',
                        );
                        setCoverUrl(
                          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
                        );
                      }}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-xs font-semibold text-slate-700"
                    >
                      ✂️ Salon & Spa Preset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Opening Hours */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-left">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Step 4
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Set Opening Hours
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Customers will see a live "Open Now" or "Closed" badge based on these hours.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Default Opening Time"
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                  />
                  <Input
                    label="Default Closing Time"
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  You can customize individual daily hours (e.g. weekends vs weekdays) anytime in your business settings.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: First Product or Service */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-left">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Step 5
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Add Your First Product or Service
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Give customers your first item to explore right away when scanning!
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <Input
                  label="Category Name"
                  placeholder="e.g. Services, Hair Styling, Main Menu, or Accessories"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                />

                <Input
                  label="Product / Service Name"
                  placeholder="e.g. Signature Styling, Oil Change, or Sourdough Pizza"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />

                <Input
                  label={`Price (${currency})`}
                  type="number"
                  placeholder="299"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />

                <ImageUpload
                  label="Item Image (Optional)"
                  value={productImage}
                  onChange={setProductImage}
                  aspectRatio="product"
                  helperText="Upload a photo from your device or paste an image URL"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Completion & Ready QR! */}
          {step === 6 && createdBusiness && (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-subtle">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Your digital storefront is ready!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
                  Customers can now scan your unique PriceQR code to view your digital price list, services, and live offers.
                </p>
              </div>

              {/* High Quality QR Card */}
              <div className="py-2">
                <QRGenerator
                  url={`${window.location.origin}/m/${createdBusiness.publicId}`}
                  businessName={createdBusiness.name}
                  businessLogoUrl={createdBusiness.logoUrl}
                  size={220}
                  showActions={true}
                />
              </div>

              {/* Navigation to Dashboard */}
              <div className="pt-4 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/dashboard')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Go to Owner Dashboard
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Controls (Steps 1 to 5) */}
          {step < 6 && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleBack}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {step === 5 ? 'Create Business & QR' : 'Continue'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
