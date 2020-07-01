//////////////////// INFORMAZIONI SULL'API THE MOVIEDB//////////////////////
  // INDIRIZZO
  // https://api.themoviedb.org/3/search/movie?

  // CHIAVE della richiesta all'API themoviedb:
  // b5088f564129de7518e2ba70246dbe5f

  // Esempio di chiamata all'API sopraindicato:
  // https://api.themoviedb.org/3/search/movie?api_key=b5088f564129de7518e2ba70246dbe5f&language=it-IT&query=ritorno&page=1&include_adult=false

  /////////////////////////////// INIZIO SCRIPT/////////////////////////////////
// Carico il file Script.JS solo dopo che tutto l'HTML è stato caricato
$(document).ready(function(){

  // Creo l'evento cliccando sull'incona della ricerca dopo aver inserito il testo da cercare
  $(document).on('click', '.search_button',
    function(){
      // Recupero il valore del testo cercato e lo inserisco in una variabile
      testoCercato = $('.search input').val();

      // Interrogo l'API per trovare tutti film corrispondenti
      // alla parola cercata
      $.ajax(
        {
          url:'https://api.themoviedb.org/3/search/movie',
          method: 'GET',
          data:{
            api_key:'b5088f564129de7518e2ba70246dbe5f',
            query: testoCercato,
            language:'it-IT'
          },

          // Se la chiamata ha successo
          success: function(response){
            // Inizializzo un ciclo FOR IN prendendo di mira la
            // risposta dell'API per poter scorrere e prendere
            // l'array dei film
            for (key in response) {

              arrayFilm = response[key];

            }
            // Stampo a schermo tutti i film con la relativa funzione
            stampaFilm(arrayFilm);
          },
          // IN CASO DI ERRORE, VISUALIZZO UN MESSAGGIO
          error: function(){
            alert("Qualcosa è andato storto");
          }
        }
      );
    }
  );


  /////////////////////////////////// FUNZIONI///////////////////////////

  // Funzione per stampare elementi a schermo tramite handlebars
  // argomento: inserire un array
  // return: non ritorna niente, stampa il risultato a schermo
  function stampaFilm(array){
    // inserisco le variabili di handlebars
    var sorgente = $("#movies_template").html();
    var template = Handlebars.compile(sorgente);
    // Inizializzo un ciclo for per scorrere gli elementi
    // dell'array inserito
    for (var i = 0; i < array.length; i++) {

      var singoloElementoFilm = array[i];
      // Inserisco gli elementi nel contesto che poi saranno
      // inseriti nell'HTML
      var contesto = {
        titolo: singoloElementoFilm.title,
        titoloOriginale: singoloElementoFilm.original_title,
        lingua: singoloElementoFilm.original_language,
        voto: singoloElementoFilm.vote_average,
      };

      var html = template(contesto);
      // Appendo il tutto nello specifico container
      $('.movies_container').append(html);

    }
  }

});
