'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrangeButton } from '@/components/button/button';
import Input from '@/components/input';
import { IconImage } from '@/components/icon-image/icon-image';
import { useBookInspection } from '@/app/apis/mutations/use-tour/use-tour';

interface BookTourModalProps {
  isOpen: boolean;
  inspectionFee?: number;
  agentId?: string;
  propertyId?: string;
  location?: string;
  tourType?: 'in-person' | 'inspection' | 'call';
  onClose: () => void;
}

export default function BookTourModal({
  isOpen,
  onClose,
  tourType,
  propertyId,
  location,
  agentId,
  inspectionFee,
}: BookTourModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const { mutate, isPending } = useBookInspection();

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  /* Prevent body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  /* Generate 30 days */
  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() + i);
      return d;
    });
  }, []);

  /* Generate times */
  const times = useMemo(() => {
    const list: string[] = [];
    for (let h = 9; h <= 17; h++) {
      const d = new Date();
      d.setHours(h, 0, 0, 0);
      list.push(
        d.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      );
    }
    return list;
  }, []);

  const formatFullDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

  /* Validation */
  const validateStep2 = () => {
    const newErrors: typeof errors = {};

    if (!name) newErrors.name = 'Name is required';
    if (!phone) newErrors.phone = 'Phone is required';
    if (!email) newErrors.email = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleBook2 = () => {
    if (!validateStep2()) return;
    setStep(3);
  };
  const handleBook = () => {
    const scheduledAt = combineDateTime(selectedDate!, selectedTime!);
    // 👉 now move to success step
    mutate({
      propertyId: propertyId!,
      agentId: agentId!,
      scheduledAt,
      tourType:
        tourType === 'call' ? 'call' : tourType === 'inspection' ? 'inspection' : 'in-person',
      price: inspectionFee!,
    });
    // console.log({
    //   selectedDate,
    //   selectedTime,
    //   name,
    //   phone,
    //   email,
    // });
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="
  w-full
  sm:max-w-150
  md:max-w-162.5
  bg-white
  rounded-t-2xl sm:rounded-2xl
  max-h-[85vh]
  flex flex-col
"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <button onClick={onClose}>✕</button>
              <h2 className="font-semibold text-lg">
                Book a{' '}
                {tourType === 'inspection'
                  ? 'inspection'
                  : tourType === 'call'
                    ? 'tour via call'
                    : tourType === 'in-person'
                      ? 'in-person tour'
                      : 'tour'}
              </h2>
              <div />
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-5 sm:px-6 py-6 sm:py-8 space-y-8">
              {/* ================= STEP 1 ================= */}
              {step === 1 && (
                <>
                  {/* Select Date */}
                  <div>
                    <h3 className="text-lg font-medium mb-5">Select a date</h3>

                    <div className="flex gap-4 overflow-x-auto">
                      {dates.map((date) => {
                        const active = selectedDate?.toDateString() === date.toDateString();

                        return (
                          <button
                            key={date.toISOString()}
                            onClick={() => setSelectedDate(date)}
                            className={`min-w-30 p-4 rounded-xl border ${
                              active
                                ? 'bg-[#f3c9a7] border-[#e87722]'
                                : 'bg-gray-100 border-gray-300'
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Select Time */}
                  <div>
                    <h3 className="text-lg font-medium mb-5">Select a time</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {times.map((time) => {
                        const active = selectedTime === time;

                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 rounded-lg border ${
                              active
                                ? 'bg-[#f3c9a7] border-[#e87722]'
                                : 'bg-gray-100 border-gray-300'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <OrangeButton
                    fullWidth
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </OrangeButton>
                </>
              )}

              {/* ================= STEP 2 ================= */}
              {step === 2 && selectedDate && selectedTime && (
                <>
                  {/* Tour Summary */}
                  <div className="text-center space-y-3 p-3">
                    <IconImage
                      src="/icons/user2.svg"
                      alt="tour"
                      height={48}
                      width={48}
                      className="mx-auto"
                    />

                    <h3 className="text-[#9b4b17] font-semibold text-lg">{tourType} tour</h3>

                    <p className="text-lg font-medium">
                      {formatFullDate(selectedDate)} at {selectedTime}
                    </p>

                    <p className="text-sm text-gray-500">{location}</p>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">Confirm your details</h3>

                    <p className="text-sm text-gray-500">
                      Please confirm your information below tom make it easier for easy
                      identification
                    </p>

                    <Input
                      label="Name"
                      value={name}
                      className="pl-4"
                      onChange={(e) => setName(e.target.value)}
                      error={errors.name}
                    />

                    <Input
                      label="Phone"
                      className="pl-4"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={errors.phone}
                    />

                    <Input
                      label="Email address"
                      type="email"
                      className="pl-4"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                    />
                  </div>

                  <div className="flex gap-4">
                    <OrangeButton variant="gray" fullWidth onClick={() => setStep(1)}>
                      Back
                    </OrangeButton>

                    <OrangeButton fullWidth onClick={handleBook2}>
                      Book tour
                    </OrangeButton>
                  </div>
                </>
              )}
              {/* {step === 3 && (
                <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 space-y-6">
                  <IconImage
                    src="/icons/star.svg"
                    alt="success"
                    className="w-14 h-14 sm:w-16 sm:h-16"
                  />

                  <h3 className="text-xl sm:text-2xl font-semibold text-[#9b4b17]">
                    Tour successfully booked
                  </h3>

                  <p className="text-sm sm:text-base text-gray-500 max-w-100">
                    Check your email for confirmation message and reminder
                  </p>

                  <div className="pt-8 w-full max-w-87.5">
                    <OrangeButton
                      fullWidth
                      onClick={() => {
                        setStep(1);
                        onClose();
                      }}
                    >
                      Back to profile
                    </OrangeButton>
                  </div>
                </div>
              )} */}
              {step === 3 && (
                <>
                  {/* Content */}
                  <div className="px-6 sm:px-10 py-10 sm:py-14 text-center space-y-6">
                    <IconImage
                      src="/icons/check-circle.svg"
                      alt="confirm"
                      className="mx-auto w-14 h-14 sm:w-16 sm:h-16"
                    />

                    <h3 className="text-xl sm:text-2xl font-semibold text-[#9b4b17]">
                      Confirm Inspection Fee
                    </h3>

                    <p className="text-sm sm:text-base text-gray-600 max-w-112.5 mx-auto">
                      An Inspection fee of{' '}
                      <span className="font-semibold text-[#454444]">
                        ₦{inspectionFee?.toLocaleString() ?? '20,000'}
                      </span>{' '}
                      will be charged. Do you want to continue?
                    </p>

                    <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                      <p>
                        <span className="font-semibold text-[#454444]">Refund Policy:</span> Full
                        refund within 24 hours if you decide not to rent
                      </p>
                      <p>
                        <span className="font-semibold text-[#454444]">Security:</span> Payment
                        processed securely via encrypted gateway
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <OrangeButton fullWidth onClick={handleBook} loading={isPending}>
                        Continue
                      </OrangeButton>

                      <OrangeButton
                        variant="white"
                        fullWidth
                        className="border border-[#e87722] text-[#e87722]"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </OrangeButton>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ================= STEP 3 (FEE MODAL) ================= */}
      {/* <InspectionFeeModal
        isOpen={showFeeModal}
        inspectionFee={inspectionFee}
        onClose={() => setShowFeeModal(false)}
        onContinue={handleContinueAfterFee}
      /> */}
    </>
  );
}

function combineDateTime(date: Date, time: string) {
  const result = new Date(date);
  const match = time.match(/(\d+):(\d+)\s?(AM|PM)/);

  if (!match) return result;

  const [, hourValue, minuteValue, period] = match;

  let hours = parseInt(hourValue);
  const minutes = parseInt(minuteValue);

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  result.setHours(hours, minutes, 0, 0);

  return result;
}
