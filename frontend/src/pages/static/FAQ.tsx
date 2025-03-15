import { useState } from 'react';
import { motion } from 'framer-motion';
import bgPattern from '../../assets/images/backgrounds/pattern-light.svg';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqItems: FAQItem[] = [
    {
      category: 'general',
      question: 'What is AccessShare?',
      answer: 'AccessShare is a healthcare platform that connects people needing medical resources with those who can provide them. We facilitate blood donation, medical equipment sharing, and caregiver services.'
    },
    {
      category: 'blood',
      question: 'How does blood donation work?',
      answer: 'Users can create blood donation requests or offers. Our system matches donors with recipients based on blood type and location. All donations must be conducted through licensed medical facilities.'
    },
    {
      category: 'blood',
      question: 'Is blood donation safe?',
      answer: 'Yes, all blood donations are conducted through licensed medical facilities following strict safety protocols. We only facilitate the matching process.'
    },
    {
      category: 'devices',
      question: 'What types of medical equipment can be shared?',
      answer: 'Common items include wheelchairs, hospital beds, mobility aids, and other non-disposable medical equipment. All items must be in good condition and properly sanitized.'
    },
    {
      category: 'devices',
      question: 'How is equipment quality ensured?',
      answer: 'Equipment owners must provide detailed condition information and photos. Recipients can rate and review their experience, helping maintain high quality standards.'
    },
    {
      category: 'caregivers',
      question: 'Are caregivers verified?',
      answer: 'Yes, all caregivers undergo background checks and must provide proper certification. We verify their credentials and maintain a review system.'
    },
    {
      category: 'caregivers',
      question: 'How are caregiver services priced?',
      answer: 'Caregivers set their own rates based on their experience and services offered. All pricing is transparent and displayed on their profiles.'
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click the "Sign Up" button, fill in your details, verify your email, and complete your profile. The process takes just a few minutes.'
    },
    {
      category: 'account',
      question: 'Is my information secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your data. We never share personal information without your consent.'
    },
    {
      category: 'support',
      question: 'What if I need help?',
      answer: 'Our support team is available 24/7. You can reach us through the Contact page, email, or in-app messaging system.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General' },
    { id: 'blood', label: 'Blood Donation' },
    { id: 'devices', label: 'Medical Equipment' },
    { id: 'caregivers', label: 'Caregivers' },
    { id: 'account', label: 'Account' },
    { id: 'support', label: 'Support' }
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about AccessShare
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-white/80">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <span className={`transform transition-transform ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>
                {activeIndex === index && (
                  <div className="px-6 py-4 bg-gray-50">
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="mt-12 p-6 bg-primary-50 rounded-lg text-center">
            <h3 className="text-lg font-medium text-primary-700 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to help you 24/7
            </p>
            <button className="bg-primary-600 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FAQ;
