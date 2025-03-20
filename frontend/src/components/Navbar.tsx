import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Don't show navigation on auth pages
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const staticLinks = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const serviceMenus = [
    { 
      name: 'Blood Donation', 
      options: [
        { name: 'Donate Blood', href: '/blood-donation/donate', implemented: true },
        { name: 'Request Blood', href: '/blood-donation/request', implemented: true },
        { name: 'View Blood Listings', href: '/blood-donation', implemented: true }
      ]
    },
    { 
      name: 'Assistive Devices', 
      options: [
        { name: 'Donate Devices', href: '/devices/donate', implemented: true },
        { name: 'Request Devices', href: '/devices/make-request', implemented: true },
        { name: 'View Device Listings', href: '/devices/view-requests', implemented: true }
      ] 
    },
    { 
      name: 'Caregivers', 
      options: [
        { name: 'Offer Care Services', href: '/caregivers/offer', implemented: true },
        { name: 'Find a Caregiver', href: '/caregivers/find', implemented: true },
        { name: 'View Caregiver Listings', href: '/caregivers', implemented: true }
      ] 
    },
  ];

  const helpLinks = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  if (isAuthPage) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary-600">AccessShare</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-600 hover:text-primary-700">
              <span className="text-2xl font-bold">AccessShare</span>
            </Link>

            {/* Service Dropdown Menus */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 sm:items-center">
              {serviceMenus.map((service) => (
                <Menu as="div" key={service.name} className="relative">
                  <Menu.Button 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname.includes(service.name.toLowerCase().replace(' ', '-')) 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {service.name} ▼
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      {service.options.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <Link
                              to={option.implemented ? option.href : (option.name.toLowerCase().includes('request') ? '/' : option.href)}
                              className={`${
                                active ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                              } block px-4 py-2 text-sm`}
                            >
                              {option.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            {/* Help Menu - Always visible */}
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">
                Help ▼
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  {helpLinks.map((link) => (
                    <Menu.Item key={link.name}>
                      {({ active }) => (
                        <Link
                          to={link.href}
                          className={`${
                            active ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        >
                          {link.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>

            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <Menu as="div" className="relative ml-3">
                  <Menu.Button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">
                    <span>{user?.username || 'User'}</span>
                    <span>▼</span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                            } block px-4 py-2 text-sm`}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={`${
                              active ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                            } block px-4 py-2 text-sm`}
                          >
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={`${
                              active ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                            } block w-full text-center px-4 py-2 text-sm`}
                          >
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
