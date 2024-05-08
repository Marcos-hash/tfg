document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    getUser(id);

    // Configurar la navegación
        setupNavigation();

});

//funcion para conseguir el objeto usuario a partir de su
//nickname y password, con lo que podremos cargar su perfil
//a través de la llamada a renderUserInfo(user)
async function getUser(id){

    // Realizar una solicitud al servidor para obtener la información del usuario
        const request = await fetch('user/'+id, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },

        });
        const user = await request.json();

        renderUserInfo(user);

}

async function renderUserInfo(user) {

    const userInfoContainer = document.getElementsByClassName('user-data')[0];


    const nickNameElement = document.getElementById('profileName');

    // Crear elementos HTML para mostrar la información del usuario

    const nicknameElement = document.getElementById('nickname');
    const ageElement = document.getElementById('age');
    const emailElement = document.getElementById('email');
    const physicalElement = document.getElementById('physical');
    const positionElement = document.getElementById('position');
    const levelElement = document.getElementById('level');
    const editProfileButton = document.getElementById('editProfileButton');

    nickNameElement.textContent = `${user.nickname}`;

    //userIdElement.textContent = `ID: ${user.id}`;
    nicknameElement.textContent = `Nickname: ${user.nickname}`;

    nicknameElement.style.color = 'white';
    nicknameElement.style.borderRadius = '10px';
    nicknameElement.style.textAlign = 'center';
    ageElement.textContent = `Age: ${user.age}`;

    ageElement.style.color = 'white';
    ageElement.style.borderRadius = '10px';
    ageElement.style.textAlign = 'center';
    emailElement.textContent = `Email: ${user.email}`;

    emailElement.style.color = 'white';
    emailElement.style.borderRadius = '10px';
    emailElement.style.textAlign = 'center';
    physicalElement.textContent = `Physical: ${user.physical}`;

    physicalElement.style.color = 'white';
    physicalElement.style.borderRadius = '10px';
    physicalElement.style.textAlign = 'center';
    positionElement.textContent = `Position: ${user.position}`;

    positionElement.style.color = 'white';
    positionElement.style.borderRadius = '10px';
    positionElement.style.textAlign = 'center';
    levelElement.textContent = `Level: ${user.level}`;

    levelElement.style.color = 'white';
    levelElement.style.borderRadius = '10px';
    levelElement.style.textAlign = 'center';


    // Agregar elementos al contenedor

    //userInfoContainer.appendChild(userIdElement);
    userInfoContainer.appendChild(nicknameElement);
    userInfoContainer.appendChild(ageElement);
    userInfoContainer.appendChild(emailElement);
    userInfoContainer.appendChild(physicalElement);
    userInfoContainer.appendChild(positionElement);
    userInfoContainer.appendChild(levelElement);
    document.body.appendChild(userInfoContainer);
    document.body.appendChild(editProfileButton);


    //meto el user panel titles
    const userPanel = document.getElementsByClassName('profile-panel')[0];

    /*Vamos a meter ahora el div del contenido*/
    const matchesButton = document.getElementById('MatchesMenu');
    const hoopsButton = document.getElementById('HoopsMenu');
    const commentsButton = document.getElementById('CommentsMenu');

    const userMatches = document.getElementsByClassName('userMatches')[0];
    const userHoops = document.getElementsByClassName('userHoops')[0];
    const userComments = document.getElementsByClassName('userComments')[0];
    matchesButton.addEventListener('click', () => {
        userMatches.style.display = 'block';
        userHoops.style.display = 'none';
        userComments.style.display = 'none';
        matchesButton.classList.add('active');
        hoopsButton.classList.remove('active');
        commentsButton.classList.remove('active');
    });

    hoopsButton.addEventListener('click', () => {
        userHoops.style.display = 'block';
        userMatches.style.display = 'none';
        userComments.style.display = 'none';
        hoopsButton.classList.add('active');
        matchesButton.classList.remove('active');
        commentsButton.classList.remove('active');
    });

    commentsButton.addEventListener('click', () => {
        userComments.style.display = 'block';
        userHoops.style.display = 'none';
        userMatches.style.display = 'none';
        hoopsButton.classList.remove('active');
        matchesButton.classList.remove('active');
        commentsButton.classList.add('active');
    });

    // Inicializar el estado por defecto
    userMatches.style.display = 'block';
    userHoops.style.display = 'none';
    userComments.style.display = 'none';
    matchesButton.classList.add('active');
    hoopsButton.classList.remove('active');
    commentsButton.classList.remove('active');

    userPanel.appendChild(matchesButton);
    userPanel.appendChild(hoopsButton);
    userPanel.appendChild(commentsButton);
    document.body.appendChild(userPanel);

    document.body.appendChild(userMatches);
    document.body.appendChild(userHoops);
    document.body.appendChild(userComments);
    // Llamar a la función para obtener las canchas favoritas del usuario
    getUserFavouritesHoops(user.id);
    getUserMatches(user.id);
    getUserComments(user.id);

}

async function getUserMatches(userId){
    try {
        const response = await fetch('/user/'+userId+'/matches', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const userMatches = await response.json();
            showUserMatches(userMatches);
        } else {
            console.error("Couldn´t obtain the matches from the player.");
        }
    } catch (error) {
        console.error("Error when obtaining the matches from the player:", error);
    }
}

async function getUserComments(userId){

    try {
        const response = await fetch('/user/'+userId+'/comments', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        });

        if (response.ok) {

            const userComments = await response.json();
            showUserComments(userComments);
        } else {
            // Manejar situaciones donde no se puedan obtener las canchas favoritas
            console.error("No se pudieron obtener los matches del jugador.");
        }
    } catch (error) {
        console.error("Error al obtener los matches del jugador:", error);
    }
}

async function showUserComments(userComments){

    const userCommentsContainer = document.getElementsByClassName('userComments')[0];
    userCommentsContainer.innerHTML = ''; // Limpiar el contenido anterior



    if (userComments.length === 0) {
        userCommentsContainer.textContent = 'There are no Comments';
    } else {
        for (const comment of userComments) {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment-item';

            const img = document.createElement('img');
            img.src = 'images/fondoMatches2.png';
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

            userCommentsContainer.appendChild(commentDiv);
        }
    }
}

async function formatDateString(isoString) {
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
}

async function formatTimeString(isoString) {
    const date = new Date(isoString);
    return date.toISOString().split('T')[1].split('.')[0].slice(0, 5);
}

async function showUserMatches(userMatches){

    const userMatchesContainer = document.getElementsByClassName('userMatches')[0];
    userMatchesContainer.innerHTML = ''; // Limpiar el contenido anterior

    if (userMatches.length === 0) {
        userMatchesContainer.textContent = 'There are no Matches';
    } else {
        for (const match of userMatches) {
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

                const removeButton = document.createElement('button');
                removeButton.className = 'remove-button';
                removeButton.textContent = `Sign out`;

                const verMatchDetailButton = document.createElement('button');
                verMatchDetailButton.className = 'verMatchDetailButton';
                verMatchDetailButton.textContent = `See Details`;

                removeButton.addEventListener('click', () => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const userId = urlParams.get('id');
                    signOutFromMatch(userId, match.id);
                });

                verMatchDetailButton.addEventListener('click', () => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const userId = urlParams.get('id');
                    window.location.href = `matchDetail.html?id=${userId}&hoopId=${match.hoopid}&matchId=${match.id}`;
                });

                matchDiv.appendChild(img);
                matchDiv.appendChild(name);
                matchDiv.appendChild(date);
                matchDiv.appendChild(format);
                matchDiv.appendChild(removeButton);
                matchDiv.appendChild(verMatchDetailButton);

                userMatchesContainer.appendChild(matchDiv);
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

                const sendCommentButton = document.createElement('button');
                sendCommentButton.className = 'sendCommentButton';
                sendCommentButton.textContent = `Send Comment`;

                sendCommentButton.addEventListener('click', () => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const userId = urlParams.get('id');
                    window.location.href = `matchDetail.html?id=${userId}&hoopId=${match.hoopid}&matchId=${match.id}`;
                });

                matchFinishedDiv.appendChild(imgFinished);
                matchFinishedDiv.appendChild(nameFinished);
                matchFinishedDiv.appendChild(dateFinished);
                matchFinishedDiv.appendChild(formatFinished);
                matchFinishedDiv.appendChild(sendCommentButton);

                userMatchesContainer.appendChild(matchFinishedDiv);
            }

        }
    }

}

async function signOutFromMatch(userId, matchId){

    try {
        const response = await fetch('user/'+userId+'/matches/'+matchId, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            getUserMatches(userId);
        } else {
            // Manejar situaciones donde no se puedan obtener las canchas favoritas
            console.error("No se pudieron obtener los matches.");
        }
    } catch (error) {
        console.error("Error al obtener los matches:", error);
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





async function getUserFavouritesHoops(userId) {
    try {
        const response = await fetch('user/'+userId+'/favourites', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        });

        if (response.ok) {

            const favouritesHoops = await response.json();
            renderUserFavouritesHoops(favouritesHoops);
        } else {
            // Manejar situaciones donde no se puedan obtener las canchas favoritas
            console.error("No se pudieron obtener las canchas favoritas.");
        }
    } catch (error) {
        console.error("Error al obtener las canchas favoritas:", error);
    }
}

function renderUserFavouritesHoops(hoops) {
    const userHoopsContainer = document.getElementsByClassName('userHoops')[0];
    userHoopsContainer.innerHTML = ''; // Limpiar el contenido anterior

    if (hoops.length === 0) {
        userHoopsContainer.textContent = 'There are no Hoops';
    } else {
        hoops.forEach(hoop => {
            const hoopDiv = document.createElement('div');
            hoopDiv.className = 'hoop-item';

            const img = document.createElement('img');
            img.src = 'images/fondoMatches2.png'; // Asegúrate de tener la ruta correcta
            img.alt = 'Imagen de ' + hoop.name;
            img.className = 'hoop-image';

            const name = document.createElement('p');
            name.textContent = `Name: ${hoop.name}`;

            const location = document.createElement('p');
            location.textContent = `Location: ${hoop.location}`;

            const removeButton = document.createElement('button');
            removeButton.className = 'remove-button';
            removeButton.textContent = `Remove`;

            const verHoopDetailButton = document.createElement('button');
            verHoopDetailButton.className = 'verHoopDetailButton';
            verHoopDetailButton.textContent = `See Details`;

            removeButton.addEventListener('click', () => {
                const urlParams = new URLSearchParams(window.location.search);
                const userId = urlParams.get('id');
                removeFavouriteHoop(userId, hoop.id);
            });

            verHoopDetailButton.addEventListener('click', () => {
                const urlParams = new URLSearchParams(window.location.search);
                const userId = urlParams.get('id');
                window.location.href = `hoopDetail.html?id=${userId}&hoopId=${hoop.id}`;
            });

            hoopDiv.appendChild(img);
            hoopDiv.appendChild(name);
            hoopDiv.appendChild(location);
            hoopDiv.appendChild(removeButton);
            hoopDiv.appendChild(verHoopDetailButton);

            userHoopsContainer.appendChild(hoopDiv);
        });
    }
}


async function removeFavouriteHoop(userId, hoopId) {

    try {
        const response = await fetch('user/'+userId+'/favourites/'+hoopId, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            getUserFavouritesHoops(userId);
        } else {
            // Manejar situaciones donde no se puedan obtener las canchas favoritas
            console.error("No se pudieron obtener las canchas favoritas.");
        }
    } catch (error) {
        console.error("Error al obtener las canchas favoritas:", error);
    }
}


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
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileButton = document.getElementById('editProfileButton');
    const profileContainer = document.getElementById('profileContainer');
    const userData = document.getElementById('userData');
    const profilePanel = document.getElementById('profilePanel');
    const userMatches = document.getElementById('userMatchesId');
    const userHoops = document.getElementById('userHoopsId');
    const userComments = document.getElementById('userCommentsId');

    // Mostrar el modal
    editProfileModal.style.display = 'block';
    editProfileButton.style.display = 'none';
    profileContainer.style.display = 'none';
    userData.style.display = 'none';
    profilePanel.style.display = 'none';
    userMatches.style.display = 'none';
    userHoops.style.display = 'none';
    userComments.style.display = 'none';




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
      let repeatPassword = document.getElementById('modalPassword').value;

      if(repeatPassword != datos.password){
        alert("The passwords you wrote doesn´t match");
        return;
      }

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
        closeEditProfileModal();
    } else {
        // Manejar el error
        alert('Failed to save changes.');
    }
}

// Función para cerrar la ventana emergente de edición de perfil
async function closeEditProfileModal() {
    const editProfileModal = document.getElementById('editProfileModal');
    editProfileModal.style.display = 'none';

    // Mostrar la pagina
    const profileContainer = document.getElementById('profileContainer');
    const editProfileButton = document.getElementById('editProfileButton');
    const userData = document.getElementById('userData');
    const profilePanel = document.getElementById('profilePanel');
    const userMatches = document.getElementById('userMatchesId');
    const userHoops = document.getElementById('userHoopsId');

    profileContainer.style.display = 'block';
    editProfileButton.style.display = 'block';
    userData.style.display = 'block';
    profilePanel.style.display = 'block';
    userMatches.style.display = 'block';
    userHoops.style.display = 'block';

    document.location.reload();
}



