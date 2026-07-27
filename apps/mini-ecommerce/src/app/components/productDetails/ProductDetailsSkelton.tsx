export default function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
      {/* LEFT SIDE */}
      <div className="flex gap-4">
        {/* thumbnails */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-20 rounded-md bg-gray-200" />
          ))}
        </div>

        {/* main image */}
        <div className="w-full h-[500px] bg-gray-200 rounded-lg" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col gap-6">
        <div className="w-32 h-4 bg-gray-200 rounded" />

        <div className="w-3/4 h-8 bg-gray-200 rounded" />

        <div className="flex gap-3">
          <div className="w-24 h-5 bg-gray-200 rounded" />
          <div className="w-16 h-5 bg-gray-200 rounded" />
        </div>

        <div className="flex gap-4">
          <div className="w-28 h-8 bg-gray-200 rounded" />
          <div className="w-20 h-6 bg-gray-200 rounded" />
        </div>

        <div className="w-40 h-5 bg-gray-200 rounded" />

        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-16 h-6 bg-gray-200 rounded-full" />
          ))}
        </div>

        <div className="space-y-2">
          <div className="w-48 h-4 bg-gray-200 rounded" />
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-5/6 h-4 bg-gray-200 rounded" />
        </div>

        <div className="flex gap-4 mt-4">
          <div className="w-40 h-12 bg-gray-200 rounded-lg" />
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* REVIEWS */}
      <div className="md:col-span-2 mt-12 border-t pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
