document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    const hoopId = urlParams.get('hoopId');
    getHoop(hoopId);

    // Configurar la navegación
        setupNavigation(userId);

});

//funcion para conseguir el objeto usuario a partir de su
//nickname y password, con lo que podremos cargar su perfil
//a través de la llamada a renderUserInfo(user)
async function getHoop(id){

    // Realizar una solicitud al servidor para obtener la información del usuario
    const request = await fetch('hoop/'+id, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const hoop = await request.json();

    renderHoopInfo(hoop, id);

}

async function renderHoopInfo(hoop, hoopId) {


    const hoopImage = document.createElement('img');
    hoopImage.src = 'images/'+hoopId+'.jpg'; // Ruta a la imagen
    hoopImage.alt = 'Descripción de la imagen'; // Texto alternativo para la imagen
    hoopImage.style.width = '100%';
    hoopImage.style.height = '200px';
    hoopImage.className = 'imgHoopDetail';

    // Insertar la imagen en la parte superior del cuerpo del documento
    document.body.insertBefore(hoopImage, document.body.firstChild);

    const hoopInfoContainer = document.getElementsByClassName('hoop-container')[0];

    //los button
    const addToFavButton = document.createElement("button");
    addToFavButton.id = "addToFavButton";
    addToFavButton.textContent = "Add to Favourites";
    addToFavButton.className = "add-to-fav-button";
    addToFavButton.addEventListener('click', () => addToFav(hoopId));

    // Crea un contenedor para los botones
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "hoopDetail-button";

    // Agrega los botones al contenedor de botones
    buttonsContainer.appendChild(addToFavButton);

    const HoopData = document.createElement("div");
    HoopData.className = "HoopData-container";

    // Crear elementos HTML para mostrar la información del usuario
    const nameElement = document.createElement('p');
    nameElement.textContent = `Name: ${hoop.name}`;

    const locationElement = document.createElement('p');
    locationElement.textContent = `Location: ${hoop.location}`;

    const hoopLightElement = document.createElement('p');
    hoopLightElement.textContent = `Light: ${hoop.light}`;

    const stateElement = document.createElement('p');
    stateElement.textContent = `State: ${hoop.state}`;




    // Agregar elementos al contenedor
    hoopInfoContainer.appendChild(hoopImage);
    hoopInfoContainer.appendChild(buttonsContainer);
    HoopData.appendChild(hoopLightElement);
    HoopData.appendChild(nameElement);
    HoopData.appendChild(locationElement);
    HoopData.appendChild(stateElement);
    hoopInfoContainer.appendChild(HoopData);



     // Actualizar el título del HTML con el nombre de la cancha
     document.querySelector('title').textContent = `Hoop ${hoop.name}`;
     document.querySelector('h1').textContent = `This is ${hoop.name}`;


     //meto el user panel titles
     const hoopDetailPanel = document.getElementsByClassName('hoop-detail-panel')[0];
     const matchesButton = document.getElementById('MatchesMenu');
     const commentsButton = document.getElementById('CommentsMenu');

     const hoopDetailMatches = document.getElementsByClassName('hoopDetailMatches')[0];
     const hoopDetailComments = document.getElementsByClassName('hoopDetailComments')[0];

     matchesButton.addEventListener('click', () => {
         hoopDetailMatches.style.display = 'block';
         hoopDetailComments.style.display = 'none';
         matchesButton.classList.add('active');
         commentsButton.classList.remove('active');
     });

     commentsButton.addEventListener('click', () => {
         hoopDetailComments.style.display = 'block';
         hoopDetailMatches.style.display = 'none';
         commentsButton.classList.add('active');
         matchesButton.classList.remove('active');
     });

     // Inicializar el estado por defecto
     hoopDetailMatches.style.display = 'block';
     hoopDetailComments.style.display = 'none';
     matchesButton.classList.add('active');
     commentsButton.classList.remove('active');

     //if there are no matches

     //hoopDetailComments.textContent = `There are no Comments`;

     hoopDetailPanel.appendChild(matchesButton);
     hoopDetailPanel.appendChild(commentsButton);
     document.body.appendChild(hoopInfoContainer);
     document.body.appendChild(hoopDetailPanel);

     document.body.appendChild(hoopDetailMatches);
     document.body.appendChild(hoopDetailComments);

     getHoopMatches(hoopId);
     getHoopComments(hoopId);
}

async function getHoopMatches(hoopId){

    try {
        const response = await fetch('/hoop/'+hoopId+'/matches', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        });

        if (response.ok) {

            const hoopMatches = await response.json();
            showHoopMatches(hoopMatches);
        } else {
            // Manejar situaciones donde no se puedan obtener las canchas favoritas
            console.error("Couldn´t find out the matches from this hoop.");
        }
    } catch (error) {
        console.error("Error at obteining the matches from this hoop:", error);
    }

}

async function showHoopMatches(hoopMatches){

    const hoopMatchesContainer = document.getElementsByClassName('hoopDetailMatches')[0];
    hoopMatchesContainer.innerHTML = ''; // Limpiar el contenido anterior

    if (hoopMatches.length === 0) {
        hoopMatchesContainer.textContent = 'There are no Matches';
    } else {
        for (const match of hoopMatches) {
            if(!match.finished){
                const matchDiv = document.createElement('div');
                matchDiv.className = 'match-item';

                const img = document.createElement('img');
                img.src = 'images/fondoMatches2.png';
                img.alt = 'Imagen de match';
                img.className = 'match-image';

                const name = document.createElement('p');
                name.textContent = `Name: ${match.name}`;

                const date = document.createElement('p');
                const formattedDate = await formatDateString(match.date);
                //const formattedHour = await formatTimeString(match.hour);
                date.textContent = `Date: ${formattedDate} | ${match.hour}`;

                const format = document.createElement('p');
                format.textContent = `Format: ${match.format}`;

                const verMatchDetailButton = document.createElement('button');
                verMatchDetailButton.className = 'verMatchDetailButton';
                verMatchDetailButton.textContent = `See Details`;

                verMatchDetailButton.addEventListener('click', () => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const userId = urlParams.get('id');
                    window.location.href = `matchDetail.html?id=${userId}&hoopId=${match.hoopid}&matchId=${match.id}`;
                });

                matchDiv.appendChild(img);
                matchDiv.appendChild(name);
                matchDiv.appendChild(date);
                matchDiv.appendChild(format);
                matchDiv.appendChild(verMatchDetailButton);

                hoopMatchesContainer.appendChild(matchDiv);
            }
            else{
                const matchFinishedDiv = document.createElement('div');
                matchFinishedDiv.className = 'match-finished-item';

                const imgFinished = document.createElement('img');
                imgFinished.src = 'images/fondoMatches.png';
                imgFinished.alt = 'Imagen de match finished';
                imgFinished.className = 'match-finished-image';

                const nameFinished = document.createElement('p');
                nameFinished.textContent = `Name: ${match.name}`;

                const dateFinished = document.createElement('p');
                const formattedDate = await formatDateString(match.date);
                //const formattedHour = await formatTimeString(match.hour);
                dateFinished.textContent = `Date: ${formattedDate} | ${match.hour}`;

                const formatFinished = document.createElement('p');
                formatFinished.textContent = `Format: ${match.format}`;

                const verMatchDetailButton = document.createElement('button');
                verMatchDetailButton.className = 'verMatchDetailButton';
                verMatchDetailButton.textContent = `See Details`;

                verMatchDetailButton.addEventListener('click', () => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const userId = urlParams.get('id');
                    window.location.href = `matchDetail.html?id=${userId}&hoopId=${match.hoopid}&matchId=${match.id}`;
                });

                matchFinishedDiv.appendChild(imgFinished);
                matchFinishedDiv.appendChild(nameFinished);
                matchFinishedDiv.appendChild(dateFinished);
                matchFinishedDiv.appendChild(formatFinished);
                matchFinishedDiv.appendChild(verMatchDetailButton);

                hoopMatchesContainer.appendChild(matchFinishedDiv);
            }

        }
    }

}

async function getHoopComments(hoopId){

    try {
        const response = await fetch('/hoop/'+hoopId+'/comments', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const hoopComments = await response.json();
            showHoopComments(hoopComments);
        } else {
            // Manejar situaciones donde no se puedan obtener las canchas favoritas
            console.error("Couldn´t find out the comments from this hoop.");
        }
    } catch (error) {
        console.error("Error at obtaining the comments from this hoop:", error);
    }
}

async function showHoopComments(hoopComments){

    const hoopCommentsContainer = document.getElementsByClassName('hoopDetailComments')[0];
    hoopCommentsContainer.innerHTML = ''; // Limpiar el contenido anterior

    if (hoopComments.length === 0) {
        hoopCommentsContainer.textContent = 'There are no Comments';
    } else {
        for (const comment of hoopComments) {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-item';

            const img = document.createElement('img');
            img.src = 'images/fondoMatches.png';
            img.alt = 'Imagen de match';
            img.className = 'comment-image';

            let request3 = await fetch('user/'+comment.sender, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },

            });
            let user = await request3.json();

            const from = document.createElement('p');
            from.textContent = `From: ${user.nickname}`;

            const msg = document.createElement('p');
            msg.textContent = `Comment: ${comment.msg}`;

            commentDiv.appendChild(img);
            commentDiv.appendChild(from);
            commentDiv.appendChild(msg);

            hoopCommentsContainer.appendChild(commentDiv);
        }
    }

}

async function formatTimeString(isoString) {
    const date = new Date(isoString);
    return date.toISOString().split('T')[1].split('.')[0].slice(0, 5);
}

async function formatDateString(isoString) {
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
}


async function addToFav(hoopId) {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    const request = await fetch('user/'+userId+'/favourites/'+hoopId, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId, hoop_id: hoopId })
    });

    if (request.ok) {
        alert("Hoop added to favourites successfully.");
        return;
    } else {
        alert("Error adding hoop to favourites.");
        return;
    }
}


async function setupNavigation(userId) {
    const matchesLink = document.getElementById('matchesLink');
    const hoopsLink = document.getElementById('hoopsLink');
    const profileLink = document.getElementById('profileLink');

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

    if (userId) {
        matchesLink.href = `matches.html?id=${userId}`;
        hoopsLink.href = `hoopsMap.html?id=${userId}`;
        profileLink.href = `userProfile.html?id=${userId}`;
    }
}



