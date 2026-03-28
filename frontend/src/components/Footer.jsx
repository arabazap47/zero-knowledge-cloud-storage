import { Shield, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-gray-400 py-20 px-8 border-t border-gray-900">
      
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h2 className="text-4xl font-bold text-white mb-8">
          Take Control of Your<br />Data Privacy Today.
        </h2>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          Get Started with CypherVault
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-left text-sm border-t border-gray-900 pt-16">
        
        <div>
          <h4 className="text-white font-bold mb-6">Product</h4>
          <ul className="space-y-4">
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4">
            <li><a href="#">Careers</a></li>
            <li><a href="#">Investors</a></li>
            <li><a href="#">Resources</a></li>
            <li><a href="#">Links</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Resources</h4>
          <ul className="space-y-4">
            <li><a href="#">About</a></li>
            <li><a href="#">Resources</a></li>
            <li><a href="#">Legal</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <p className="mb-6">CypherVault Contents</p>

          <div className="flex gap-4">
            <Facebook size={18} className="hover:text-white cursor-pointer" />
            <Instagram size={18} className="hover:text-white cursor-pointer" />
            <Twitter size={18} className="hover:text-white cursor-pointer" />
            <Youtube size={18} className="hover:text-white cursor-pointer" />
          </div>
        </div>

      </div>

      <div className="mt-16 text-center text-xs">
        <div className="flex items-center justify-center gap-2 font-bold text-white mb-2">
          <Shield size={14} className="text-blue-600" /> CypherVault
        </div>
      </div>

    </footer>
  );
}