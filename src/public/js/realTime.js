const socketClient = io();

socketClient.on("sendProducts", (listProducts) => {
  updateProductList(listProducts);
});

function updateProductList(listProducts) {
  let div = document.getElementById("container-form");

  let prod = listProducts;

  let products = "";
 
  div.innerHTML = "";

  prod.forEach((product) => {
    products += `
      <article class="card-container" id="card${product.id}"> 
        <div class="card-body">
          <div class="card-img-box">
            <img class="card-img" alt="${product.title}" src="${product.thumbnail}" width="100" />
          </div>
          <div class="card-content">
            <h4 class="card-title">${product.title}</h4>
              <p class="text">${product.description}</p>
              <p class="text">${product.category}</p>
              <p class="text">${product.stock}</p>
              <p class="text">${product.price}</p>
           
          </div>
        </div>
      </article>`;
  });

  div.innerHTML = products;
}

let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let stock = form.elements.stock.value;
  let thumbnail = form.elements.thumbnail.value;
  let category = form.elements.category.value;
  let price = form.elements.price.value;
  let code = form.elements.code.value;

  socketClient.emit("addProduct", {
    title,
    description,
    stock,
    thumbnail,
    category,
    price,
    code,
  });

  form.reset();
});

document.getElementById("delete-btn").addEventListener("click", (e) => {
  const deleteIdInput = document.getElementById("pid");
  const deleteId = parseInt(deleteIdInput.value);
  socketClient.emit("deleteProduct", deleteId);
  deleteIdInput.value = "";
});
