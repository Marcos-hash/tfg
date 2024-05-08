document.addEventListener("DOMContentLoaded", function () {
    // Espera a que la página se cargue completamente


});



// Función para obtener la lista de usuarios
async function loginUser() {

      let datos = {};
      datos.nickname = document.getElementById('txtNickname').value;
      datos.password = document.getElementById('txtPassword').value;



      const request = await fetch('login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      if (request.ok) {
              const user = await request.json();
              const userId = user.id;
              window.location.href = `userProfile.html?id=${userId}`;
          } else {
              alert("Your credentials are incorrect. Please try again");
              document.location.reload();
          }
}


