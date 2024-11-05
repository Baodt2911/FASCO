const Subcribe = () => {
  return `
  <!-- image left -->
<div class="flex justify-start">
  <img src="../../src/images/img16.png" alt="" />
</div>
<!-- content  -->
<div class="flex flex-col items-center">
  <!-- title -->
  <h1 class="font-volkhov text-5xl text-[#484848]">
    Subscribe To Our Newsletter
  </h1>
  <p class="font-poppins text-[#8A8A8A] block w-3/4 mt-5">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis
    ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
  </p>
  <!-- form  -->
  <div class="w-3/4">
    <div
      class="w-full h-14 px-5 mt-10 mb-10"
      style="box-shadow: 0 50px 30px 0 #d9d9d980"
    >
      <input
        class="w-full h-full outline-none font-poppins"
        type="text"
        placeholder="michael@ymail.com"
      />
    </div>
    <!-- button subscribe  -->
    <button
      class="bg-black mx-auto flex rounded-xl w-44 h-14 items-center justify-center hover:text-[#FF4646] font-poppins text-sm text-white shadow-xl shadow-[#bbbbbbcc]"
    >
      Subscribe
    </button>
  </div>
</div>
<!-- image right  -->
<div class="flex justify-end">
  <img src="../../src/images/img17.png" alt="" />
</div>
  `;
};
export default Subcribe;
