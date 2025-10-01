import React from "react";

function CategoryButtons({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6 sm:mb-8">
      {/* All Pets Button */}
      <button
        onClick={() => onSelectCategory("All")}
        className={`px-3 py-1 sm:px-5 sm:py-2 text-xs sm:text-sm rounded-full border transition ${
          selectedCategory === "All"
            ? "bg-[#a16f4a] text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        All Pets
      </button>

      {/* Dogs Button */}
      <button
        onClick={() => onSelectCategory("Dog")}
        className={`px-3 py-1 sm:px-5 sm:py-2 text-xs sm:text-sm rounded-full border transition ${
          selectedCategory === "Dog"
            ? "bg-[#a16f4a] text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Dogs
      </button>

      {/* Cats Button */}
      <button
        onClick={() => onSelectCategory("Cat")}
        className={`px-3 py-1 sm:px-5 sm:py-2 text-xs sm:text-sm rounded-full border transition ${
          selectedCategory === "Cat"
            ? "bg-[#a16f4a] text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Cats
      </button>
    </div>
  );
}

export default CategoryButtons;
