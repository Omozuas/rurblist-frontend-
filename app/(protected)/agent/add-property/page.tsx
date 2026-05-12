'use client';

import { ImageModel } from '@/app/apis/models/image-model';
import { useGetPropertyById } from '@/app/apis/mutations/use-property/use-get-property-by-id';
import { useUploadProperty } from '@/app/apis/mutations/use-property/use-post-property';
import { useUpdateProperty } from '@/app/apis/mutations/use-property/use-update-delete-property';
import { compressImage } from '@/app/apis/utils/compress-image';
import { getCachedCoordinates, setCachedCoordinates } from '@/app/apis/utils/geocode-cache';
import {
  COUNTRY_OPTIONS,
  NIGERIA_STATE_OPTIONS,
  getCityOptions,
} from '@/app/apis/utils/nigeria-location-options';
import ModalHeader from '@/components/agent-c/modal/headder-model';
import { OrangeButton } from '@/components/button/button';
import Dropdown from '@/components/dropdown/dropdown';
import SearchableDropdown from '@/components/dropdown/searchable-dropdown';
import ImageUpload from '@/components/image-upload/image-upload';
import Input from '@/components/input';
import { useLayoutStore } from '@/store/layout-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AMENITIES = [
  // Internet & Utilities
  'WiFi',
  'Cable_TV',
  'Electricity',
  'Water_Supply',
  'Solar_Power',
  'Generator',
  'Inverter',

  // Security
  'Security',
  'CCTV',
  'Gated_Community',
  'Security_Guards',
  'Smart_Lock',
  'Fire_Alarm',
  'Smoke_Detector',

  // Comfort
  'Air_Conditioning',
  'Heating',
  'Ceiling_Fans',

  // Kitchen & Appliances
  'Refrigerator',
  'Microwave',
  'Dishwasher',
  'Washing_Machine',
  'Dryer',
  'Cooker_Oven',

  // Parking & Transport
  'Parking',
  'Garage',
  'EV_Charging',

  // Building Features
  'Elevator',
  'Wheelchair_Access',
  'Storage_Room',

  // Outdoor
  'Balcony',
  'Garden',
  'Terrace',
  'Rooftop',
  'Playground',

  // Lifestyle
  'Swimming_Pool',
  'Gym',
  'Spa',
  'Sauna',
  'Clubhouse',

  // Work / Study
  'Study_Room',
  'Office_Space',
  'Conference_Room',

  // Entertainment
  'Cinema_Room',
  'Game_Room',
  'Barbecue_Area',

  // Cleaning
  'Laundry_Room',
  'Cleaning_Service',

  // Pets
  'Pet_Friendly',

  // Misc
  'Guest_Room',
  'Servant_Quarters',
];

export default function AddNewPropertyPage() {
  const setHideNavbar = useLayoutStore((state) => state.setHideNavbar);
  const router = useRouter();
  const [propertyId, setPropertyId] = useState('');
  const isEditMode = Boolean(propertyId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    status: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    furnishingStatus: 'Unfurnished',
    paymentFrequency: '',
    agentFee: '',
    inspectionFee: '',

    country: 'Nigeria',
    state: '',
    city: '',
    address: '',
    lat: '',
    lng: '',
  });
  const [compressing, setCompressing] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ImageModel[]>([]);
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState<string[]>([]);
  const [, setVideo] = useState<File[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showAmenities, setShowAmenities] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const { mutate: uploadPropertyMutation, isPending } = useUploadProperty();
  const { data: propertyData, isLoading: isLoadingProperty } = useGetPropertyById(propertyId);
  const { mutate: updatePropertyMutation, isPending: isUpdating } = useUpdateProperty();
  const property = propertyData?.data;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationDropdownChange = (name: 'country' | 'state' | 'city', value: string) => {
    setFormData((prev) => {
      if (name === 'country') {
        return {
          ...prev,
          country: value,
          state: value === 'Nigeria' ? prev.state : '',
          city: '',
        };
      }

      if (name === 'state') {
        return {
          ...prev,
          state: value,
          city: '',
        };
      }

      return {
        ...prev,
        city: value,
      };
    });
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    );
  };

  const geocodeAddress = async (address: string) => {
    const cleanAddress = address.trim();

    if (!cleanAddress || isGeocoding) return;

    const cached = getCachedCoordinates(cleanAddress);
    if (cached) {
      setFormData((prev) => ({
        ...prev,
        lat: cached.lat,
        lng: cached.lng,
      }));
      return;
    }

    try {
      setIsGeocoding(true);
      const apiKey = '78d12ab34db94bd29342fc69b9ff8b11';

      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          cleanAddress,
        )}&key=${apiKey}`,
      );

      const data = await res.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        const coordinates = {
          lat: String(lat),
          lng: String(lng),
        };

        setCachedCoordinates(cleanAddress, coordinates);

        setFormData((prev) => ({
          ...prev,
          lat: coordinates.lat,
          lng: coordinates.lng,
        }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsGeocoding(false);
    }
  };
  const handleSaveDraft = () => {
    // TODO: connect draft persistence when the backend supports it.
  };

  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPropertyId(new URLSearchParams(window.location.search).get('propertyId') || '');
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!property) return;

    const timer = window.setTimeout(() => {
      const [lng = '', lat = ''] = property.location?.coordinates?.coordinates ?? [];

      setFormData({
        title: property.title || '',
        description: property.description || '',
        type: property.type || '',
        status: property.status || '',
        price: String(property.price || ''),
        bedrooms: String(property.bedrooms || ''),
        bathrooms: String(property.bathrooms || ''),
        size: String(property.size || ''),
        furnishingStatus: property.furnishingStatus || 'Unfurnished',
        paymentFrequency: property.paymentFrequency || '',
        agentFee: String(property.agentFee || ''),
        inspectionFee: String(property.inspectionFee || ''),
        country: property.location?.country || 'Nigeria',
        state: property.location?.state || '',
        city: property.location?.city || '',
        address: property.location?.address || '',
        lat: String(lat || ''),
        lng: String(lng || ''),
      });
      setAmenities(property.amenities || []);
      setExistingImages(property.images || []);
      setRemovedImagePublicIds([]);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [property]);

  const handleRemoveExistingImage = (publicId: string) => {
    setExistingImages((prev) => prev.filter((image) => image.public_id !== publicId));
    setRemovedImagePublicIds((prev) => [...new Set([...prev, publicId])]);
  };

  const buildPropertyFormData = async () => {
    const data = new FormData();

    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('status', formData.status);
    data.append('price', formData.price);

    if (formData.bedrooms) data.append('bedrooms', formData.bedrooms);

    if (formData.bathrooms) data.append('bathrooms', formData.bathrooms);

    if (formData.size) data.append('size', formData.size);

    if (formData.furnishingStatus) data.append('furnishingStatus', formData.furnishingStatus);

    if (formData.paymentFrequency) data.append('paymentFrequency', formData.paymentFrequency);

    if (formData.agentFee) data.append('agentFee', formData.agentFee);
    if (formData.inspectionFee) data.append('inspectionFee', formData.inspectionFee);

    amenities.forEach((amenity) => {
      data.append('amenities', amenity);
    });
    data.append('address', formData.address);
    data.append('country', formData.country);
    data.append('state', formData.state);
    data.append('city', formData.city);
    data.append('lat', String(formData.lat));
    data.append('lng', String(formData.lng));

    setCompressing(true);
    let compressedImages: File[] = [];

    try {
      compressedImages = await Promise.all(images.map((file) => compressImage(file)));
    } finally {
      setCompressing(false);
    }

    compressedImages.forEach((file) => {
      data.append('images', file, file.name);
    });

    removedImagePublicIds.forEach((publicId) => {
      data.append('removedImagePublicIds', publicId);
    });

    return data;
  };

  const handleSubmitProperty = async () => {
    const data = await buildPropertyFormData();

    if (isEditMode) {
      updatePropertyMutation(
        { propertyId, data },
        {
          onSuccess: () => router.back(),
        },
      );
      return;
    }

    uploadPropertyMutation(data);
  };
  return (
    <div className="min-h-screen bg-white">
      <ModalHeader
        title={isEditMode ? 'Edit Property' : 'Add New Property'}
        onClose={() => router.back()}
      />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {isLoadingProperty && isEditMode ? (
          <AddPropertyFormSkeleton />
        ) : (
          <>
            {/* Basic Details */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#833700] mb-8">Basic Details</h2>

              <div className="space-y-6">
                <Input
                  label="Property title"
                  name="title"
                  className="p-4"
                  placeholder="E.g A luxury 2 bedroom flat"
                  value={formData.title}
                  onChange={handleInputChange}
                />

                <div>
                  <label className="block text-[16px] text-[#3E3E3E] mb-2">Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe the property in full"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#808080] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e87722] resize-none h-32"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#833700] mb-8">Location</h2>

              <div className="space-y-6">
                <SearchableDropdown
                  label="Country"
                  placeholder="Select country"
                  searchPlaceholder="Search country"
                  options={COUNTRY_OPTIONS}
                  value={formData.country}
                  onChange={(value) => handleLocationDropdownChange('country', value)}
                />

                <SearchableDropdown
                  label="State"
                  placeholder="Select state"
                  searchPlaceholder="Search state"
                  options={formData.country === 'Nigeria' ? NIGERIA_STATE_OPTIONS : []}
                  value={formData.state}
                  onChange={(value) => handleLocationDropdownChange('state', value)}
                  disabled={formData.country !== 'Nigeria'}
                />

                <SearchableDropdown
                  label="City"
                  placeholder="Select city"
                  searchPlaceholder="Search city"
                  options={getCityOptions(formData.state)}
                  value={formData.city}
                  onChange={(value) => handleLocationDropdownChange('city', value)}
                  disabled={!formData.state}
                />

                <Input
                  label="Address"
                  name="address"
                  className="p-4"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      geocodeAddress(e.target.value);
                    }
                  }}
                />
                {isGeocoding && (
                  <p className="text-sm text-gray-500">Finding coordinates...</p>
                )}

                {formData.lat && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Latitude" value={formData.lat} className="p-4" readOnly />
                    <Input label="Longitude" value={formData.lng} className="p-4" readOnly />
                  </div>
                )}
              </div>
            </div>

            {/* Property Specifications */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#833700] mb-8">Property Specifications</h2>

              <div className="space-y-6">
                <Dropdown
                  label="Type"
                  placeholder="Select property type"
                  options={[
                    { value: 'Apartment', label: 'Apartment' },
                    { value: 'Bedsitter', label: 'Bedsitter' },
                    { value: 'Land', label: 'Land' },
                    { value: 'Commercial', label: 'Commercial' },
                    { value: 'Duplex', label: 'Duplex' },
                    { value: 'Self_contain', label: 'Self contain' },
                    { value: 'Flat', label: 'Flat' },
                    { value: 'Boys_quarters', label: 'Boys quarters' },
                    { value: 'Mansion', label: 'Mansion' },
                    { value: 'Detached Duplex', label: 'Detached Duplex' },
                    { value: 'Penthouse', label: 'Penthouse' },
                    { value: 'Bungalow', label: 'Bungalow' },
                    { value: 'Villa', label: 'Villa' },
                  ]}
                  value={formData.type}
                  onChange={(value) => handleDropdownChange('type', value)}
                />

                {/* Furnished only if not land */}
                {formData.type !== 'Land' && (
                  <Dropdown
                    label="Furnishing Status"
                    placeholder="Select furnishing"
                    options={[
                      { value: 'Furnished', label: 'Furnished' },
                      { value: 'Unfurnished', label: 'Unfurnished' },
                      { value: 'Semi_Furnished', label: 'Semi Furnished' },
                    ]}
                    value={formData.furnishingStatus}
                    onChange={(value) => handleDropdownChange('furnishingStatus', value)}
                  />
                )}
                {formData.status === 'For_Rent' && (
                  <Dropdown
                    label="Payment Frequency"
                    placeholder="Select payment frequency"
                    options={[
                      { value: 'per_year', label: 'Per Year' },
                      { value: 'per_month', label: 'Per Month' },
                      { value: 'per_week', label: 'Per Week' },
                    ]}
                    value={formData.paymentFrequency}
                    onChange={(value) => handleDropdownChange('paymentFrequency', value)}
                  />
                )}
                <Dropdown
                  label="Status"
                  placeholder="For rent"
                  options={[
                    { value: 'For_Sale', label: 'For Sale' },
                    { value: 'For_Rent', label: 'For Rent' },
                    { value: 'Sold', label: 'Sold' },
                  ]}
                  value={formData.status}
                  onChange={(value) => handleDropdownChange('status', value)}
                />
                {formData.type !== 'Land' && (
                  <Input
                    label="Bedrooms"
                    name="bedrooms"
                    type="number"
                    className="p-4"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                  />
                )}
                {formData.type !== 'Land' && (
                  <Input
                    label="Bathrooms"
                    name="bathrooms"
                    type="number"
                    className="p-4"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                  />
                )}
                <Input
                  label="Price"
                  name="price"
                  className="p-4"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                <Input
                  label="Agent Fee"
                  name="agentFee"
                  type="number"
                  className="p-4"
                  placeholder="Enter agent fee"
                  value={formData.agentFee}
                  onChange={handleInputChange}
                />
                <Input
                  label="Inspection Fee"
                  name="inspectionFee"
                  type="number"
                  className="p-4"
                  placeholder="Enter inspection fee"
                  value={formData.inspectionFee}
                  onChange={handleInputChange}
                />
                <Input
                  label="Property Size (sqft)"
                  name="size"
                  type="number"
                  className="p-4"
                  placeholder="Enter property size"
                  value={formData.size}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Amenities */}
            {formData.type !== 'Land' && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#833700] mb-6">Amenities</h2>

                <div className="relative">
                  <div
                    onClick={() => setShowAmenities(!showAmenities)}
                    className="border border-[#808080] rounded-lg p-4 cursor-pointer flex flex-wrap gap-2"
                  >
                    {amenities.length === 0 && (
                      <span className="text-gray-400">Select amenities</span>
                    )}

                    {amenities.map((item) => (
                      <span
                        key={item}
                        className="bg-orange-100 text-[#e87722] px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {showAmenities && (
                    <div className="absolute z-20 bg-white border mt-2 rounded-lg shadow w-full p-4 grid grid-cols-2 gap-3">
                      {AMENITIES.map((item) => (
                        <label key={item} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={amenities.includes(item)}
                            onChange={() => toggleAmenity(item)}
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Media Upload */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#833700] mb-8">Media Uploads</h2>

              <div className="space-y-8">
                {isEditMode && existingImages.length > 0 && (
                  <div>
                    <p className="mb-4 text-[16px] font-medium text-[#3E3E3E]">Current Images</p>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {existingImages.map((image) => (
                        <div
                          key={image.public_id}
                          className="relative aspect-square overflow-hidden rounded-lg border border-[#808080] bg-gray-50"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt="Property image"
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(image.public_id)}
                            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            aria-label="Remove existing image"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <ImageUpload
                  label={isEditMode ? 'Add New Images' : 'Images'}
                  maxFiles={Math.max(6 - existingImages.length, 0)}
                  onUpload={setImages}
                  gridCols={4}
                />

                <ImageUpload
                  label="Video (optional)"
                  maxFiles={1}
                  onUpload={setVideo}
                  gridCols={1}
                  isVideo
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-16">
              <OrangeButton variant="gray" fullWidth onClick={handleSaveDraft}>
                Save as draft
              </OrangeButton>

              <OrangeButton
                variant="orange"
                fullWidth
                loading={isPending || isUpdating || compressing}
                onClick={handleSubmitProperty}
              >
                {isEditMode ? 'Update property' : 'Upload property'}
              </OrangeButton>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function AddPropertyFormSkeleton() {
  return (
    <div className="animate-pulse space-y-12">
      <SkeletonSection titleWidth="w-40">
        <SkeletonInput />
        <div>
          <SkeletonLabel />
          <div className="h-32 rounded-lg border border-gray-200 bg-gray-100" />
        </div>
      </SkeletonSection>

      <SkeletonSection titleWidth="w-28">
        <SkeletonInput />
        <SkeletonInput />
        <SkeletonInput />
        <SkeletonInput />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonInput />
          <SkeletonInput />
        </div>
      </SkeletonSection>

      <SkeletonSection titleWidth="w-56">
        {Array.from({ length: 7 }).map((_, index) => (
          <SkeletonInput key={index} />
        ))}
      </SkeletonSection>

      <SkeletonSection titleWidth="w-32">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-square rounded-lg bg-gray-100" />
          ))}
        </div>
      </SkeletonSection>

      <div className="flex gap-4">
        <div className="h-12 flex-1 rounded-lg bg-gray-100" />
        <div className="h-12 flex-1 rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

function SkeletonSection({
  titleWidth,
  children,
}: {
  titleWidth: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className={`mb-8 h-8 rounded bg-gray-100 ${titleWidth}`} />
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function SkeletonInput() {
  return (
    <div>
      <SkeletonLabel />
      <div className="h-14 rounded-lg border border-gray-200 bg-gray-100" />
    </div>
  );
}

function SkeletonLabel() {
  return <div className="mb-2 h-4 w-32 rounded bg-gray-100" />;
}
