import { Lock, Shield, Key } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="bg-[#050505] text-white py-24 px-8">
      <h2 className="text-3xl font-bold text-center mb-12">
        How CypherVault Works
      </h2>

      <div className="max-w-4xl mx-auto bg-gray-900/30 border border-gray-800 rounded-3xl p-12 text-center">
        <p className="text-blue-400 mb-12">
          Encryption starts on your client side
        </p>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-400">
              Your Keys on <br /> your client side
            </p>
          </div>

          <div className="hidden md:block flex-1 h-1px bg-gray-700 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-[#050505] px-2 text-gray-500 uppercase tracking-widest">
              Encryption
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-600/20 border border-blue-500/50 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="text-blue-400" size={32} />
            </div>
            <p className="text-xs text-gray-400">
              Encryption is exclusively <br /> on your client side
            </p>
          </div>

          <div className="hidden md:block flex-1 h-1px bg-gray-700 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-[#050505] px-2 text-gray-500 uppercase tracking-widest">
              Decryption
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <Key className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-400">
              Your Keys never <br /> leave your control
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}