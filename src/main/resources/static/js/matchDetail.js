document.addEventListener("DOMContentLoaded", function() {

    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('matchId');

    getMatch(matchId);
    // Configurar la navegación
    setupNavigation();
});

async function getMatch(matchId){

    const request = await fetch('/matches/'+matchId, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const match = await request.json();

    document.querySelector('title').textContent = `Match ${match.name}`;

    showDetails(match);
}

async function showDetails(match){

    const matchInfoContainer = document.getElementsByClassName('match-info')[0];

    const matchName = document.getElementById('match-detail-name');
    matchName.textContent = `${match.name}`;

    const hoopDiv = document.getElementsByClassName('hoop-info')[0];
    const request = await fetch('/hoop/'+match.hoopid, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const hoop = await request.json();
    // Agrega contenido al div del partido
    hoopDiv.innerHTML = `
        <p class="hoop-name">${hoop.name}</p>
        <p class="hoop-location">${hoop.location}</p>
        <button class="hoop-button">View Details</button>
    `;

    // Encuentra el botón dentro de matchDiv
    const viewDetailsButton = hoopDiv.querySelector('.hoop-button');

    // Añade un manejador de eventos de clic al botón
    viewDetailsButton.addEventListener('click', () => {
        // Redirige a matchDetail.html con el ID del partido en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        window.location.href = `hoopDetail.html?id=${userId}&hoopId=${match.hoopid}&matchId=${match.id}`;
    });

    // Formatea la fecha y hora
    const formattedDate = await formatDateString(match.date);
    //const formattedHour = await formatTimeString(match.hour);
    const matchTime = document.getElementById('match-date-time');
    matchTime.textContent = `${formattedDate} | ${match.hour}`;

    const matchOrganizer = document.getElementById('match-organizer');
    const request3 = await fetch('user/'+match.organizerid, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const user = await request3.json();
    matchOrganizer.textContent = `${user.nickname}`;


    const matchDescription = document.getElementById('match-description');
    matchDescription.textContent = `${match.description}`;

    //check if the match is finished
    if(match.finished){
        const signUp = document.getElementsByClassName('match-apuntarse-button')[0];
        signUp.style.display = 'none';
    }
    else{
        const signUp = document.getElementsByClassName('match-apuntarse-button')[0];
        signUp.addEventListener('click', () => signUpPlayer(match));
    }

    addOrganizerToMatch(match);
    //vamos a ir sacando uno a uno los users apuntados
    getUsersOfTheMatch(match);
}

async function addOrganizerToMatch(match){

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if(userId == match.organizerid){

        try {
            const request = await fetch('matches/'+match.id+'/signup/'+userId, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

            });

            if (request.ok) {
                return;
            } else {
                alert('Error signing up organizer.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    else{
        return;
    }
    document.location.reload()
}

async function getUsersOfTheMatch(match){

    try {
        const response = await fetch('match/'+match.id+'/users', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        });

        if (response.ok) {

            const playersOfTheMatch = await response.json();
            showPlayersOfTheMatch(playersOfTheMatch, match);
        } else {
            // Manejar situaciones donde no se puedan obtener las canchas favoritas
            console.error("No se pudieron obtener los players.");
        }
    } catch (error) {
        console.error("Error al obtener los players:", error);
    }
}

async function showPlayersOfTheMatch(playersOfTheMatch, match){

    const players_list = document.getElementsByClassName('players-list')[0];

    if (playersOfTheMatch.length === 0) {
        players_list.textContent = 'There are no Players signed up';
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        let putButtons = false;
        let putSendCommentButton = false;
        if(!match.finished){
            console.log("no está finalizado");
            if(userId == match.organizerid){
                putButtons = true;
            }
        }
        else{
            if(!match.commented){
                console.log("está marcado como no comentado");
                playersOfTheMatch.forEach(player => {
                    if(player.id == userId){
                        if(!player.commentuser){
                            putSendCommentButton = true;
                        }else{
                            putSendCommentButton = false;
                        }
                    }
                });
            }
            else{
                console.log("toma ya");
            }
        }


        playersOfTheMatch.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-item';

            const name = document.createElement('a');
            name.textContent = `${player.nickname}`;
            // Añadir un event listener para el clic en el nombre
            name.addEventListener('click', () => {
                // Llamar a tu función cuando se hace clic en el nombre
                showUserInfo(player);
            });
            playerDiv.appendChild(name);

            if(putButtons){
                if(player.id == match.organizerid){
                    const finishMatchButton = document.createElement('button');
                    finishMatchButton.className = 'finishMatchButton';
                    finishMatchButton.textContent = `Finish Match`;
                    playerDiv.appendChild(finishMatchButton);
                    finishMatchButton.addEventListener('click', () => {
                        finishMatch(playersOfTheMatch, match);
                    });
                }
                else{
                    const removePlayerButton = document.createElement('button');
                    removePlayerButton.className = 'removePlayerButton';
                    removePlayerButton.textContent = `Remove Player`;
                    playerDiv.appendChild(removePlayerButton);
                    removePlayerButton.addEventListener('click', () => {
                        removePlayer(player, match);
                    });
                }
            }
            if(putSendCommentButton){
                if(player.id == userId){
                    const sendCommentsButton = document.createElement('button');
                    sendCommentsButton.className = 'sendCommentsButton';
                    sendCommentsButton.textContent = `Send Comments`;
                    playerDiv.appendChild(sendCommentsButton);
                    sendCommentsButton.addEventListener('click', () => {
                        startCommentsProcess(playersOfTheMatch, match);
                    });
                }
            }
            players_list.appendChild(playerDiv);
        });
    }
}

async function showUserInfo(user){

    const matchdetailcontainer = document.getElementsByClassName('match-detail-container')[0];
    matchdetailcontainer.style.display = "none";
    const showUserInfo = document.getElementsByClassName('showUserInfo')[0];
    showUserInfo.style.display = "block";

    const profileContainer = document.getElementsByClassName('profile-container')[0];
    //profileContainer.style.display = "grid";

    const userInfoContainer = document.getElementsByClassName('user-data')[0];
    userInfoContainer.style.display = "grid";


    const nickNameElement = document.getElementById('profileName');
    // Crear elementos HTML para mostrar la información del usuario
    const nicknameElement = document.getElementById('nickname');
    const ageElement = document.getElementById('age');
    const emailElement = document.getElementById('email');
    const physicalElement = document.getElementById('physical');
    const positionElement = document.getElementById('position');
    const levelElement = document.getElementById('level');
    const closePanelButton = document.getElementById('closePanel');

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
        document.body.appendChild(showUserInfo);
        document.body.appendChild(profileContainer);

        closePanelButton.style.display = "flex";
        document.body.appendChild(closePanelButton);


        //meto el user panel titles
        const userPanel = document.getElementsByClassName('profile-panel')[0];

        /*Vamos a meter ahora el div del contenido*/
        const matchesButton = document.getElementById('MatchesMenu');
        const hoopsButton = document.getElementById('HoopsMenu');
        const CommentsButton = document.getElementById('CommentsMenu');
        matchesButton.addEventListener('click', () => {
            userMatches.style.display = 'block';
            userHoops.style.display = 'none';
            userComments.style.display = 'none';
            matchesButton.classList.add('active');
            hoopsButton.classList.remove('active');
            CommentsButton.classList.remove('active');
        });

        hoopsButton.addEventListener('click', () => {
            userHoops.style.display = 'block';
            userMatches.style.display = 'none';
            userComments.style.display = 'none';
            hoopsButton.classList.add('active');
            matchesButton.classList.remove('active');
            CommentsButton.classList.remove('active');
        });

        CommentsButton.addEventListener('click', () => {
            userComments.style.display = 'block';
            userHoops.style.display = 'none';
            userMatches.style.display = 'none';
            CommentsButton.classList.add('active');
            hoopsButton.classList.remove('active');
            matchesButton.classList.remove('active');
        });

        const userMatches = document.getElementsByClassName('userMatches')[0];
        const userHoops = document.getElementsByClassName('userHoops')[0];
        const userComments = document.getElementsByClassName('userComments')[0];



        // Inicializar el estado por defecto
        userMatches.style.display = 'block';
        userHoops.style.display = 'none';
        userComments.style.display = 'none';
        matchesButton.classList.add('active');
        hoopsButton.classList.remove('active');
        CommentsButton.classList.remove('active');

        userPanel.appendChild(matchesButton);
        userPanel.appendChild(hoopsButton);
        userPanel.appendChild(CommentsButton);
        userPanel.style.display = "flex";
        document.body.appendChild(userPanel);

        document.body.appendChild(userMatches);
        document.body.appendChild(userHoops);
        document.body.appendChild(userComments);
        // Llamar a la función para obtener las canchas favoritas del usuario
        getUserMatches(user.id);
        getUserFavouritesHoops(user.id);
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
            // Manejar situaciones donde no se puedan obtener las canchas favoritas
            console.error("No se pudieron obtener los matches del jugador.");
        }
    } catch (error) {
        console.error("Error al obtener los matches del jugador:", error);
    }
}

async function showUserMatches(userMatches){

    const userMatchesContainer = document.getElementsByClassName('userMatches')[0];
    userMatchesContainer.innerHTML = ''; // Limpiar el contenido anterior

    if (userMatches.length === 0) {
        userMatchesContainer.textContent = 'There are no Matches';
    } else {
        for (const match of userMatches) {
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


            matchDiv.appendChild(img);
            matchDiv.appendChild(name);
            matchDiv.appendChild(date);
            matchDiv.appendChild(format);

            userMatchesContainer.appendChild(matchDiv);
        }
    }
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

async function renderUserFavouritesHoops(hoops) {
    const userHoopsContainer = document.getElementsByClassName('userHoops')[0];
    userHoopsContainer.innerHTML = ''; // Limpiar el contenido anterior

    if (hoops.length === 0) {
        userHoopsContainer.textContent = 'There are no Hoops';
    } else {
        hoops.forEach(hoop => {
            const hoopDiv = document.createElement('div');
            hoopDiv.className = 'hoop-item';

            const img = document.createElement('img');
            img.src = 'images/fondoMatches.png'; // Asegúrate de tener la ruta correcta
            img.alt = 'Imagen de ' + hoop.name;
            img.className = 'hoop-image';

            const name = document.createElement('p');
            name.textContent = `Name: ${hoop.name}`;

            const location = document.createElement('p');
            location.textContent = `Location: ${hoop.location}`;

            hoopDiv.appendChild(img);
            hoopDiv.appendChild(name);
            hoopDiv.appendChild(location);

            userHoopsContainer.appendChild(hoopDiv);
        });
    }
}

async function getUserComments(userId) {
    try {
        const response = await fetch('user/'+userId+'/comments', {
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
            console.error("No se pudieron obtener las canchas favoritas.");
        }
    } catch (error) {
        console.error("Error al obtener las canchas favoritas:", error);
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

async function closePanel(){
    const matchdetailcontainer = document.getElementsByClassName('match-detail-container')[0];
    matchdetailcontainer.style.display = "block";
    const showUserInfo = document.getElementsByClassName('showUserInfo')[0];
    showUserInfo.style.display = "none";
    const userData = document.getElementsByClassName('user-data')[0];
    userData.style.display = "none";
    const userMatches = document.getElementsByClassName('userMatches')[0];
    userMatches.style.display = "none";
    const closePanel = document.getElementsByClassName('closePanel')[0];
    closePanel.style.display = "none";
    const profilePanel = document.getElementsByClassName('profile-panel')[0];
    profilePanel.style.display = "none";
    const profileH1 = document.getElementsByClassName('profile-container')[0];
    profileH1.style.display = "none";

    document.location.reload();
}

async function finishMatch(playersOfTheMatch, match){

    // Mostrar el contenedor de confirmación
    const emergente = document.getElementById('confirmBox');
    emergente.style.display = 'flex';

    //vamos a meter la funcionalidad de los botones
    const yesButton = document.getElementById('confirmYes');
    const noButton = document.getElementById('confirmNo');

    yesButton.addEventListener('click', async () => { // Añade async aquí
        try {
            const response = await fetch('/match/'+match.id+'/finished', {
                method: 'PUT',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                startCommentsProcess(playersOfTheMatch, match);
            } else {
                // Manejar situaciones donde no se puedan obtener las canchas favoritas
                console.error("Couldn´t finish the match.");
            }
        } catch (error) {
            console.error("Error al obtener los matches del jugador:", error);
        }
        //startCommentsProcess(playersOfTheMatch, match);
    });

    noButton.addEventListener('click', () => {
        emergente.style.display = 'none';
        return;
    });
}

async function markMatchAsCommented(match){

    try {
        const response = await fetch('/match/'+match.id+'/commented', {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log("marcado como commented");
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('id');
            window.location.href = `matches.html?id=${userId}`;
        } else {
            // Manejar situaciones donde no se puedan obtener las canchas favoritas
            console.error("Couldn´t mark the match as commented.");
        }
    } catch (error) {
        console.error("Error when marking the match as commented:", error);
    }
}

async function startCommentsProcess(playersOfTheMatch, match){//necesito el match para conseguir el objeto hoop

    const matchDetailContainer = document.getElementsByClassName('match-detail-container')[0];
    matchDetailContainer.style.display = 'none';
    const commentsContainer = document.getElementsByClassName('comments-container')[0];
    commentsContainer.style.display = 'block';

    const request = await fetch('/hoop/'+match.hoopid, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },

    });
    const hoop = await request.json();

    const commentsList = document.getElementsByClassName('commentsList')[0];
    // Limpia la lista de comments anterior
    commentsList.innerHTML = '';

// Crea el div para el comment sobre el hoop
    const hoopDivComment = document.createElement('div');
    hoopDivComment.className = 'hoopDivComment';
    // Agrega contenido al div del partido
    hoopDivComment.innerHTML = `
        <p class="comment-name">Give us a comment about the hoop</p>
        <input type="text" id="commentInput" name="input" class="comment-input">
        <button class="comment-button">Send Comment</button>
    `;

    const sendCommentButton = hoopDivComment.querySelector('.comment-button');
    sendCommentButton.addEventListener('click', () => {
        sendHoopComment(match.hoopid);
    });
    commentsList.appendChild(hoopDivComment);

    if (playersOfTheMatch.length === 0 || playersOfTheMatch.length === 1) {
        // Crea el div para el partido
        const commentDiv = document.createElement('div');
        commentDiv.className = 'commentDiv0';

        // Agrega contenido al div del partido
        commentDiv.innerHTML = `
            <p >There are no other user to send a comment</p>
        `;
        // Añade el div del comment al contenedor principal
        commentsList.appendChild(commentDiv);
    }

    // Recorre todos los users del partido y crea un div de comment hacia cada uno
    for (const player of playersOfTheMatch){

        //compruebo que no sea yo el usuario por el que vamos en el bucle
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if(player.id == id){
            continue;
        }


        // Crea el div del comment
        const commentDiv = document.createElement('div');
        commentDiv.className = 'commentDiv';

        // Agrega contenido al div del partido
        commentDiv.innerHTML = `
            <p class="comment-name">Give us a specific comment about ${player.nickname}</p>
            <input type="text" id="userCommentInput" class="comment-input">
            <button class="comment-button">Send Comment</button>
        `;

        // Encuentra el botón dentro de matchDiv
        const sendCommentButton = commentDiv.querySelector('.comment-button');

        // Añade un manejador de eventos de clic al botón
        sendCommentButton.addEventListener('click', () => {
            sendUserComment(player);
        });

        // Añade el div del comment al contenedor principal
        commentsList.appendChild(commentDiv);
    }
    const done = document.createElement('button');
    done.className = 'doneWithCommentsButton';
    done.textContent = `Done`;
    commentsList.appendChild(done);
    done.addEventListener('click', () => {
        const matchDetailContainer = document.getElementsByClassName('match-detail-container')[0];
        matchDetailContainer.style.display = 'block';
        const commentsContainer = document.getElementsByClassName('comments-container')[0];
        commentsContainer.style.display = 'none';

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        markMatchAsCommented(match);

    });
}

async function sendHoopComment(hoopId) {
    let datos = {};
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    datos.sender = userId;
    datos.userid = 0;
    datos.hoopid = hoopId;
    datos.msg = document.getElementById('commentInput').value;

    const request = await fetch('/comment', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (request.ok) {
        recoverTheComments(hoopId);
    } else {
        // Manejar casos donde la solicitud no fue exitosa
        alert("Error when creating your comment");
    }
}

async function recoverTheComments(hoopId){

    const request = await fetch('/comments', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    if (request.ok) {
        const comments = await request.json();
        recoverTheComment(comments, hoopId);
    } else {
        // Manejar casos donde la solicitud no fue exitosa
        alert("Error when recovering your comments");
    }
}

async function recoverTheComment(comments, hoopId){

    const request = await fetch('/comments/'+comments.length, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    if (request.ok) {
        const comment = await request.json();
        sendToTheHoop(comment, hoopId);
    } else {
        // Manejar casos donde la solicitud no fue exitosa
        alert("Error when posting your comment in the hoop");
    }
}

async function sendToTheHoop(comment, hoopId){

    const request = await fetch('/comment/'+comment.id+'/toHoop/'+hoopId, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

    });

    if (request.ok) {
        alert("Your comment about the hoop has been sent successfully.");
        return;
    } else {
        alert("Error sending your comment about the hoop.");
        return;
    }
}

async function sendUserComment(player){

    let datos = {};
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    datos.sender = userId;
    datos.userid = player.id;
    datos.hoopid = 0;
    datos.msg = document.getElementById('userCommentInput').value;

    const request = await fetch('/comment', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (request.ok) {
        recoverTheUserComments(player.id);
    } else {
        // Manejar casos donde la solicitud no fue exitosa
        alert("Error when creating your comment");
    }
}

async function recoverTheUserComments(playerId){

    const request = await fetch('/comments', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    if (request.ok) {
        const comments = await request.json();
        recoverTheUserComment(comments, playerId);
    } else {
        // Manejar casos donde la solicitud no fue exitosa
        alert("Error when recovering your comments");
    }
}

async function recoverTheUserComment(comments, playerId){

    const request = await fetch('/comments/'+comments.length, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    if (request.ok) {
        const comment = await request.json();
        sendToTheUser(comment, playerId);
    } else {
        // Manejar casos donde la solicitud no fue exitosa
        alert("Error when posting your comment to the User");
    }
}

async function sendToTheUser(comment, playerId){

    const request = await fetch('/comment/'+comment.id+'/toUser/'+playerId, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

    });

    if (request.ok) {
        alert("Your comment about the User has been sent successfully.");
        return;
    } else {
        alert("Error sending your comment about the User.");
        return;
    }
}

async function removePlayer(player, match){

    try {
        const request = await fetch('matches/'+match.id+'/remove/'+player.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

        });

        if (request.ok) {
            alert('Player Removed successfully!');
        } else {
            alert('Error signing up.');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    document.location.reload()
}

async function signUpPlayer(match){

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    //compruebo el nº de players que hay primero
    try {
        const response = await fetch('match/'+match.id+'/users', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const playersOfTheMatch = await response.json();
            console.log("players: "+playersOfTheMatch.length);
            console.log("number: "+match.nplayers);
            if(playersOfTheMatch.length < match.nplayers){
                addPlayerToMatch(userId, match);
            }
            else{
                alert("Could not sign up to match because it is already full of Users");
            }
        } else {
            // Manejar situaciones donde no se puedan obtener las canchas favoritas
            console.error("Couldn´t obtain the players.");
        }
    } catch (error) {
        console.error("Error at obtaining the players:", error);
    }
}

async function addPlayerToMatch(userId, match){

    try {
        const request = await fetch('matches/'+match.id+'/signup/'+userId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

        });

        if (request.ok) {
            alert('Signed up successfully!');
        } else {
            alert('Error signing up.');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    document.location.reload()
}

async function formatDateString(isoString) {
    const date = new Date(isoString);
    return date.toISOString().split('T')[0];
}

async function formatTimeString(isoString) {
    const date = new Date(isoString);
    return date.toISOString().split('T')[1].split('.')[0].slice(0, 5);
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