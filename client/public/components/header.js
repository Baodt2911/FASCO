const Header = (isLogin) => {
  return `
<a href="../pages/index.html" class="logo font-volkhov text-5xl text-[#484848]"
  >FASCO</a
>
<nav class="flex justify-center items-center gap-x-14">
  <!-- Menu -->
  <ul class="flex justify-center items-center gap-x-14">
    <li>
      <a
        href=""
        class="hover:text-[#FF4646] font-poppins text-sm text-[#484848]"
        >Home</a
      >
    </li>
    <li>
      <a
        href="../pages/shop.html"
        class="hover:text-[#FF4646] font-poppins text-sm text-[#484848]"
        >Fashion</a
      >
    </li>
    <li>
      <a
        href=""
        class="hover:text-[#FF4646] font-poppins text-sm text-[#484848]"
        >Men</a
      >
    </li>
    <li>
      <a
        href=""
        class="hover:text-[#FF4646] font-poppins text-sm text-[#484848]"
        >Women</a
      >
    </li>
    <li class="${isLogin ? "hidden" : "block"}">
      <a
        href="../pages/signIn.html"
        class="hover:text-[#FF4646] font-poppins text-sm text-[#484848]"
        >Sign in</a
      >
    </li>
  </ul>
  ${
    isLogin
      ? `<a href="#"  class="hover:text-[#FF4646] font-poppins shadow-xl ">
      <i class="fa-regular fa-user"></i>
      </a>`
      : `<a
    href="../pages/Signup.html"
    class="bg-black rounded-xl w-36 h-14 flex items-center justify-center hover:text-[#FF4646] font-poppins text-sm text-white shadow-xl shadow-[#bbbbbbcc]"
    >Sign Up</a
  >`
  }
</nav>
  `;
};
export default Header;
