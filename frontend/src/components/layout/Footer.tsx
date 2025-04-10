import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Blood Donation', href: '/blood-donation' },
    { name: 'Assistive Devices', href: '/assistive-devices' },
    { name: 'Caregivers', href: '/caregivers' },
    { name: 'Contact', href: '/contact' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-.88-.06-1.601-1-1.601-1 0-1.174.781-1.174 1.601v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

const features = [
  {
    name: 'Blood Donation',
    description: 'Connect with blood donors and save lives.',
    icon: HeartIcon,
  },
  {
    name: 'Caregiver Services',
    description: 'Find qualified caregivers for your loved ones.',
    icon: UserGroupIcon,
  },
  {
    name: 'Assistive Devices',
    description: 'Share and find assistive devices.',
    icon: DevicePhoneMobileIcon,
  },
];

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Features */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div
                  key={feature.name}
                  whileHover={{ scale: 1.02 }}
                  className="relative pl-9"
                >
                  <dt className="inline font-semibold text-gray-900">
                    <feature.icon className="absolute left-1 top-1 h-5 w-5 text-primary-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="inline text-sm text-gray-600">{feature.description}</dd>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Contact Us</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li className="flex items-center text-sm text-gray-600">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-primary-600" />
                support@accessshare.com
              </li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8" aria-label="Footer">
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm leading-6 text-gray-600 hover:text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Social Links */}
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} AccessShare. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 