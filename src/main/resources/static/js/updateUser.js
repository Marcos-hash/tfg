/*
document.addEventListener("DOMContentLoaded", function () {
    // Espera a que la página se cargue completamente

    editProfile();
    setupNavigation();


});

async function setupNavigation() {

    const matchesLink = document.getElementById('matchesLink');
    const hoopsLink = document.getElementById('hoopsLink');
    const profileLink = document.getElementById('profileLink');

    // Obtén el ID del usuario desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    // Actualiza los enlaces con el ID del usuario
    if (userId) {
        matchesLink.href = `matches.html?id=${userId}`;
        hoopsLink.href = `hoopsMap.html?id=${userId}`;
        profileLink.href = `userProfile.html?id=${userId}`;
    }
}


async function editProfile(){

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    const request = await fetch('user/'+userId, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },

    });

    const user = await request.json();

    document.getElementById('modalNickname').value = user.nickname;
    document.getElementById('modalAge').value = user.age;
    document.getElementById('modalEmail').value = user.email;
    document.getElementById('modalPassword').value = user.password;
    document.getElementById('modalPhysical').value = user.physical;
    document.getElementById('modalPosition').value = user.position;
    document.getElementById('modalLevel').value = user.level;


     //Obtener el modal de edición de perfil
    //const editProfileModal = document.getElementById('editProfileModal');

    // Mostrar el modal
    //editProfileModal.style.display = 'block';



    // Agregar evento para cerrar el modal cuando se haga clic en el botón "Cancelar"
    const closeButton = editProfileModal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        closeEditProfileModal();
    });

    // Agregar evento para enviar el formulario de edición
    const saveButton = editProfileModal.querySelector('.save-button');
    saveButton.addEventListener('click', () => {
        updateData(user);
    });
}

async function updateData(user){

    let datos = {};
    datos.id = user.id;
      datos.nickname = document.getElementById('modalNickname').value;
      datos.age = document.getElementById('modalAge').value;
      datos.email = document.getElementById('modalEmail').value;
      datos.password = document.getElementById('modalPassword').value;

      datos.physical = document.getElementById('modalPhysical').value;

      datos.position = document.getElementById('modalPosition').value;

      datos.level = document.getElementById('modalLevel').value;


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

    const request = await fetch('update', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)

      });


    if (request.ok) {
        alert('Changes saved successfully.');
        //closeEditProfileModal();
    } else {
        // Manejar el error
        alert('Failed to save changes.');
    }
}

// Función para cerrar la ventana emergente de edición de perfil
async function closeEditProfileModal() {
    const editProfileModal = document.getElementById('editProfileModal');
    editProfileModal.style.display = 'none';
}*/