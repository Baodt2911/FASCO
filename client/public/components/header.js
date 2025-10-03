const Header = (isLogin) => {
  return `
<a href="index.html" class="logo font-volkhov text-5xl text-[#484848]"
  >FASCO</a
>
<nav class="flex justify-center items-center gap-x-14">
  <!-- Menu -->
  <ul class="flex justify-center items-center gap-x-14">
    <li>
      <a
        href="index.html"
        class="hover:text-[#FF4646] font-poppins text-sm text-[#484848]"
        >Home</a
      >
    </li>
    <li>
      <a
        href="shop.html"
        class="hover:text-[#FF4646] font-poppins text-sm text-[#484848]"
        >Fashion</a
      >
    </li>
    <li>
      <a
        href="shop.html?sex=men"
        class="hover:text-[#FF4646] font-poppins text-sm text-[#484848]"
        >Men</a
      >
    </li>
    <li>
      <a
        href="shop.html?sex=women"
        class="hover:text-[#FF4646] font-poppins text-sm text-[#484848]"
        >Women</a
      >
    </li>
    <li class="${isLogin ? "hidden" : "block"}">
      <a
        href="signIn.html"
        class="hover:text-[#FF4646] font-poppins text-sm text-[#484848]"
        >Sign in</a
      >
    </li>
  </ul>
  ${
    isLogin
      ? `<div class="relative">
        <a href="#"  class="hover:text-[#FF4646] font-poppins shadow-xl icon-user">
      <i class="fa-regular fa-user"></i>
      </a>
        <div class="border absolute w-56 bg-white top-10  shadow-md rounded-sm  transition-all opacity-0 visible card-user">
        <ul>
          <li><a href="account.html" class="block font-poppins px-5 py-2 hover:bg-[#f5f5f5]">You account</a></li>
          <li><a href="orders.html" class="block font-poppins px-5 py-2 hover:bg-[#f5f5f5]">Orders</a></li>
          <li><a href="" class="block font-poppins px-5 py-2 hover:bg-[#f5f5f5]">Help and contact</a></li>
        </ul>
        <button class="btn-logout bg-black  w-full py-2 flex items-center justify-center hover:text-[#FF4646] font-poppins text-sm text-white shadow-xl shadow-[#bbbbbbcc]">Logout</button>
        </div>
      </div> `
      : `<a
    href="Signup.html"
    class="bg-black rounded-xl w-36 h-14 flex items-center justify-center hover:text-[#FF4646] font-poppins text-sm text-white shadow-xl shadow-[#bbbbbbcc]"
    >Sign Up</a
  >`
  }
</nav>
  `;
};
export default Header;
