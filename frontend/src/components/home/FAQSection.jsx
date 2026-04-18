import { useState } from 'react';

const faqs = [
  {
    question: "How can I track my order?",
    answer: "You can track your order status and view real-time updates directly from the 'Orders' section in your account dashboard."
  },
  {
    question: "Are the bats pre-knocked?",
    answer: "While some bats come factory-pressed, we highly recommend manual knocking-in before match use to ensure optimal performance and longevity. We also offer a professional knocking-in service as an add-on."
  },
  {
    question: "Do you offer discounts for cricket clubs or academies?",
    answer: "Absolutely! We love supporting the grassroots of the game. Please reach out to our support team at support@crickcart.com with your club's details to explore bulk discounts and sponsorships."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently we ship across India only. International shipping is on our roadmap — stay tuned!"
  },
  {
    question: "Is there a warranty on your products?",
    answer: "All our products come with standard manufacturer warranties covering manufacturing defects. Damage from regular play, yorkers, or misuse is not covered."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 mb-16 relative">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black italic text-navy uppercase tracking-tight mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            Everything you need to know about your gear, orders, and more.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-xl transition-all duration-300 overflow-hidden ${isOpen ? 'border-primary shadow-lg shadow-primary/10 bg-white' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
              >
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center group focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={`font-bold text-lg pr-4 transition-colors ${isOpen ? 'text-navy' : 'text-slate-800'}`}>
                    {faq.question}
                  </span>
                  <span className={`material-symbols-outlined transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                    expand_more
                  </span>
                </button>
                
                <div 
                  className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 font-medium mb-4">Still have questions?</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
            <span className="material-symbols-outlined text-sm">mail</span>
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
