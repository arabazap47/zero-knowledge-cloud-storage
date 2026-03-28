import { Lock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative px-8 pt-20 pb-32 bg-[#050505] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Your Files. Your Keys.<br />Your Privacy.
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md">
            Experience privacy-first cloud storage. We cannot access your data;
            only you hold the keys.
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-600 px-8 py-3 rounded-lg font-semibold">
              Start Secure Storage
            </button>
            <button className="border border-gray-700 px-8 py-3 rounded-lg font-semibold">
              View Demo
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center relative">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
            <div className="relative border border-blue-500/30 rounded-3xl p-8 backdrop-blur-sm bg-blue-900/10">
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-blue-400/20 rounded-2xl">
                <Lock size={64} className="text-blue-400 mb-4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}