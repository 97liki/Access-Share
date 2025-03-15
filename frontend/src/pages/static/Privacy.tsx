import { motion } from 'framer-motion';
import bgPattern from '../../assets/images/backgrounds/pattern-light.svg';

const Privacy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          items: [
            'Name and contact details',
            'Date of birth and gender',
            'Medical history (for blood donation)',
            'Professional credentials (for caregivers)',
            'Location data',
            'Profile pictures'
          ]
        },
        {
          subtitle: 'Usage Information',
          items: [
            'Device and browser information',
            'IP address and location data',
            'Pages visited and features used',
            'Time spent on platform',
            'Communication preferences'
          ]
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Service Provision',
          items: [
            'Matching blood donors with recipients',
            'Connecting caregivers with clients',
            'Facilitating medical equipment sharing',
            'Processing transactions and communications',
            'Verifying user identities and credentials'
          ]
        },
        {
          subtitle: 'Platform Improvement',
          items: [
            'Analyzing usage patterns',
            'Improving user experience',
            'Developing new features',
            'Preventing fraud and abuse',
            'Customer support'
          ]
        }
      ]
    },
    {
      title: 'Information Sharing',
      content: [
        {
          subtitle: 'With Other Users',
          items: [
            'Profile information for matching',
            'Contact details for coordination',
            'Ratings and reviews',
            'Public posts and comments'
          ]
        },
        {
          subtitle: 'With Third Parties',
          items: [
            'Service providers and partners',
            'Legal requirements',
            'Emergency services when necessary',
            'With your explicit consent'
          ]
        }
      ]
    },
    {
      title: 'Your Rights and Controls',
      content: [
        {
          subtitle: 'Access and Control',
          items: [
            'View and update your information',
            'Download your data',
            'Delete your account',
            'Opt-out of communications',
            'Control privacy settings'
          ]
        },
        {
          subtitle: 'Security Measures',
          items: [
            'Data encryption',
            'Regular security audits',
            'Secure data storage',
            'Access controls',
            'Incident response procedures'
          ]
        }
      ]
    }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Your privacy is important to us. Learn how we protect and manage your information.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-12 backdrop-blur-sm bg-white/80">
          {/* Last Updated */}
          <div className="text-sm text-gray-500 text-center">
            Last Updated: March 15, 2025
          </div>

          {/* Introduction */}
          <section className="prose max-w-none">
            <p className="text-gray-700">
              AccessShare is committed to protecting your privacy and ensuring the security of your
              personal information. This Privacy Policy explains how we collect, use, share, and
              protect your data when you use our platform.
            </p>
          </section>

          {/* Main Sections */}
          {sections.map((section, index) => (
            <section key={index} className="space-y-6">
              <h2 className="text-2xl font-semibold text-primary-600">
                {section.title}
              </h2>
              {section.content.map((subsection, subIndex) => (
                <div key={subIndex} className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {subsection.subtitle}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    {subsection.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}

          {/* Contact Information */}
          <section className="bg-primary-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-primary-700 mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or how we handle your
              information, please contact our Privacy Team:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Email: privacy@accessshare.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Privacy Street, Security City, ST 12345</li>
            </ul>
          </section>

          {/* Consent Section */}
          <section className="text-center text-gray-600 text-sm">
            <p>
              By using AccessShare, you agree to the collection and use of information in
              accordance with this Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Privacy;
