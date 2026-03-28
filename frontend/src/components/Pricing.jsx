import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    { name: "Starter", price: "Free", storage: "10GB Limit", button: "Select Plan", color: "gray" },
    { name: "Pro", price: "$8.99", storage: "500GB Limit", button: "Select Plan", color: "blue" },
    { name: "Business", price: "$17.99", storage: "2TB+ Limit", button: "Select Plan", color: "gray" }
  ];

  return (
    <section className="bg-[#050505] text-white py-24 px-8">
      <h2 className="text-3xl font-bold text-center mb-16">Pricing</h2>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`p-8 rounded-3xl border ${
              plan.color === "blue"
                ? "border-blue-500/50 bg-blue-500/5"
                : "border-gray-800 bg-gray-900/20"
            } text-center`}
          >
            <p className="text-gray-400 font-medium mb-2">{plan.name}</p>

            <h3 className="text-4xl font-bold mb-8">{plan.price}</h3>

            <ul className="text-left space-y-4 mb-10 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-500" />
                Key Features
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-500" />
                No access to Storage
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-500" />
                {plan.storage}
              </li>
            </ul>

            <button
              className={`w-full py-3 rounded-xl font-semibold transition ${
                plan.color === "blue"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}