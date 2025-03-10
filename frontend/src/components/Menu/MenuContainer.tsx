import React, { useState } from "react";
import { menus } from "../../constants";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";

// ✅ Define Menu Item Type
interface MenuItem {
  id: number;
  name: string;
  price: number;
  category?: string; // ✅ Made optional for consistency
}

// ✅ Define Menu Type
interface Menu {
  id: number;
  name: string;
  icon: React.ReactNode; // ✅ Correct JSX type
  bgColor: string;
  items: MenuItem[];
}

const MenuContainer: React.FC = () => {
  // ✅ Ensure `menus[0]` matches the `Menu` type
  const [selected, setSelected] = useState<Menu>(menus[0] as Menu);
  const [itemCount, setItemCount] = useState<number>(0);
  const [itemId, setItemId] = useState<number | null>(null);
  const dispatch = useDispatch();

  // ✅ Handle Increment
  const increment = (id: number) => {
    setItemId(id);
    if (itemCount >= 4) return;
    setItemCount((prev) => prev + 1);
  };

  // ✅ Handle Decrement
  const decrement = (id: number) => {
    setItemId(id);
    if (itemCount <= 0) return;
    setItemCount((prev) => prev - 1);
  };

  // ✅ Handle Add to Cart
  const handleAddToCart = (item: MenuItem) => {
    if (itemCount === 0) return;

    const { name, price } = item;
    const newObj = {
      id: Date.now().toString(), // ✅ Unique ID
      name,
      pricePerQuantity: price,
      quantity: itemCount,
      price: price * itemCount,
    };

    dispatch(addItems(newObj));
    setItemCount(0);
  };

  return (
    <>
      {/* Category Selection */}
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer"
            style={{ backgroundColor: menu.bgColor }}
            onClick={() => {
              setSelected(menu as Menu); // ✅ Type assertion
              setItemId(null);
              setItemCount(0);
            }}
          >
            <div className="flex items-center justify-between w-full">
              <h1 className="text-[#f5f5f5] text-lg font-semibold">
                {menu.icon} {menu.name}
              </h1>
              {selected.id === menu.id && (
                <GrRadialSelected className="text-white" size={20} />
              )}
            </div>
            <p className="text-[#ababab] text-sm font-semibold">
              {menu.items.length} Items
            </p>
          </div>
        ))}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      {/* Menu Items */}
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {selected.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-start justify-between p-4 rounded-lg h-[150px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a]"
          >
            <div className="flex items-start justify-between w-full">
              <h1 className="text-[#f5f5f5] text-lg font-semibold">
                {item.name}
              </h1>
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg"
              >
                <FaShoppingCart size={20} />
              </button>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-[#f5f5f5] text-xl font-bold">₹{item.price}</p>
              <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg gap-6 w-[50%]">
                <button
                  onClick={() => decrement(item.id)}
                  className="text-yellow-500 text-2xl"
                >
                  &minus;
                </button>
                <span className="text-white">
                  {itemId === item.id ? itemCount : "0"}
                </span>
                <button
                  onClick={() => increment(item.id)}
                  className="text-yellow-500 text-2xl"
                >
                  &#43;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MenuContainer;
