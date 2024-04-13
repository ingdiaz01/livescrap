const express = require('express');
const { timeout } = require('puppeteer');
const app = express()
const puppeteer = require('puppeteer');
app.use(express.static('public'));

app.get('/games', async function (req, res) {
  try {
    const datos = await obtenerGames();
    return res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener datos :', error);
    return res.status(500).json({
      error: 'Hubo un error al obtener los datos '
    });
  }

});



app.get('/gamemlb', async function (req, res) {
  try {
    const datos = await getMLB_streame();
    return res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener datos :', error);
    return res.status(500).json({
      error: 'Hubo un error al obtener los datos'
    });
  }

});

app.get('/gamelist', async function (req, res) {
  try {
    const datos = await getMLB_List();
    return res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener datos :', error);
    return res.status(500).json({
      error: 'Hubo un error al obtener los datos'
    });
  }

});


// Ruta para servir  reproductor.html
"____________servidor buffestreams__________________________"
async function obtenerGames() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // debugger;
  try {
    const ii_Url = 'https://buffstreams.app/mlbstreams';
    await page.goto(ii_Url.trim());

    // Esperar a que el input y el botón estén disponibles antes de interactuar con ellos
    await page.waitForSelector('.body');


    // Extraer la información de los juegos
    const gamesInfo = await page.evaluate(() => {
      const gamesList = [];
      const competitionElements = document.querySelectorAll('.body .competition');

      competitionElements.forEach(competitionElement => {
        const link = competitionElement.getAttribute('href');
        const teamNamesElement = competitionElement.querySelectorAll('.name');
        const team1 = teamNamesElement[0].innerText.trim();
        const team2 = teamNamesElement[1].innerText.trim();
        let inning = '';
        let time = '';

        const scoreElement = competitionElement.querySelector('.competition-cell-score');
        if (scoreElement) {
          inning = scoreElement.innerText//scoreElement.querySelector('.competition-cell-status').innerText.trim();
        } else {
          const timeElement = competitionElement.querySelector('.competition-cell-status time');
          time = timeElement ? timeElement.innerText.trim() : '';
        }

        gamesList.push({
          teams: `${team1} vs ${team2}`,
          inning,
          time,
          link
        });
      });

      return gamesList;
    });

    // console.log(gamesInfo);
    await browser.close();
    return gamesInfo;

  } catch (error) {
    console.error('Error en obtenerDatosRNC:', error);
    throw error;
  }
}


"____________servidor MLBOX>ME_________________________________"
// async function getMLB_streame() {

//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   debugger;
//   try {
//     let fec= new Date();
//     let  fullYears = fec.getFullYear();

//     const url = `https://mlbbox.me/mlb-${fullYears}-live-streams`


//     await page.goto(url);
    
//     const games = await page.evaluate(() => {
//       const listGames = [];
//       const div = document.querySelector('.clearfix'); // No se usa el '#' en el parámetro de getElementById
//       const listElements = div.querySelectorAll("a");

//       listElements.forEach(linkElement => {
//         const link = linkElement.getAttribute('href');

//         listGames.push({
//           'url': link
//         });
//       });
//       return listGames;


//     });
//     await browser.close();
//     return games;
//   } catch (error) {
//       throw error;
//   }

// }




// async function getMLB_List() {
//   // debugger

//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   try {
//     let fec = new Date();
//     let fullYears = fec.getFullYear();

//     const url = `https://mlbbox.me/mlb-${fullYears}-live-streams`;

//     await page.goto(url);

//     const games = await page.evaluate(async () => {
//       const listGames = [];
//       const linkElements = document.querySelectorAll('.clearfix a');
//       const link = linkElement.getAttribute('href');

//       console.log(link)

//       for (let i = 0; i < linkElements.length; i++) {
//         const linkElement = linkElements[i];


        
//         // Hacer clic en el enlace para mostrar los enlaces HD
//         await new Promise(resolve => {
//           linkElement.click();
//           setTimeout(resolve, 2000); // Esperar 2 segundos para que carguen los enlaces HD
//         });

//         const hdLinks = document.querySelectorAll('.btn.btn-link');
//         hdLinks.forEach(hdLink => {

//           if (hdLink.textContent.includes('HD')) {
//             listGames.push({
//               'url': hdLink.getAttribute('data-openuri')
//             });
//           }
//         });
//       }

//       return listGames;
//     });

//     await browser.close();
//     return games;
//   } catch (error) {
//     throw error;
//   }
// }




async function getMLB_List() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    let fec = new Date();
    let fullYears = fec.getFullYear();

    const url = `https://mlbbox.me/mlb-${fullYears}-live-streams`;

    await page.goto(url);

    const games = await page.evaluate(async () => {
      const listGames = new Set(); // Utilizamos un conjunto para almacenar enlaces únicos
      const linkElements = document.querySelectorAll('.clearfix a');

      for (let i = 0; i < linkElements.length; i++) {
        const linkElement = linkElements[i];
        const link = linkElement.getAttribute('href');

        // Hacer clic en el enlace para mostrar los enlaces HD
        await new Promise(resolve => {
          linkElement.click();
          setTimeout(resolve, 2000); // Esperar 2 segundos para que carguen los enlaces HD
        });

        const hdLinks = document.querySelectorAll('.btn.btn-link');
        hdLinks.forEach(hdLink => {
          if (hdLink.textContent.includes('HD')) {
            listGames.add(hdLink.getAttribute('data-openuri')); // Agregamos el enlace al conjunto
          }
        });
      }

      return Array.from(listGames); // Convertimos el conjunto a un array antes de devolverlo
    });

    await browser.close();
    return games;
  } catch (error) {
    throw error;
  }
}


async function getMLB_streame() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    let fec = new Date();
    let fullYears = fec.getFullYear();

    const url = `https://mlbbox.me/mlb-${fullYears}-live-streams`;

    await page.goto(url);

    const games = await page.evaluate(async () => {
      const gameList = [];

      const linkElements = document.querySelectorAll('.clearfix a');




      for (let i = 0; i < linkElements.length; i++) {
        const linkElement = linkElements[i];
        const gameTitle = linkElement.textContent.trim();
        // const gameUrl = linkElement.getAttribute('href');

        // Hacer clic en el enlace para mostrar los enlaces HD
        await new Promise(resolve => {
          linkElement.click();
          setTimeout(resolve, 2000); // Esperar 2 segundos para que carguen los enlaces HD
        });

        const hdLinks = document.querySelectorAll('.btn.btn-link');
        let homeUrl, visitorUrl;
        hdLinks.forEach(hdLink => {
          if (hdLink.textContent.includes('HD')) {


            const streamUrl = hdLink.getAttribute('data-openuri');
             
            let url2 = streamUrl.match('/stream-3')
            if(url2 && url2.length >0){
              homeUrl = streamUrl.replace('/stream-3', '/stream-2')
            }
              visitorUrl = streamUrl 
          
          }
        });

        // Buscar el texto que indica la hora del juego dentro del enlace
        const gameHourRegex = /\d{1,2}:\d{2}/; // Expresión regular para buscar el formato de hora HH:MM
        const gameHourMatch = gameTitle.match(gameHourRegex);
        const gameHour = gameHourMatch ? gameHourMatch[0] : '00:00';

        const fechaT = new Date(`2000-01-01T${gameHour}`);
        const opciones = {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        };
        
        const formateador = new Intl.DateTimeFormat('en-US', opciones);
        const hora12Formateada = formateador.format(fechaT);


        if (homeUrl && visitorUrl) {
          gameList.push({
            teams: gameTitle,
            hora: hora12Formateada,
            urlhome: `https://mlbbox.me/mlb/${homeUrl}`,
            urlvise: `https://mlbbox.me/mlb/${visitorUrl}`
          });
        }
      }

      return gameList;
    });

    await browser.close();
    return games;
  } catch (error) {
    throw error;
  }



    
}





const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor web escuchando en el puerto http://172.21.0.11:${PORT}`);
  // console.log(`Servidor web escuchando en el puerto http://qjm-id4.com:${PORT}`);
});