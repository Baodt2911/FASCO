const email = document.getElementById("emailSignIn");
const password = document.getElementById("passwordSignIn");
const btnSignIn = document.getElementById("btn-signIn");
const SignIn = () => {
  fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email: email.value, password: password.value }),
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw Error(res.statusText);
    })
    .then((user) => console.log("user: ", user))
    .catch((error) => {
      console.log(error);
    });
};

btnSignIn.addEventListener("click", SignIn);
