document.addEventListener("DOMContentLoaded", function() {

    let hoopId;
    loadMatches();

    // Configurar la navegación
    setupNavigation();
});

async function loadMatches() {

    //hacer un get a la base de todos los matches
    const request = await fetch('/matches', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const matches = await request.json();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const request2 = await fetch('user/'+id, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const user = await request2.json();

    const createMatchContainer = document.getElementsByClassName('createMatch')[0];
    createMatchContainer.style.display = 'none';

    const selectHoopDiv = document.getElementsByClassName('selectHoopList')[0];
    selectHoopDiv.style.display = 'none';


    //llamar a una funcion que los desarme 1 a 1
    showAllMatches(matches, user);
}

async function createMatch(hoopId){

    const createMatchContainer = document.getElementsByClassName('createMatch')[0];
    createMatchContainer.style.display = 'block';
    const matchesContainer = document.getElementsByClassName('matches-container')[0];
    matchesContainer.style.display = 'none';


    // Agregar evento para cerrar el modal cuando se haga clic en el botón "Cancelar"
    const closeButton = createMatchContainer.querySelector('.createMatch-close-button');
    closeButton.addEventListener('click', () => {
        closeCreateMatchContainer();
    });

    // Agregar evento para enviar el formulario de edición
    const confirmMatchButton = document.getElementsByClassName('confirmMatch-button')[0];
    confirmMatchButton.addEventListener('click', () => {
        confirmMatch(hoopId);
    });
}

async function filterMatches(){

    //hacer un get a la base de todos los matches
    const request = await fetch('/matches', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const matches = await request.json();

    // Mostrar el div de filters
    const matchesContainer = document.getElementsByClassName("matches-container")[0];
    const createMatch = document.getElementsByClassName("createMatch")[0];
    const selectHoopList = document.getElementsByClassName("selectHoopList")[0];
    const filterMatchesContainer = document.getElementsByClassName("filterMatchesContainer")[0];

    filterMatchesContainer.style.display = 'block';
    matchesContainer.style.display = 'none';
    selectHoopList.style.display = 'none';
    createMatch.style.display = 'none';

    // Agregar evento para cerrar el modal cuando se haga clic en el botón "Cancelar"
    const closeButton = filterMatchesContainer.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        closefilterMatchesContainer();
    });

    // Agregar evento para enviar el formulario de edición
    const applyFiltersButton = filterMatchesContainer.querySelector('.filters-button');
    applyFiltersButton.addEventListener('click', () => {
        applyFilters(matches);
    });
}

async function applyFilters(matches){

    //rescato el user par apoder llamar a la funcion showmatches después
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const request2 = await fetch('user/'+id, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const user = await request2.json();

    //guardo los filtros introducidos en variables
    const name = document.getElementById('filterMatchesName').value;
    const date = document.getElementById('filterMatchesDate').value;
    const format = document.getElementById('filterMatchesFormat').value;

    // Contador para contar cuántos campos están llenos
    let filledFieldsCount = 0;

    // Verificar si el campo de nombre está lleno
    if(name !== "") {
        filledFieldsCount++;
    }

    // Verificar si el campo de fecha está lleno
    if(date !== "") {
        filledFieldsCount++;
    }

    // Verificar si el campo de formato está lleno
    if(format !== "") {
        filledFieldsCount++;
    }

    // Verificar si más de un campo está lleno
    if(filledFieldsCount > 1) {
        alert('Please fill only one filter field at a time.');
        return;
    }

    if(name!==""){
        filterByName(matches, user, name);
    }
    else if(date!==""){
        filterByDate(matches, user, date);
    }
    else if(format!==""){
        filterByFormat(matches, user, format);
    }
    else{
        closefilterMatchesContainer();
        showAllMatches(matches, user);
    }
}

async function filterByName(matches, user, name){

    //hacer un get a la base de todos los matches
    const request = await fetch('/matches/name/'+name, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const matches_f_name = await request.json();
    if (request.ok) {
        alert('filters made successfully.');
        closefilterMatchesContainer();
        const removeFilter = document.getElementsByClassName("removeFilter-button")[0];
        const filterSearch = document.getElementsByClassName("filters-button")[0];
        removeFilter.style.display = 'block';
        filterSearch.style.display = 'none';
        removeFilter.addEventListener('click', () => {
            removeFilter.style.display = 'none';
            filterSearch.style.display = 'block';
            showAllMatches(matches, user);
            document.location.reload();
        });
        showAllMatches(matches_f_name, user);
    } else {
        // Manejar el error
        alert('Failed to apply filters.');
    }
}

async function filterByDate(matches, user, date){

    const encodedDate = encodeURIComponent(date);
    const url = `/matches/date/${encodedDate}`;


    const request = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    const matches_f_date = await request.json();

    if (request.ok) {
        alert('filters made successfully.');
        closefilterMatchesContainer();
        const removeFilter = document.getElementsByClassName("removeFilter-button")[0];
        const filterSearch = document.getElementsByClassName("filters-button")[0];
        removeFilter.style.display = 'block';
        filterSearch.style.display = 'none';
        removeFilter.addEventListener('click', () => {
            removeFilter.style.display = 'none';
            filterSearch.style.display = 'block';
            showAllMatches(matches, user);
            document.location.reload();
        });
        showAllMatches(matches_f_date, user);
    } else {
        // Manejar el error
        alert('Failed to apply filters.');
    }
}

async function filterByFormat(matches, user, format){

    //hacer un get a la base de todos los matches
    const request = await fetch('/matches/format/'+format, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const matches_f_format = await request.json();
    if (request.ok) {
        alert('filters made successfully.');
        closefilterMatchesContainer();
        const removeFilter = document.getElementsByClassName("removeFilter-button")[0];
        const filterSearch = document.getElementsByClassName("filters-button")[0];
        removeFilter.style.display = 'block';
        filterSearch.style.display = 'none';
        removeFilter.addEventListener('click', () => {
            removeFilter.style.display = 'none';
            filterSearch.style.display = 'block';
            showAllMatches(matches, user);
            document.location.reload();
        });
        showAllMatches(matches_f_format, user);
    } else {
        // Manejar el error
        alert('Failed to apply filters.');
    }

}

async function closefilterMatchesContainer(){

    // Mostrar la pagina
    const matchesContainer = document.getElementsByClassName("matches-container")[0];
    const createMatch = document.getElementsByClassName("createMatch")[0];
    const selectHoopList = document.getElementsByClassName("selectHoopList")[0];
    const filterMatchesContainer = document.getElementsByClassName("filterMatchesContainer")[0];

    filterMatchesContainer.style.display = 'none';
    matchesContainer.style.display = 'block';
    selectHoopList.style.display = 'none';
    createMatch.style.display = 'none';
}

async function confirmMatch(hoopId){

    let datos = {};
    datos.name = document.getElementById('createMatchName').value;
    datos.description = document.getElementById('createMatchDescription').value;
    datos.date = document.getElementById('createMatchDate').value;
    datos.hour = document.getElementById('createMatchHour').value;
    datos.format = document.getElementById('createMatchFormat').value;
    datos.hoopid = hoopId;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    datos.organizerid = id;

    // Assuming 'datos' is an object that contains the 'format' property
    switch (datos.format) {
      case '2vs2':
        datos.nplayers = 4;
        break;
      case '3vs3':
        datos.nplayers = 6;
        break;
      case '4vs4':
        datos.nplayers = 8;
        break;
      case '5vs5':
        datos.nplayers = 10;
        break;
      default:
        console.log('Invalid format');
    }

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

    meterMatch(datos);
}


async function meterMatch(datos){
    const request = await fetch('/match', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        });
        if (request.ok) {
            alert('Match created successfully.');
            document.location.reload();
        } else {
            alert("Before confim, you must select any hoop.");
            return;
        }
}

async function selectHoop(){

    //esteticamente que se vea solo el bloque de canastas
    const createMatchContainer = document.getElementsByClassName('createMatch')[0];
    createMatchContainer.style.display = 'none';

    const selectHoopList = document.getElementsByClassName('selectHoopList')[0];
    selectHoopList.style.display = 'block';

    //recuperamos la info de las canastas favoritas
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

    const request2 = await fetch('/user/'+userId+'/favourites', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const hoops = await request2.json();

    const title = document.createElement('h1');
    title.textContent = `Select one of your Favourite Hoops`;

    selectHoopList.appendChild(title);

    //enseñamos el contenido recogido en la base de datos
    hoops.forEach(async (hoop) => {

        const hoopDiv = document.createElement('div');
        hoopDiv.className = 'select-hoop-item';

        const name = document.createElement('p');
        name.textContent = `Name: ${hoop.name}`;

        const location = document.createElement('p');
        location.textContent = `Location: ${hoop.location}`;

        const selectButton = document.createElement('button');
        selectButton.className = 'select-hoop-button';
        selectButton.textContent = `Select`;

        // Añade un manejador de eventos de clic al botón
        selectButton.addEventListener('click', () => {
            //volver a mostrar el container de antes
            const selectedHoop = document.getElementsByClassName('selectedHoopDiv')[0];
            selectedHoop.style.display = 'block';

            const createMatchContainer = document.getElementsByClassName('createMatch')[0];
            createMatchContainer.style.display = 'block';

            const selectHoopDiv = document.getElementsByClassName('selectHoopList')[0];
            selectHoopDiv.style.display = 'none';

            const hoopButtonCreateMatchContainer = document.getElementsByClassName('selectHoop-button')[0];
            hoopButtonCreateMatchContainer.style.display = 'none';

            //y actualizado con el hoop
            const selectedHoopDiv = document.getElementsByClassName('selectedHoopDiv')[0];
            // Agrega contenido al div del partido
            selectedHoopDiv.innerHTML = `
                <p class="hoopSelected-name">${hoop.name}</p>
                <p class="hoopSelected-location">${hoop.location}</p>
            `;
            createMatch(hoop.id);
        });

        hoopDiv.appendChild(name);
        hoopDiv.appendChild(location);
        hoopDiv.appendChild(selectButton);
        selectHoopList.appendChild(hoopDiv);

    });
}

async function closeCreateMatchContainer(){

    const createMatchContainer = document.getElementsByClassName('createMatch')[0];
    createMatchContainer.style.display = 'none';
    const matchesContainer = document.getElementsByClassName('matches-container')[0];
    matchesContainer.style.display = 'block';

}

async function showAllMatches(matches, user) {

    let hoopId;

    // Agregar evento para enviar el formulario de edición
    const createMatchButton = document.getElementsByClassName('create-match-button')[0];
    createMatchButton.addEventListener('click', () => {
        createMatch(hoopId);
    });

    const matchesList = document.getElementById('matchesList');
    // Limpia la lista de partidos anterior
    matchesList.innerHTML = '';

    const matchesFinishedList = document.getElementById('matchesFinishedList');
    // Limpia la lista de partidos anterior
    matchesFinishedList.innerHTML = '';

    if (matches.length === 0) {
        // Crea el div para el partido
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';
        // Agrega contenido al div del partido
        matchDiv.innerHTML = `
            <p >There are no matches</p>
        `;
        // Añade el div del partido al contenedor principal
        matchesList.appendChild(matchDiv);
        matchesFinishedList.appendChild(matchDiv);
    }

    // Recorre todos los partidos y crea un div para cada uno
    matches.forEach(async (match) => {

        if(!match.finished){
            //Recuperamos el objeto Hoop
            const request = await fetch('hoop/'+match.hoopid, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },

            });
            const hoop = await request.json();

            const formattedDate = await addADay(match.date);
            //const formattedHour = await formatTimeString(match.hour);

            // Crea el div para el partido
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';

            // Agrega contenido al div del partido
            matchDiv.innerHTML = `
                <p class="match-name">Name: ${match.name}</p>
                <p class="match-location">Location: ${hoop.location}</p>
                <p class="match-date">Date: ${formattedDate}</p>
                <p class="match-hour">Hour: ${match.hour}</p>
                <p class="match-format">Type: ${match.format}</p>
                <button class="match-button">View Details</button>
            `;

            // Encuentra el botón dentro de matchDiv
            const viewDetailsButton = matchDiv.querySelector('.match-button');

            // Añade un manejador de eventos de clic al botón
            viewDetailsButton.addEventListener('click', () => {
                // Redirige a matchDetail.html con el ID del partido en la URL
                window.location.href = `matchDetail.html?id=${user.id}&hoopId=${match.hoopid}&matchId=${match.id}`;
            });

            // Añade el div del partido al contenedor principal
            matchesList.appendChild(matchDiv);
        }
        else{
            //Recuperamos el objeto Hoop
            const request = await fetch('hoop/'+match.hoopid, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },

            });
            const hoop = await request.json();

            const formattedDate = await addADay(match.date);
            //const formattedHour = await formatTimeString(match.hour);

            // Crea el div para el partido
            const matchFinishedDiv = document.createElement('div');
            matchFinishedDiv.className = 'matchFinished';


            // Agrega contenido al div del partido
            matchFinishedDiv.innerHTML = `
                <p class="match-name">Name: ${match.name}</p>
                <p class="match-location">Location: ${hoop.location}</p>
                <p class="match-date">Date: ${formattedDate}</p>
                <p class="match-hour">Hour: ${match.hour}</p>
                <p class="match-format">Type: ${match.format}</p>
                <button class="match-comment-button">View Details</button>
            `;

            // Encuentra el botón dentro de matchDiv
            const sendCommentButton = matchFinishedDiv.querySelector('.match-comment-button');

            // Añade un manejador de eventos de clic al botón
            sendCommentButton.addEventListener('click', () => {
                // Redirige a matchDetail.html con el ID del partido en la URL
                window.location.href = `matchDetail.html?id=${user.id}&hoopId=${match.hoopid}&matchId=${match.id}`;
            });

            // Añade el div del partido al contenedor principal
            matchesFinishedList.appendChild(matchFinishedDiv);
        }
    });
}

async function formatDateString(isoString) {
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
}

async function formatTimeString(isoString) {
    const date = new Date(isoString);
    return date.toISOString().split('T')[1].split('.')[0].slice(0, 5);
}

async function addADay(fecha){

    // Convertir la cadena de fecha a un objeto Date
    let fechaOriginal = new Date(fecha);

    // Obtener el día y sumarle 1
    let nuevoDia = fechaOriginal.getDate() + 1;

    // Establecer el nuevo día en la fecha original
    fechaOriginal.setDate(nuevoDia);

    // Formatear la nueva fecha como cadena (opcional)
    let nuevaFechaComoCadena = fechaOriginal.toISOString().split('T')[0];

    return nuevaFechaComoCadena;
}



async function setupNavigation() {

    const matchesLink = document.getElementById('matchesLink');
    const hoopsLink = document.getElementById('hoopsLink');
    const profileLink = document.getElementById('profileLink');

    // Obtén el ID del usuario desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    const request3 = await fetch('user/'+userId, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const user = await request3.json();

    const nickNameElement = document.getElementById('profileName');
    nickNameElement.textContent = `${user.nickname}`;

    // Actualiza los enlaces con el ID del usuario
    if (userId) {
        matchesLink.href = `matches.html?id=${userId}`;
        hoopsLink.href = `hoopsMap.html?id=${userId}`;
        profileLink.href = `userProfile.html?id=${userId}`;
    }
}
