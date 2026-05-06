'use client';

import { useUploadProperty } from '@/app/apis/mutations/use-property/use-post-property';
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
  const compressing = false;
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showAmenities, setShowAmenities] = useState(false);
  const { mutate: uploadPropertyMutation, isPending } = useUploadProperty();
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

  /* // Mock geocode (replace with Google Maps / Mapbox later)
  const geocodeAddress = async (address: string) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );

    const data = await res.json();
   console.log(data)
    if (data.results.length > 0) {
      const location = data.results[0].geometry.location;

      setFormData((prev) => ({
        ...prev,
        latitude: location.lat,
        longitude: location.lng,
      }));
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
};*/

  /*
const geocodeAddress = async (address: string) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
    );

    const data = await res.json();
console.log(data)
    if (data.length > 0) {
      setFormData((prev) => ({
        ...prev,
        latitude: data[0].lat,
        longitude: data[0].lon,
      }));
    }
  } catch (error) {
    console.error("Geocode error:", error);
  }
};
*/
  const geocodeAddress = async (address: string) => {
    try {
      const apiKey = '78d12ab34db94bd29342fc69b9ff8b11';

      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          address,
        )}&key=${apiKey}`,
      );

      const data = await res.json();
      console.log(data);
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;

        setFormData((prev) => ({
          ...prev,
          lat: lat,
          lng: lng,
        }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };
  const handleSaveDraft = () => {
    console.log('Saving draft...', { formData, amenities });
  };

  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);
  const handleUploadProperty = async () => {
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

    // compress images before uploading
    /*  setCompressing(true);

    const compressedImages = await Promise.all(
    images.map((file) => compressImage(file))
    );

    compressedImages.forEach((file) => {
    console.log(file);
    data.append("images", file);
    });

    setCompressing(false);*/
    images.forEach((file) => {
      console.log(file);
      data.append('images', file);
    });
    console.log('Uploading property...', { formData, amenities, images, video });
    uploadPropertyMutation(data);
  };
  return (
    <div className="min-h-screen bg-white">
      <ModalHeader title={'Add New Property'} onClose={() => router.back()} />

      <main className="max-w-4xl mx-auto px-6 py-12">
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
                {amenities.length === 0 && <span className="text-gray-400">Select amenities</span>}

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
            <ImageUpload label="Images" maxFiles={6} onUpload={setImages} gridCols={4} />

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
            loading={isPending || compressing}
            onClick={handleUploadProperty}
          >
            Upload property
          </OrangeButton>
        </div>
      </main>
    </div>
  );
}
