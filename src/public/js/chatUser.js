const socketClient= io();
const userName = document.getElementById("userName");
const form = document.getElementById("formulario");
const inputMessage = document.getElementById("message");
const chat = document.getElementById("chat");

let user = null;

if (!user) {
  Swal.fire({
    title: "Bienvenido a tu espacio de conección!",
    text: "Enter your UserName",
    input: "text",
    inputValidator: (value) => {
      if (!value) {
        return "Por favor ingresa tu usuario";
      }
    },
  }).then((userName) => {
    user = userName.value;
    userName.innerHTML = user;
    socketClient.emit("newUser", user);
  });
}

form.onsubmit = (e) => {
  e.preventDefault();
  const info = {
    user: user,
    message: inputMessage.value,
  };
  console.log(info);
  socketClient.emit("message", info);
  inputMessage.value = " ";
};


socketClient.on("chat", (message) => {
  const chatRender = message;
 
  const virtualFragment = document.createDocumentFragment();

  for(let i=0; i<message.length; i++){
    const newDiv = document.createElement('div');
    const p = document.createElement('p');
    p.innerHTML =  `${message[i].user} say: ${message[i].message}`
    newDiv.appendChild(p);
    virtualFragment.appendChild(newDiv);
  }
chat.appendChild(virtualFragment);
chat.innerHTML = chatRender;

})

socketClient.on("broadcast", (user) => {
  Toastify({
    text: `${user} Joined to chat`,
    duration: 5000,
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
});


