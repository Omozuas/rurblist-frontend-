'use client';

import { RoleCard } from '@/components/role-card/role-card';
import { Footer } from '@/components/footer/footer';
import { useState } from 'react';
import { IconImage } from '@/components/icon-image/icon-image';
import { useRouter } from 'next/navigation';

export default function AddPropertyPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const properties = [
    {
      id: 'land-sale',
      title: 'Land for Sale',
      description: 'List your land property for sale',
      icon: '/develoer.png',
      variant: 'secondary' as const,
    },
    {
      id: 'land-rent',
      title: 'Land for Rent',
      description: 'List your land property for rent',
      icon: '/develoer.png',
      variant: 'secondary' as const,
    },
    {
      id: 'apartment-sale',
      title: 'Apartment for Sale',
      description: 'List your apartment for sale',
      icon: '/develoer.png',
      variant: 'secondary' as const,
    },
    {
      id: 'apartment-rent',
      title: 'Apartment for Rent',
      description: 'List your apartment for rent',
      icon: '/develoer.png',
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-8 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <IconImage src="/chevron-left.png" alt="back" width={24} height={24} />
          </button>
          <h1 className="text-2xl font-semibold text-[#000000]">Add Property</h1>
          <p className="font-semibold">
            <span className="text-brand-500 font-bold ">02</span>
            <span className="text-[24] font-normal"> of 03</span>
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Grid of property cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <RoleCard
                key={property.id}
                title={property.title}
                description={property.description}
                icon={property.icon}
                variant={property.variant}
                selected={selectedRole === property.id}
                // url='/kyc/add-property-details'
                onClick={() => setSelectedRole(property.id)}
                imageH={157}
                imageW={197}
              />
            ))}
          </div>

          {/* Action button
          <div className="flex justify-center mt-12">
            <div className="w-full md:w-96">
             <Link href=''><OrangeButton fullWidth>Continue</OrangeButton></Link> 
            </div>
          </div> */}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
