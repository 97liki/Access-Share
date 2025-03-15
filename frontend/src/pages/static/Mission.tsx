import { motion } from 'framer-motion';
import bgPattern from '../../assets/images/backgrounds/pattern-light.svg';

const Mission = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h1>
          <p className="text-xl text-gray-600">
            Connecting hearts, sharing care, and building a healthier community together.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 backdrop-blur-sm bg-white/80">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-600">Vision</h2>
            <p className="text-gray-700">
              To create a world where healthcare resources and support are accessible to everyone,
              regardless of their location or economic status. We envision a community where sharing
              and caring go hand in hand, making quality healthcare a reality for all.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-600">Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-700 mb-2">Compassion</h3>
                <p className="text-gray-600">
                  We believe in the power of empathy and understanding in healthcare delivery.
                </p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-700 mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  Making healthcare resources available to everyone who needs them.
                </p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-700 mb-2">Community</h3>
                <p className="text-gray-600">
                  Building strong networks of support and care within communities.
                </p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-700 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  Leveraging technology to improve healthcare access and delivery.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary-600">Our Commitment</h2>
            <p className="text-gray-700">
              We are committed to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Facilitating blood donation and medical equipment sharing</li>
              <li>Connecting patients with qualified caregivers</li>
              <li>Ensuring privacy and security of all users</li>
              <li>Building a supportive healthcare community</li>
              <li>Continuously improving our platform based on user feedback</li>
            </ul>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Mission;
