function Search() {
    const steamID = document.getElementById('steamid').value;
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=05AEFB4CBE4C3757E2EBFD2DE4E78821&steamid=${steamID}&include_appinfo=true&include_played_free_games=true&format=json`
    let hourFilter = document.getElementById('hourFilter');
    hourFilter = hourFilter.value;

    if (hourFilter == "") { //comprueba que el valor del filtro no este vacío y lo coloca en cero, o multiplica el valor por 60 para obtener los minutos
        hourFilter = 0;
    } else {
        hourFilter = hourFilter * 60;
    }

    console.log(`el valor traido de hourFilter es: ${hourFilter / 60}, multiplicado da ${hourFilter}`);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const games = data.response.games; //almacena la ruta base del json para obtener la información de los juegos
            const totalOwnedGames = data.response.game_count; //almacena el total de juegos obtenidos
            let playedGames = 0; //variable para contar el total de juegos en los que se ha dedicado tiempo
            let totalPlayedTime = 0; //variable para contar el total de tiempo invertido
            const totalGames = []; //array donde se almacenarán los datos de los juegos

            games.forEach(game => {
                if (game.playtime_forever > hourFilter) { //si este valor es mayor a cero, se almacena en el array
                    totalGames.push({ name: game.name, playtime: game.playtime_forever })
                    playedGames = playedGames + 1;
                    totalPlayedTime = totalPlayedTime + game.playtime_forever;
                }
            })

            totalPlayedTime = totalPlayedTime / 60; //se obtiene su valor en horas
            console.log(`you have played ${playedGames} game from your owned total of ${totalOwnedGames}.`);

            new Chart(
                document.getElementById('timePie'),
                {
                    type: 'pie', 
                    data: {
                        labels: totalGames.map(game => game.name),
                        datasets: [
                            {
                                data: totalGames.map(game => (game.playtime / 60).toFixed(1)), //toma el tiempo de juego total en minutos, lo multiplica para convertirlo en horas y luego lo redondea
                                backgroundColor: generateColorPalette(totalGames.length) // cambia el color de las secciones del gráfico en base a una función
                            }]
                    },
                    options: {
                        borderColor: '#36363680', //es el color de los bordes entre las secciones del gráfico
                        aspectRatio: 2, //cambia el tamaño del canvas, 1 es cuadrado 2 es rectangular
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'left', //define la posición de la leyenda (los nombres de los juegos)
                                labels: {
                                    color: 'white' //cambia el color de la leyenda
                                }
                            }
                        }
                    }
                }
            );

        })
        .catch(error => console.error(error));
}

function generateColorPalette(count) { //genera un array de colores cuya cantidad es definida según un numero
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = Math.floor((360 / count) * i);
        colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
}