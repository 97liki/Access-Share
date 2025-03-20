import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Import assets
import bgPattern from '../assets/images/backgrounds/pattern-light.svg';
import devicesIcon from '../assets/images/icons/features/devices.svg';
import bloodIcon from '../assets/images/icons/features/blood.svg';
import caregiverIcon from '../assets/images/icons/features/caregiver.svg';
import requestIcon from '../assets/images/icons/features/request.svg';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'donate' | 'receive' | 'request'>('all');
  
  const services = [
    {
      id: 'blood',
      title: 'Blood Donation',
      description: 'Connect with blood donors or request blood donations',
      icon: bloodIcon,
      donateLink: '/blood-donation/donate',
      donateText: 'Donate Blood',
      donateDescription: 'Register as a blood donor and help save lives in your community',
      requestLink: '/blood-donation/make-request',
      requestText: 'Request Blood',
      requestDescription: 'Submit a request for blood donation based on your needs',
      viewLink: '/blood-donation/view-requests',
      viewText: 'View Listings',
      viewDescription: 'Browse available blood donations and requests in your area',
    },
    {
      id: 'devices',
      title: 'Assistive Devices',
      description: 'Connect with donors offering mobility aids, hearing devices, and more',
      icon: devicesIcon,
      donateLink: '/devices/donate',
      donateText: 'Donate Devices',
      donateDescription: 'Donate medical equipment and assistive devices to those in need',
      requestLink: '/devices/make-request',
      requestText: 'Request Devices',
      requestDescription: 'Submit a request for assistive devices based on your needs',
      viewLink: '/devices/view-requests',
      viewText: 'View Listings',
      viewDescription: 'Browse available devices and requests in your area',
    },
    {
      id: 'caregivers',
      title: 'Caregivers',
      description: 'Connect with experienced caregivers or offer your services',
      icon: caregiverIcon,
      donateLink: '/caregivers/offer',
      donateText: 'Offer Care',
      donateDescription: 'Register as a caregiver and offer your services to those in need',
      requestLink: '/caregivers/make-request',
      requestText: 'Request Care',
      requestDescription: 'Submit a request for caregiving services based on your needs',
      viewLink: '/caregivers/view-requests',
      viewText: 'View Listings',
      viewDescription: 'Browse available caregivers and requests in your area',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
            >
              <span className="block">Empowering Communities</span>
              <span className="block text-blue-600">Through Accessible Healthcare</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
            >
              Join our platform to connect with donors, caregivers, and healthcare resources in your community.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
            >
              <div className="rounded-md shadow">
                <Link
                  to={isAuthenticated ? "/devices/request" : "/register"}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  {isAuthenticated ? "Find Resources" : "Get Started"}
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to={isAuthenticated ? "/blood-donation/donate" : "/login"}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  {isAuthenticated ? "Donate Now" : "Sign In"}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services Section with Tabs */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-12 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Services</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How would you like to help?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Choose to donate, receive, or explore all our services
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <nav className="flex space-x-4 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'all'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Services
              </button>
              <button
                onClick={() => setActiveTab('donate')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'donate'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                I Want to Donate
              </button>
              <button
                onClick={() => setActiveTab('receive')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'receive'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                I Want to Request
              </button>
              <button
                onClick={() => setActiveTab('request')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'request'
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                I Want to View
              </button>
            </nav>
          </div>

          {/* Services Grid */}
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  className={`relative ${
                    (activeTab === 'all' || 
                    (activeTab === 'donate' && service.donateLink) || 
                    (activeTab === 'receive' && service.requestLink) ||
                    (activeTab === 'request' && service.requestLink))
                      ? 'block'
                      : 'hidden'
                  }`}
                >
                  {activeTab === 'all' ? (
                    // Show all three options for each service
                    <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <img src={service.icon} alt={service.title} className="w-12 h-12 mr-4" />
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {service.title}
                          </h3>
                        </div>
                        <p className="text-base text-gray-500 mb-6">
                          {service.description}
                        </p>
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <Link
                            to={service.donateLink}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            {service.donateText}
                          </Link>
                          <Link
                            to={service.requestLink}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          >
                            {service.requestText}
                          </Link>
                          <Link
                            to={service.viewLink}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                          >
                            {service.viewText}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : activeTab === 'donate' ? (
                    // Show only donate option
                    <Link
                      to={service.donateLink}
                      className="block h-full bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <img src={service.icon} alt={service.title} className="w-12 h-12 mr-4" />
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {service.donateText}
                          </h3>
                        </div>
                        <p className="text-base text-gray-500">
                          {service.donateDescription}
                        </p>
                      </div>
                    </Link>
                  ) : activeTab === 'receive' ? (
                    // Show only request option
                    <Link
                      to={service.requestLink}
                      className="block h-full bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <img src={requestIcon} alt={service.title} className="w-12 h-12 mr-4" />
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {service.requestText}
                          </h3>
                        </div>
                        <p className="text-base text-gray-500">
                          {service.requestDescription}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    // Show only view option
                    <Link
                      to={service.viewLink}
                      className="block h-full bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <img src={service.icon} alt={service.title} className="w-12 h-12 mr-4" />
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {service.viewText}
                          </h3>
                        </div>
                        <p className="text-base text-gray-500">
                          {service.viewDescription}
                        </p>
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Hear from our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">"I was able to find a wheelchair for my mother quickly. The platform connected us with a donor in our neighborhood."</p>
              <p className="font-medium">- Sarah J.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">"As a blood donor, I've been able to help multiple people in emergency situations. This platform makes the process seamless."</p>
              <p className="font-medium">- Michael T.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">"Finding a qualified caregiver for my father was easy. We connected with someone experienced in Alzheimer's care within days."</p>
              <p className="font-medium">- Robert L.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to make a difference?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Join our community today and start helping others or find the assistance you need.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link
                to={isAuthenticated ? "/profile" : "/register"}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                {isAuthenticated ? "Go to Profile" : "Sign Up Now"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;