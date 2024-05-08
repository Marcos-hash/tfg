document.addEventListener("DOMContentLoaded", function () {
    // Espera a que la página se cargue completamente


});

// Función para obtener la lista de usuarios
async function registerUser() {

      let datos = {};
      datos.nickname = document.getElementById('txtNickname').value;
      datos.age = document.getElementById('txtAge').value;
      datos.email = document.getElementById('txtEmail').value;
      if (!validateEmail(datos.email)) {
          alert("Email must finish by '@gmail.com'");
          return;
      }
      datos.password = document.getElementById('txtPassword').value;

      // Validar que todos los campos estén completos
      const requiredFields = document.querySelectorAll('.required');
      let formComplete = true;

      requiredFields.forEach((field) => {
          if (!field.value) {
              formComplete = false;
              // Agregar estilo de borde rojo a los campos no completos
              field.style.borderColor = 'red';
          } else {
              // Restablecer el estilo del borde para los campos completos
              field.style.borderColor = '';

          }
      });

      if (!formComplete) {
          alert("Please, fullfill all the fields.");
          return;
      }

      //position
      const positions = document.getElementsByName("position");
      for(const pos of positions){

        if(pos.checked){
            datos.position = pos.value;
        }
      }

      //level
      const levels = document.getElementsByName("level");
        for(const lev of levels){
          if(lev.checked){
              datos.level = lev.value;
          }
        }

      //physical
      const physicals = document.getElementsByName("physical");
          for(const phy of physicals){
            if(phy.checked){
                datos.physical = phy.value;
            }
          }

      // Validar que todos los campos estén completos
      if (!datos.nickname || !datos.age || !datos.email || !datos.password || !datos.physical || !datos.position || !datos.level) {
          alert("Please, fullfill all the fields.");
          return;
      }

      let repeatPassword = document.getElementById('txtConfirmPassword').value;

      if(repeatPassword != datos.password){
         alert("The passwords you wrote doesn´t match");
         return;
      }

      const request = await fetch('users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)

      });

      getIntoProfile(datos);
}

function validateEmail(email) {
    const pattern = /.+@(gmail\.com|yahoo\.es|hotmail\.es)$/;
    return pattern.test(email);
}

async function getIntoProfile(datos){

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
              alert("Your account has been created succesfully");
              window.location.href = `userProfile.html?id=${userId}`;
          } else {
              alert("Your credentials are incorrect. Please try again");
              document.location.reload();
          }


}

