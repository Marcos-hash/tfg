// Función que se ejecuta cuando la página se carga completamente
document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    // Llama a la función para inicializar el mapa
    inicializarMapa();
    // Configurar la navegación
    setupNavigation(id);
});

// Función para inicializar el mapa
async function inicializarMapa() {

    // Coordenadas para centrar el mapa en Madrid
    const coordenadasFlori = { lat: 40.4509429333574, lng: -3.655905977496229 };
    const coordenadasPacifico = { lat: 40.40038743779486, lng: -3.6764331639898753 };
    const coordenadasRedPark = { lat: 40.45821184547311, lng: -3.6536341516251634 };
    const coordenadasChamartin = { lat: 40.47593014121702, lng: -3.7063564768093347 };
    const coordenadasMoncloa = { lat: 40.45952797139409, lng: -3.71680674347486 };
    const coordenadasParqueOeste = { lat: 40.43400634355281, lng: -3.7139147823726235 };
    const coordenadasAcacias = { lat: 40.40482946324615, lng: -3.708318427040625 };
    const coordenadasLegazpi = { lat: 40.38620196785003, lng: -3.695329962506021 };

    const mapDiv = document.getElementById('mapa');

    const mapa = new google.maps.Map(mapDiv, {
        center: coordenadasFlori,
        zoom: 12,
        mapId: "6d990ded4d51739e"
    });


    const marcador = new google.maps.Marker({
        map: mapa, // 'mapa' es la variable que representa tu mapa
        position: coordenadasFlori,
        title: "El Flori",
        id: "1",
    });
    marcador.addListener("click", () => {
        mostrarInformacionCancha(marcador.id);
    });

    const marcador2 = new google.maps.Marker({
            map: mapa, // 'mapa' es la variable que representa tu mapa
            position: coordenadasPacifico,
            title: "Canchas Baloncesto Pacífico",
            id: "2",
        });
        marcador2.addListener("click", () => {
            mostrarInformacionCancha(marcador2.id);
        });

    const marcador3 = new google.maps.Marker({
                map: mapa, // 'mapa' es la variable que representa tu mapa
                position: coordenadasRedPark,
                title: "Parque Rojo",
                id: "3",
            });
            marcador3.addListener("click", () => {
                mostrarInformacionCancha(marcador3.id);
            });


    const marcador4 = new google.maps.Marker({
        map: mapa, // 'mapa' es la variable que representa tu mapa
        position: coordenadasChamartin,
        title: "Chamartin-Fuencarral",
        id: "4",
    });
    marcador4.addListener("click", () => {
        mostrarInformacionCancha(marcador4.id);
    });


    const marcador5 = new google.maps.Marker({
        map: mapa, // 'mapa' es la variable que representa tu mapa
        position: coordenadasMoncloa,
        title: "Moncloa",
        id: "5",
    });
    marcador5.addListener("click", () => {
        mostrarInformacionCancha(marcador5.id);
    });


    const marcador6 = new google.maps.Marker({
        map: mapa, // 'mapa' es la variable que representa tu mapa
        position: coordenadasParqueOeste,
        title: "Parque Oeste",
        id: "6",
    });
    marcador6.addListener("click", () => {
        mostrarInformacionCancha(marcador6.id);
    });

    const marcador7 = new google.maps.Marker({
        map: mapa, // 'mapa' es la variable que representa tu mapa
        position: coordenadasAcacias,
        title: "Acacias",
        id: "7",
    });
    marcador7.addListener("click", () => {
        mostrarInformacionCancha(marcador7.id);
    });


    const marcador8 = new google.maps.Marker({
        map: mapa, // 'mapa' es la variable que representa tu mapa
        position: coordenadasLegazpi,
        title: "Legazpi",
        id: "8",
    });
    marcador8.addListener("click", () => {
        mostrarInformacionCancha(marcador8.id);
    });

}


async function mostrarInformacionCancha(id) {

    // Obtén el ID del usuario desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');

    // Realizar una solicitud al servidor para obtener la información del hoop
        const request = await fetch('hoop/'+id, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },

        });
        const hoop = await request.json();

    // Construir la URL con ambos parámetros
       const url = `hoopDetail.html?id=${userId}&hoopId=${hoop.id}`;

    // Mostrar el contenedor de confirmación
    const emergente = document.getElementById('miConfirm');
    emergente.style.display = 'flex'; // Muestra el contenedor

    const contenido = document.getElementById('miConfirmContent');
    contenido.style.display = 'block'; // Muestra el contenido

    //vemos sus datos
    const confirmName = document.getElementById('hoopConfirmName');
    confirmName.textContent = `Name: ${hoop.name}`;

    const confirmUbicacion = document.getElementById('hoopConfirmUbicacion');
    confirmUbicacion.textContent = `Location: ${hoop.location}`;

    const confirmEstado = document.getElementById('hoopConfirmEstado');
    confirmEstado.textContent = `State: ${hoop.state}`;

    const confirmLuz = document.getElementById('hoopConfirmLuz');
    confirmLuz.textContent = `Light: ${hoop.light}`;

    const imagen = document.getElementById('id_hoop_background_image');
    imagen.src = "images/"+hoop.id+".jpg";
    imagen.alt = "fondo de pantalla personalizado";
    imagen.style.height = '30%';

    //vamos a meter la funcionalidad de los botones
    const yesButton = document.getElementById('confirmYes');
    const noButton = document.getElementById('confirmNo');

    yesButton.addEventListener('click', () => {
        window.location.href = url;
    });

    noButton.addEventListener('click', () => {
        emergente.style.display = 'none'; // Oculta el contenedor
        contenido.style.display = 'none'; // Oculta el contenido
        return;
    });

}

async function setupNavigation(userId) {

    const matchesLink = document.getElementById('matchesLink');
    const hoopsLink = document.getElementById('hoopsLink');
    const profileLink = document.getElementById('profileLink');

    // Realizar una solicitud al servidor para obtener la información del usuario
    const request = await fetch('user/'+userId, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const user = await request.json();

    const nickNameElement = document.getElementById('profileName');
    nickNameElement.textContent = `${user.nickname}`;

    // Actualiza los enlaces con el ID del usuario
    if (userId) {
        matchesLink.href = `matches.html?id=${userId}`;
        hoopsLink.href = `hoopsMap.html?id=${userId}`;
        profileLink.href = `userProfile.html?id=${userId}`;
    }

}

