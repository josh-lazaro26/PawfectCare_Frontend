import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserNavigation from "../../Components/Navigation/TopNavUser";
import AdoptionBanner from "../../assets/User-Page-Image/AdoptionBanner.png";
import PetGroup from "../../assets/User-Page-Image/PetGroup.svg";
import AdoptionConfirmationModal from "../../Components/Modals/AdoptionConfirmationModal";
import ChatWidget from "../../Components/ChatWidget/ChatWidget";
import CategoryButtons from "../../Components/PetCategory/CategoryButtons";
import PetLists from "../../Components/PetCategory/PetLists";

function AdoptionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);

  // Default category is "All"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPet, setSelectedPet] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (location.state?.showAdoptionConfirmation) {
      setShowAdoptionModal(true);
      const timer = setTimeout(() => setShowAdoptionModal(false), 2000);
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="min-h-screen text-gray-900 relative bg-white">
      {/* Top Navigation */}
      <UserNavigation />

      {/* Banner */}
      <div className="w-full bg-[#D7DBF5] mt-[40px]">
        <img
          src={AdoptionBanner}
          alt="Adoption Campaign Banner"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Pet Category Section */}
      <section className="px-4 sm:px-6 py-8 sm:py-12 max-w-7xl mx-auto mt-8 sm:mt-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center">
          Available Pets for Adoption
        </h2>

        {/*Pass token to CategoryButtons */}
        <CategoryButtons
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          token={token}
        />

        {/* Pet Group Image */}
        {!selectedCategory && (
          <div className="flex justify-center -mt-20 sm:-mt-32 md:-mt-48 mb-8 sm:mb-12">
            <img
              src={PetGroup}
              alt="Group of pets illustration"
              className="w-full max-w-xs sm:max-w-md md:max-w-2xl h-auto"
            />
          </div>
        )}

        {/* Pass token to PetLists */}
        {selectedCategory && (
          <PetLists
            selectedCategory={selectedCategory}
            onSelectPet={setSelectedPet}
            token={token}
          />
        )}
      </section>

      {/* Floating Chat Icon */}
      <ChatWidget />
      {/* Adoption Confirmation Modal */}
      <AdoptionConfirmationModal
        isOpen={showAdoptionModal}
        onClose={() => setShowAdoptionModal(false)}
      />
    </div>
  );
}

export default AdoptionPage;
