'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Input from '@/components/input';
import { OrangeButton } from '@/components/button/button';
import { IconImage } from '@/components/icon-image/icon-image';
import { useLogin } from '@/app/apis/mutations/use-auth/use-login';

export default function LoginPage() {
  const { mutate, isPending } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // 👉 Connect backend here
    mutate(
      {
        email,
        password,
      },
      {
        onSettled: () => {
          setPassword('');
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ================= LEFT IMAGE ================= */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#E9CDB8] overflow-hidden">
        <div className="absolute bottom-0 ">
          <Image
            src="/image/hand-and-property.svg" // replace with your image
            alt="House"
            width={650}
            height={640}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* ================= RIGHT FORM ================= */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12 bg-white">
        <div className="w-full max-w-120">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">Welcome back!</h1>
          <p className="text-gray-500 mt-2 mb-8">Welcome, Please enter your details.</p>

          {/* Google Login */}
          <button
            type="button"
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              py-3
              text-gray-700
              hover:bg-gray-50
              transition
            "
            onClick={() => {
              window.location.href = `https://rurblist-backend.onrender.com/api/auth/google`;
            }}
          >
            Login with google
          </button>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-4 text-sm text-[#e87722]">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email address"
              type="email"
              className="p-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            {/* Password Field with Toggle */}
            <div className="relative">
              <Input
                label="Password"
                className="p-4"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-12.5"
              >
                <IconImage
                  src={showPassword ? '/icons/eye-slash.svg' : '/icons/eye-open.svg'}
                  alt="toggle password"
                  width={20}
                  height={20}
                />
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-4 h-4 accent-green-500"
                />
                Remember me
              </label>

              <Link href="/forgotpassword" className="text-gray-500 hover:text-[#e87722]">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <OrangeButton type="submit" fullWidth loading={isPending}>
              Login
            </OrangeButton>
          </form>

          {/* Signup */}
          <p className="text-sm text-gray-600 mt-8 text-center">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-[#e87722] font-semibold">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
