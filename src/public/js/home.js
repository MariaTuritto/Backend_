async function addProduct(id) {

    const cart = getCookie('cart');
    if(cart){
        const response = await fetch(`/api/carts/${cart}/products/${id}`, {
            method:'PUT'
        })
        const result = await response.json();
        console.log(result);
    }

    else{//en caso de no encontrar cookkie, ya hay un usuario
        const response = await fetch(`/api/carts/products/${id}`,{
            method:'Put'
        })
        const result = await response.json();
        console.log(result);
    }

}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}