'use client';

import { useMutation } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { verifyGoogleOtp } from '../../services/auth-services/auth-service-client';

export function useVerifyGoogleOtp() {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyGoogleOtp,

    onSuccess: () => {
      toast.success('Login successful 🎉');

      router.push('/');
    },

    onError: (error: Error) => {
      toast.error(error.message);
      router.push('/login');
    },
  });
}
