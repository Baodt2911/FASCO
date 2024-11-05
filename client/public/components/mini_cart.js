const MiniCart = () => {
  return `
  <div class="overlay-mini-cart w-3/5 h-full bg-[#787878CC]"></div>
<div
  class="relative w-2/5 h-full bg-white py-5 px-10 flex flex-col justify-between"
>
  <button class="btn-hide-mini-cart absolute top-5 right-5">
    <i class="fa-solid fa-xmark text-3xl"></i>
  </button>
  <!-- title  -->
  <div>
    <h1 class="font-volkhov text-5xl mt-5">Shopping Cart</h1>
    <p class="font-poppins text-2xl text-[#8A8A8A] mt-5">
      Buy <b class="text-black">$122.35</b> More And Get
      <b class="text-black">Free Shipping</b>
    </p>
  </div>
  <!-- products -->
  <div
    class="mini-cart-products flex flex-1 flex-col gap-y-10 mt-10 pb-10 overflow-y-scroll"
  >
    <!-- item product  -->
  </div>
  <div class="w-full">
    <div class="flex items-center border-b-2 border-[#f5f5f5] py-3 gap-x-3">
      <input
        type="checkbox"
        class="size-5 border-2 border-black outline-none"
      />
      <p>For <b>$10.00</b> please wrap the product</p>
    </div>
    <!-- subtotal -->
    <div class="flex items-center justify-between my-5">
      <p class="font-volkhov text-lg">Subtotal</p>
      <p class="font-volkhov text-lg">$100.00</p>
    </div>
    <!-- checkout  -->
    <button
      class="bg-black rounded-xl w-full h-14 flex items-center justify-center hover:text-[#FF4646] font-poppins text-sm text-white shadow-xl shadow-[#bbbbbbcc] mb-3"
    >
      Check out
    </button>
    <!-- view cart -->
    <div class="w-full flex justify-center">
      <a href="" class="underline font-volkhov text-lg">View Cart</a>
    </div>
  </div>
</div>
  `;
};
export default MiniCart;
