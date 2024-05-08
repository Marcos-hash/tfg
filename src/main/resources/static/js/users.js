document.addEventListener("DOMContentLoaded", function () {
    // Espera a que la página se cargue completamente

    // Llamamos a la función para obtener la lista de usuarios
    getUsersList();
});

// Función para obtener la lista de usuarios
async function getUsersList() {

      const request = await fetch('users', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

      });
      const users = await request.json();


      let usersHTML = '';

      for(user of users){

        let deleteButton = '<a href="#" onclick="deleteUser('+user.id+')" class="btn btn-danger btn-circle btn-sm"><i class="fas fa-trash"></i></a>'


        userHTML = '<tr><td>'+user.id+'</td><td>'
                    +user.nickname+'</td><td>'+user.age+'</td><td>'
                    +user.email+'</td><td>'+user.password+
                    '</td><td>'+user.position+
                    '</td><td>'+user.level+
                    '</td><td>'+user.physical+
                    '</td><td>'+deleteButton+
                    '</td></tr>'

        usersHTML += userHTML;
      }

      document.querySelector('#users-table tbody').outerHTML = usersHTML;
}

async function deleteUser(id){

    if(!confirm("Do you really want to delete this user??")){
        return;
    }

    const request = await fetch('user/'+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });

    document.location.reload()
}
