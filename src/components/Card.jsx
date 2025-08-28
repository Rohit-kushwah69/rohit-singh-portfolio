import React from "react";

const Card = ({ title, value }) => {
  return (
    <div className="bg-gray-800 text-white p-6 rounded shadow hover:shadow-lg transition">
      <h3 className="text-lg">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default Card;
