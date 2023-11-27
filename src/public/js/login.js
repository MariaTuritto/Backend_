const form = document.getElementById('loginform');

form.addEventListener('submit',async event=>{
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value,key)=>obj[key]=value);
    const response = await fetch('/api/sessions/login',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":'application/json'
        }
    })

    const result = await response.json();
    if(response.status ===200)
    {
        window.location.replace('/');
    }
})

async function restorePassword(){
    Swal.fire({
        text:'Ingresa tu mail, te enviaremos un mail para restauración',
        input:'text',
        inputValidator: (value) => {
            return !value && "Es necesario un correo para poder enviar el link de restauración"
        }
    }).then(async result=>{
        try{
            if(result.value){
                const email = result.value;
                const response = await fetch('/api/sessions/passwordRestoreRequest',{
                    method:'POST',
                    body: JSON.stringify({email}),
                    headers:{
                        'Content-Type':'application/json'
                    }
                })
                Swal.fire({
                    status:"success",
                    text:"Si el usuario está en nuestra base, se enviará un correo electrónico con el link de restablecimiento"
                })
            }
        }catch(error){
            console.log(error);
        }
    })
}