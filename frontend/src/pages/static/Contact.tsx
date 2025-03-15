import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import bgPattern from '../../assets/images/backgrounds/pattern-light.svg';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      title: 'Email',
      value: 'support@accessshare.com',
      icon: '✉️',
    },
    {
      title: 'Phone',
      value: '+1 (555) 123-4567',
      icon: '📞',
    },
    {
      title: 'Hours',
      value: '24/7 Support',
      icon: '🕒',
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            We're here to help and answer any questions you might have
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-white/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="text-center p-6 bg-primary-50 rounded-lg"
              >
                <span className="text-4xl mb-4 block">{info.icon}</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600">{info.value}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select a subject</option>
                <option value="blood-donation">Blood Donation</option>
                <option value="medical-equipment">Medical Equipment</option>
                <option value="caregiver-services">Caregiver Services</option>
                <option value="technical-support">Technical Support</option>
                <option value="feedback">General Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-primary-600 text-white rounded-md font-medium
                  ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-primary-700'}
                  transition-colors`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>

          <div className="mt-12 p-6 bg-primary-50 rounded-lg">
            <h3 className="text-lg font-medium text-primary-700 mb-4">
              Emergency Contact
            </h3>
            <p className="text-gray-600">
              For medical emergencies, please contact your local emergency services immediately.
              In the United States, dial 911.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
