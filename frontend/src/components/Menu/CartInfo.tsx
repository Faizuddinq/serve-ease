import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";
import { RootState } from "../../redux/store"; // Import RootState type
import { CartItem } from "../../redux/slices/cartSlice"; // Import CartItem type

const CartInfo: React.FC = () => {
  // ✅ Type the useSelector Hook
  const cartData = useSelector((state: RootState) => state.cart);

  // ✅ Type useRef Hook (Ref for scrolling)
  const scrolLRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrolLRef.current) {
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartData]);

  // ✅ Type Dispatch Function
  const handleRemove = (itemId: string) => {
    dispatch(removeItem(itemId));
  };

  return (
    <div className="px-4 py-2">
      <h1 className="text-lg text-[#e4e4e4] font-semibold tracking-wide">
        Order Details
      </h1>
      <div
        className="mt-4 overflow-y-scroll scrollbar-hide h-[380px]"
        ref={scrolLRef}
      >
        {cartData.length === 0 ? (
          <p className="text-[#ababab] text-sm flex justify-center items-center h-[380px]">
            Your cart is empty. Start adding items!
          </p>
        ) : (
          cartData.map((item: CartItem) => (
            <div
              key={item.id} // ✅ Added key for React list rendering
              className="bg-[#1f1f1f] rounded-lg px-4 py-4 mb-2"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-[#ababab] font-semibold tracking-wide text-md">
                  {item.name}
                </h1>
                <p className="text-[#ababab] font-semibold">x{item.quantity}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <RiDeleteBin2Fill
                    onClick={() => handleRemove(item.id)}
                    className="text-[#ababab] cursor-pointer"
                    size={20}
                  />
                  <FaNotesMedical className="text-[#ababab] cursor-pointer" size={20} />
                </div>
                <p className="text-[#f5f5f5] text-md font-bold">₹{item.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartInfo;
