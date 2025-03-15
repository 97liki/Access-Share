import { motion } from 'framer-motion';
import bgPattern from '../../assets/images/backgrounds/pattern-light.svg';

const HowItWorks = () => {
  const features = [
    {
      title: 'Blood Donation',
      steps: [
        'Create a blood donation request or offer',
        'Match with nearby donors/recipients',
        'Coordinate donation through secure messaging',
        'Complete the donation process',
      ],
      icon: '🩸',
    },
    {
      title: 'Assistive Devices',
      steps: [
        'List available medical equipment',
        'Browse needed devices',
        'Connect with device owners',
        'Arrange device sharing or donation',
      ],
      icon: '🦽',
    },
    {
      title: 'Caregiver Services',
      steps: [
        'Create a caregiver profile',
        'Search for caregivers by criteria',
        'Review qualifications and ratings',
        'Schedule care services',
      ],
      icon: '👩‍⚕️',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bgPattern})` }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-xl text-gray-600">
            Simple steps to connect, share, and care in your community
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-12 backdrop-blur-sm bg-white/80">
          {features.map((feature, index) => (
            <section key={feature.title} className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{feature.icon}</span>
                <h2 className="text-2xl font-semibold text-primary-600">{feature.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {feature.steps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className="relative p-6 bg-primary-50 rounded-lg"
                  >
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                      {stepIndex + 1}
                    </div>
                    <p className="text-gray-700 mt-2">{step}</p>
                  </div>
                ))}
              </div>

              {index < features.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-primary-200 rounded-full"></div>
                </div>
              )}
            </section>
          ))}

          <section className="mt-12 p-6 bg-primary-50 rounded-lg">
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Getting Started</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                1. Create your account and complete your profile
              </p>
              <p className="text-gray-700">
                2. Verify your email address for added security
              </p>
              <p className="text-gray-700">
                3. Browse services or create your first listing
              </p>
              <p className="text-gray-700">
                4. Connect with others in your community
              </p>
            </div>
          </section>

          <section className="text-center mt-8">
            <p className="text-gray-600">
              Need help? Visit our FAQ page or contact our support team.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
