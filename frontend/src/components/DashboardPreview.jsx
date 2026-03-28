export default function DashboardPreview() {
  return (
    <div className="bg-[#050505] py-20 flex justify-center px-4">
      <div className="w-full max-w-4xl bg-[#0F1117] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden aspect-video flex">
        
        {/* Sidebar UI Mockup */}
        <div className="w-48 border-r border-gray-800 p-4 hidden md:block">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-800 rounded"></div>
            <div className="h-4 w-20 bg-gray-800 rounded"></div>
            <div className="h-4 w-28 bg-gray-800 rounded"></div>
          </div>
        </div>

        {/* Content UI Mockup */}
        <div className="flex-1 p-8">
          <div className="flex justify-between mb-8">
            <div className="h-8 w-32 bg-gray-800 rounded"></div>
            <div className="h-8 w-24 bg-blue-600 rounded"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-24 bg-gray-800/50 rounded-xl border border-gray-800"></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}