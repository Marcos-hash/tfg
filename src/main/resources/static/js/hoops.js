document.addEventListener("DOMContentLoaded", function () {
    // Espera a que la página se cargue completamente

    // Llamamos a la función para obtener la lista de usuarios
    getHoopsList();
});

// Función para obtener la lista de usuarios
async function getHoopsList() {

      const request = await fetch('hoops', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

      });
      const hoops = await request.json();


      let hoopsHTML = '';

      for(hoop of hoops){

        let deleteButton = '<a href="#" onclick="deleteHoop('+hoop.id+')" class="btn btn-danger btn-circle btn-sm"><i class="fas fa-trash"></i></a>'


        hoopHTML = '<tr><td>'+hoop.id+'</td><td>'
                    +hoop.name+'</td><td>'+hoop.location+'</td><td>'
                    +hoop.state+'</td><td>'+deleteButton+
                    '</td></tr>'

        hoopsHTML += hoopHTML;

      }

      document.querySelector('#hoops-table tbody').outerHTML = hoopsHTML;
}

async function deleteHoop(id){

    if(!confirm("Do you really want to delete this hoop??")){
        return;
    }

    const request = await fetch('hoop/'+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });

    document.location.reload()
}
