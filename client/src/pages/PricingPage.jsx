import React from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["5 Basic templates", "Limited customization", "Watermarked downloads", "Standard quality"],
    popular: false,
  },
  {
    name: "Pro",
    price: "₹99",
    period: "month",
    description: "Best for regular users",
    features: ["100+ Premium templates", "Full customization", "No watermark", "HD quality downloads", "Priority support", "Save to account"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₹499",
    period: "month",
    description: "For businesses",
    features: ["Custom branding", "Bulk creation", "API access", "Dedicated support", "White-label", "Analytics"],
    popular: false,
  },
];

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 md:py-16 relative overflow-hidden min-h-[calc(100vh-64px)]">
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500 rounded-full opacity-10 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Choose the plan that works best for you. Upgrade or downgrade anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-5 md:p-6 rounded-2xl border flex flex-col ${
                plan.popular 
                  ? "bg-gradient-to-b from-purple-600/20 to-pink-600/20 border-purple-500" 
                  : "bg-gray-800/50 border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-white">₹{plan.price}</span>
                <span className="text-gray-400 text-sm">/{plan.period}</span>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => navigate("/templates")}
                className={`w-full py-2.5 rounded-lg font-medium transition ${
                  plan.popular 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600" 
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">All plans include 14-day free trial. No credit card required.</p>
      </div>
    </section>
  );
};

export default PricingPage;
