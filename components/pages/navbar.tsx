'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { OrangeButton } from '@/components/button/button';
import { NavLink } from './nav-links';
import { getNavbarRoutes } from '@/app/apis/utils/get-navbar-routes';
import { useAuth } from '../layout/auth-provider';
import UserAvatar from '../profile-image/user-avatar';
import { Role } from '@/app/apis/utils/routes';
import { useLogout } from '@/app/apis/mutations/use-auth/use-logout';

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const { mutate: logoutUser, isPending } = useLogout();
  const safeUser = user?.user;

  const avatarName = safeUser?.fullName ?? 'User';
  const avatarImage = safeUser?.profileImage?.url ?? user?.agent?.selfieUrl?.url ?? undefined;
  const profilePath = user?.user?.roles?.includes('Home_Seeker')
    ? '/house-seeker/profile'
    : '/agent/private';
  const navRoutes = useMemo(
    () => getNavbarRoutes((safeUser?.roles ?? []) as Role[]),
    [safeUser?.roles],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        desktopProfileRef.current &&
        !desktopProfileRef.current.contains(event.target as Node) &&
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleLogout = () => {
    setProfileOpen(false);
    logoutUser();
  };
  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src="/Rublist.svg" alt="Rublist Logo" width={34} height={34} priority />
            </Link>

            {/* ================= DESKTOP NAV ================= */}
            <nav className="hidden md:flex items-center gap-8">
              {navRoutes.map((item) => (
                <NavLink
                  key={item.path}
                  href={item.path}
                  activeClassName="text-[#e87722] font-semibold scale-105"
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>

            {/* ================= DESKTOP BUTTONS ================= */}
            <div className="hidden md:flex items-center gap-4">
              {/* show buttons only if not logged in*/}
              {!user && !isLoading && (
                <>
                  <Link href="/signup">
                    <OrangeButton className="px-5 py-2 text-sm">Sign up</OrangeButton>
                  </Link>

                  <Link href="/login">
                    <OrangeButton
                      variant="white"
                      className="px-5 py-2 text-sm border border-[#e87722] text-[#e87722]"
                    >
                      Log in
                    </OrangeButton>
                  </Link>
                </>
              )}
              {user && (
                <div className="relative" ref={desktopProfileRef}>
                  <button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center justify-center"
                  >
                    <UserAvatar name={avatarName} image={avatarImage} />
                  </button>
                  {/* Dropdown */}
                  {profileOpen && (
                    <div
                      className="
                      absolute
                      right-0
                      mt-3
                      w-44
                      bg-white
                      rounded-lg
                      shadow-lg
                      border
                      border-gray-100
                      overflow-hidden
                      animate-in
                      fade-in
                      zoom-in-95
                    "
                    >
                      <Link
                        href={profilePath}
                        className="block px-4 py-3 text-sm hover:bg-gray-50"
                        onMouseEnter={() => router.prefetch(profilePath)}
                        onClick={() => setProfileOpen(false)}
                      >
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 text-red-500"
                      >
                        {isPending ? 'logging out...' : 'Logout'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />

        {/* Drawer */}
        <aside
          className={`absolute top-0 left-0 h-full w-70 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full px-6 pt-6">
            {/* Close */}
            <div className="flex justify-end mb-8">
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* ================= MOBILE LINKS ================= */}
            <nav className="flex flex-col gap-6">
              {navRoutes.map((item) => (
                <NavLink
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  activeClassName="text-[#e87722] font-semibold"
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>

            {/* ================= MOBILE BUTTONS ================= */}
            <div className="mt-10 flex flex-col gap-4">
              {!user && !isLoading && (
                <>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <OrangeButton fullWidth>Sign up</OrangeButton>
                  </Link>

                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <OrangeButton
                      variant="white"
                      fullWidth
                      onClick={() => {}}
                      className="border border-[#e87722] text-[#e87722]"
                    >
                      Log in
                    </OrangeButton>
                  </Link>
                </>
              )}
              {user && (
                <div className="relative" ref={mobileProfileRef}>
                  <button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center justify-center"
                  >
                    <UserAvatar name={avatarName} image={avatarImage} />
                  </button>
                  {/* Dropdown */}
                  {profileOpen && (
                    <div
                      className="
                      absolute
                      right-0
                      mt-3
                      w-44
                      bg-white
                      rounded-lg
                      shadow-lg
                      border
                      border-gray-100
                      overflow-hidden
                      animate-in
                      fade-in
                      zoom-in-95
                    "
                    >
                      <Link
                        href={profilePath}
                        className="block px-4 py-3 text-sm hover:bg-gray-50"
                        onMouseEnter={() => router.prefetch(profilePath)}
                        onClick={() => setProfileOpen(false)}
                      >
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 text-red-500"
                      >
                        {isPending ? 'logging out...' : 'Logout'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
