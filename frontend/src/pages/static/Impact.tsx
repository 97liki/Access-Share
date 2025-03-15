import { motion } from 'framer-motion';
import bgPattern from '../../assets/images/backgrounds/pattern-light.svg';

const Impact = () => {
  const stats = [
    { label: 'Blood Donations', value: '1,000+', description: 'Successful matches' },
    { label: 'Medical Devices', value: '500+', description: 'Shared or donated' },
    { label: 'Caregivers', value: '250+', description: 'Active professionals' },
    { label: 'Communities', value: '50+', description: 'Served nationwide' },
  ];

  const testimonials = [
    {
      quote: "AccessShare helped me find a caregiver for my mother within days. The platform's verification system gave us peace of mind.",
      author: "Sarah M.",
      role: "Family Member"
    },
    {
      quote: "I've been able to donate blood to those in need and even share medical equipment I no longer needed. It's a wonderful platform.",
      author: "David R.",
      role: "Blood Donor"
    },
    {
      quote: "As a caregiver, this platform has connected me with families who truly need support. The process is seamless and professional.",
      author: "Maria L.",
      role: "Professional Caregiver"
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h1>
          <p className="text-xl text-gray-600">
            Making a difference in healthcare accessibility, one connection at a time
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-12 backdrop-blur-sm bg-white/80">
          {/* Impact Statistics */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 bg-primary-50 rounded-lg"
              >
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-600">{stat.description}</div>
              </div>
            ))}
          </section>

          {/* Success Stories */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary-600">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 bg-primary-50 rounded-lg relative"
                >
                  <div className="text-4xl text-primary-200 absolute top-4 left-4">"</div>
                  <div className="relative z-10">
                    <p className="text-gray-700 mb-4 italic">
                      {testimonial.quote}
                    </p>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{testimonial.author}</p>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Community Impact */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary-600">Community Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-primary-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-700 mb-3">Healthcare Access</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Reduced wait times for medical equipment</li>
                  <li>• Improved blood donation response rates</li>
                  <li>• Enhanced caregiver matching efficiency</li>
                  <li>• Increased community health awareness</li>
                </ul>
              </div>
              <div className="p-6 bg-primary-50 rounded-lg">
                <h3 className="text-lg font-medium text-primary-700 mb-3">Economic Impact</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Cost savings through equipment sharing</li>
                  <li>• Job opportunities for caregivers</li>
                  <li>• Reduced healthcare transportation costs</li>
                  <li>• Efficient resource allocation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-primary-100 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-primary-700 mb-4">
              Join Us in Making a Difference
            </h2>
            <p className="text-gray-700 mb-6">
              Whether you're looking to donate, share, or provide care, your contribution
              matters in building a healthier community.
            </p>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors">
              Get Started Today
            </button>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Impact;
