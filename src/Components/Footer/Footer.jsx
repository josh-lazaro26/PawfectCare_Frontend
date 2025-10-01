import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-5 px-5 md:px-20">
      <div className="text-center mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 text-m gap-8 text-center md:text-left">
        <div>
          <h4 className="font-semibold mb-2">Location:</h4>
          <p>
            Office of Veterinary Services,
            <br />
            Bonifacio Street, Barangay Poblacion,
            <br />
            Tacurong, Philippines, 9800
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Email:</h4>
          <p>ovstacurong@gmail.com</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact Number:</h4>
          <p>09705475747</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Website:</h4>
          <p>www.pawfectcare.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
