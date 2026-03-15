import { FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ name, price, category, color, badge }) => (
  <div className="bg-white rounded-[2.5rem] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">

    {/* Badge */}
    {badge && (
      <span className="absolute top-4 left-4 bg-green-600 text-white text-[10px] px-3 py-1 rounded-full font-bold">
        {badge}
      </span>
    )}

    {/* Image */}
    <div className={`rounded-[2rem] h-44 mb-4 flex items-center justify-center ${color}`}>
      <img
        src={`/images/${name}.png`}
        alt={name}
        className="h-32 object-contain"
      />
    </div>

    {/* Product Info */}
    <div className="px-2">

      <p className="text-gray-400 text-[10px] font-bold uppercase">
        {category}
      </p>

      <h3 className="font-bold text-lg text-gray-800">
        {name}
      </h3>

      {/* Rating */}
      <div className="text-yellow-400 text-sm mt-1">
        ★★★★★
      </div>

      {/* Price + Button */}
      <div className="flex justify-between items-center mt-3">

        <span className="font-bold text-xl text-green-900">
          ₱{price}
        </span>

        <button className="flex items-center gap-1 bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-800 active:scale-95 transition">
          <FiShoppingCart />
          Add
        </button>

      </div>
    </div>
  </div>
);

export default ProductCard;