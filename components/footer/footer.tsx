'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, MessageCircle, Mail, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

interface FooterProps {
  columns?: FooterColumn[];
  description?: string;
  className?: string;
  showSocialIcons?: boolean;
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'Locations',
    links: [
      { label: 'Lagos', href: '/property?state=Lagos' },
      { label: 'Delta', href: '/property?state=Delta' },
      { label: 'Enugu', href: '/property?state=Enugu' },
      { label: 'Abuja etc', href: '/property?state=Abuja' },
    ],
  },
  {
    title: 'Learn more',
    links: [
      { label: 'Lands', href: '/property?type=Land' },
      { label: 'Apartments', href: '/property?type=Apartment' },
      { label: 'Business properties', href: '/property?type=Commercial' },
      { label: 'Listings', href: '/property' },
      { label: 'Agents', href: '/agent/profile' },
    ],
  },
  {
    title: 'Contact info',
    links: [
      { label: 'Phone: +2348154155124', href: 'tel:+2348154155124' },
      { label: 'Email: hello@rurblist.com', href: 'mailto:hello@rurblist.com' },
    ],
  },
];

const defaultDescription =
  'Housing made easy! At rurblist we strive to give you the best services and the best apartment. at a low cost, you can enjoy our services.';

export function Footer({
  columns = defaultColumns,
  description = defaultDescription,
  className,
  showSocialIcons = true,
}: FooterProps) {
  const socialIcons = [
    { Icon: Facebook, href: '#', label: 'Facebook' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/company/rurblist/', label: 'Linkedin' },
    { Icon: Twitter, href: 'https://x.com/Rurblist', label: 'Twitter' },
    {
      Icon: Instagram,
      href: 'https://www.instagram.com/rurblist?igsh=MjNyb3g2dGNuaHBu',
      label: 'Instagram',
    },
    { Icon: MessageCircle, href: 'https://wa.me/2348154155124', label: 'WhatsApp' },
    { Icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer
      className={cn('relative bg-cover bg-center bg-no-repeat pt-20 pb-8', className)}
      style={{
        backgroundImage: 'url(/footer-bg.jpg)',
      }}
    >
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-script text-gray-900 mb-3">Rurblist</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-xs">{description}</p>

            {/* Social icons */}
            {showSocialIcons && (
              <div className="flex gap-3">
                {socialIcons.map(({ Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="p-2 text-gray-600 bg-gray-200 rounded-full transition-all hover:bg-transparent hover:text-[#e87722]"
                  >
                    <Icon size={18} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((column, index) => (
            <div key={index} className="flex flex-col">
              <h3 className="font-semibold text-gray-900 mb-4">{column.title}</h3>
              <ul className="space-y-2 flex flex-col">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#e87722] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom divider */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-500 text-xs text-center">© 2024 Rurblist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
