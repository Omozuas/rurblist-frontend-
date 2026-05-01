'use client';

import dynamic from 'next/dynamic';
import { OrangeButton } from '@/components/button/button';
import ProfileImage from '@/components/profile-image/profile-image';
import { useState } from 'react';

const BookTourModal = dynamic(() => import('./book-tour/book-tour-model'), {
  ssr: false,
});

interface ContactCardProps {
  agentImage: string;
  agentName: string;
  agency: string;
  phone: string;
  propertyId?: string;
  agentId?: string;
  inspectionFee?: number;
  location?: string;
}

export default function ContactCard({
  agentImage,
  agentName,
  agency,
  phone,
  propertyId,
  location,
  agentId,
  inspectionFee,
}: ContactCardProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);

  return (
    <div className="w-full max-w-full lg:max-w-105">
      {/* Heading */}
      <h2 className="text-xl sm:text-2xl font-semibold text-[#e87722] mb-3">
        Thinking of renting?
      </h2>

      <p className="text-sm sm:text-base text-gray-600 mb-6">
        Explore your dream home today! Schedule a personalized tour with an expert agent. Contact
        agent to organize an inspection time!
      </p>

      {/* Tour Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <OrangeButton
          iconSrc="/icons/user.svg"
          iconSize={18}
          variant="white"
          className="w-full border border-[#e87722] text-[#e87722] text-sm py-2"
          onClick={() => setIsTourOpen(true)}
        >
          Tour in person
        </OrangeButton>

        <OrangeButton
          variant="white"
          iconSrc="/icons/smartphone.svg"
          iconSize={18}
          onClick={() => setIsCallOpen(true)}
          className="w-full border border-[#e87722] text-[#e87722] text-sm py-2"
        >
          Tour via call
        </OrangeButton>
      </div>

      {/* Main CTA */}
      <OrangeButton
        fullWidth
        className="mb-6 text-sm sm:text-base"
        onClick={() => setIsInspectionOpen(true)}
      >
        Request Inspection
      </OrangeButton>

      {/* Agent Card */}
      <div className="bg-white mt-6 sm:mt-7 p-2 sm:p-5">
        <ProfileImage src={agentImage} alt={agentName} size="lg" name={agentName} role={agency} />

        {/* Message */}
        <textarea
          placeholder="Write a message..."
          className="
            w-full
            mt-4
            p-3
            text-sm
            border
            rounded-lg
            resize-none
            focus:outline-none
            focus:ring-2
            focus:ring-[#e87722]
          "
          rows={4}
        />

        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
            I am interested in buying
          </span>
          <span className="text-xs bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
            Is this home still available?
          </span>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <OrangeButton iconSize={18} iconSrc="/icons/mail.svg" className=" py-2 text-sm">
            Send a message
          </OrangeButton>

          <OrangeButton variant="gray" className=" sm:w-auto py-2 px-4 text-sm truncate">
            <span className="truncate block">Call {phone}</span>
          </OrangeButton>
        </div>
      </div>
      {isTourOpen && (
        <BookTourModal
          isOpen={isTourOpen}
          propertyId={propertyId}
          agentId={agentId}
          inspectionFee={inspectionFee}
          onClose={() => setIsTourOpen(false)}
          tourType="in-person"
          location={location}
        />
      )}

      {isCallOpen && (
        <BookTourModal
          isOpen={isCallOpen}
          location="Phone Call"
          propertyId={propertyId}
          agentId={agentId}
          inspectionFee={inspectionFee}
          onClose={() => setIsCallOpen(false)}
          tourType="call"
        />
      )}

      {isInspectionOpen && (
        <BookTourModal
          inspectionFee={inspectionFee}
          propertyId={propertyId}
          agentId={agentId}
          isOpen={isInspectionOpen}
          onClose={() => setIsInspectionOpen(false)}
          tourType="inspection"
          location={location}
        />
      )}
    </div>
  );
}
