import { Shield, Brain, Share2, OptionIcon } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Shield className="text-blue-400" />,
      title: "End-to-End Encryption",
      desc: "Data encrypted on your device,stays encrypted throughout its journey."
    },
    {
      icon: <Brain className="text-blue-400" />,
      title: "Zero-Knowledge Architecture",
      desc: "We have no way to access your files or encryption keys, ensuring absolute privacy."
    },
    {
      icon: <Share2 className="text-blue-400" />,
      title: "Secure File Sharing", 
      desc: "Share files securely with expiration links, password protection, and granular access controls."
    }
  ];
  return (
    <section className="bg-[#050505] text-white py-24 px-8">
      <h2 className="text-3xl font-bold text-center mb-16">Features</h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
        {features.map((f, i) => (
          <div key={i}>
            <div className="mb-6">{f.icon}</div>       
            <h3 className="text-xl font-bold">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>            
    </section>  
  );
}