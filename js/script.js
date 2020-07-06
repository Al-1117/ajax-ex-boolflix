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
      var valoreDaCercare = $('.search input').val();

      // Recupero i risultati della ricerca  con l'apposita funzione
      cerca(valoreDaCercare, 'film');
      cerca(valoreDaCercare, 'serie');


    }
  );

  $('.search input').keyup(
    function(){
      // Se il trasto premuto corrisponde all'invio trovandosi nell'input per
      // cercare un film
      if (event.wich == 13  || event.keyCode == 13) {
        // Recupero il valore del testo cercato e lo inserisco in una variabile
        var valoreDaCercare = $('.search input').val();

        cerca(valoreDaCercare, 'film');
        cerca(valoreDaCercare, 'serie');
      };
    }
  );

  // Gestisco gli eventi dell'hover del mouse su ogni singolo risultato
  // all'entrata del mouse
  $(document).on('mouseenter', '.single_movie',
  function(){
  $(this).children('.movie_details').removeClass('hidden');
  $(this).children('.movie_details').addClass('active');

  });
  // all'uscita del mouse
  $(document).on('mouseleave', '.single_movie',
  function(){
  $(this).children('.movie_details').removeClass('active');
  $(this).children('.movie_details').addClass('hidden');

  });


  /////////////////////////////////// FUNZIONI///////////////////////////

  // ----Funzione per scercare i film tramite API themoviedb----

  // argomento: inserire il testo della ricerca
  // return: non ritorna niente, trova e  stampa il risultato a schermo

  function cerca(valoreDaCercare, tipo){
    // Prima di tutto, svuoto il container dei risultati qualora ve ne fossero
    svuotaElemento('.results_container');


    // FACCIO LA  AJAX
    // Inserisco i dati che potrebbero cambiare in variabili per miglior gestione
    var indirizzoFilm = 'https://api.themoviedb.org/3/search/movie';
    var indirizzoSerietv = 'https://api.themoviedb.org/3/search/tv';
    var chiaveApi = 'b5088f564129de7518e2ba70246dbe5f';

    // Faccio un array in cui metto gli indirizzi

    // var arrayIndirizziFilm = [indirizzoFilm];
    // var arrayIndirizziSerietv = [indirizzoSerietv];


    if (tipo === 'film') {
      var indirizzo = indirizzoFilm;

    } else {
      var indirizzo = indirizzoSerietv;
    }

    // Inizializzo un CICLO FOR per poter fare ricerca con una
    // sola chiamata ajax a più indirizzi

    for (var i = 0; i < indirizzo.length; i++) {


      $.ajax(
        {
          url: indirizzo,
          method: 'GET',
          data:{
            api_key: chiaveApi,
            query: valoreDaCercare,
            language:'it-IT'
          },
          // Se la chiamata ha successo
          success: function(response){
            // Creo la variabile messaggio per poter gestire
            // la stampa degli eventuali errori
            var messaggio;
            // Inizializzo un ciclo FOR IN prendendo di mira la
            // risposta dell'API per poter scorrere e prendere
            // l'array dei film
            var arrayRisultati = response.results;
            console.log(arrayRisultati);
            // SE la chiamata ha successo, ma il risultato della ricerca non produce risultati
            if (arrayRisultati.length == 0) {
              messaggio = "La tua ricerca non ha prodotto alcun risultato. Controlla la parola inserita";
              visualizzaMessaggioErrore(messaggio);
            }
            // ALTRIMENTI Stampo a schermo tutti i film con la relativa funzione
            stampaRisultati(arrayRisultati);
          },
          // IN CASO DI ERRORE, VISUALIZZO UN MESSAGGIO in base al tipo di errore
          error: function(){
            if (valoreDaCercare.length == 0 ) {
              messaggio = "Inserisci una parola da cercare";
              visualizzaMessaggioErrore(messaggio);
            }
          }
        }
      );
    }


  }

  // ----Funzione per stampare elementi a schermo tramite handlebars----

  // argomento: inserire un array
  // return: non ritorna niente, permette la stampa il risultato a schermo
  function stampaRisultati(array){
    // inserisco le variabili di handlebars
    var sorgente = $("#results_template").html();
    var template = Handlebars.compile(sorgente);
    // Inizializzo un ciclo for per scorrere gli elementi
    // dell'array inserito
    for (var i = 0; i < array.length; i++) {

      var singoloElemento = array[i];

      // Creo il contesto in modo da stampare sia film che serie tv
      var contesto = {
        titolo: singoloElemento.title || singoloElemento.name,
        titoloOriginale: singoloElemento.original_title || singoloElemento.original_name,
        lingua: daISOaBandiera(singoloElemento.original_language),
        voto: valutazioneStelle(singoloElemento.vote_average),
        percorso: singoloElemento.poster_path,
        trama: singoloElemento.overview,
      };

      var html = template(contesto);
      // Appendo il tutto nello specifico container
      $('.results_container').append(html);

    }
  }

  // ------Funzione per svuotare un container-------
  // argomento: inserire l'elemento in questione
  // return: non ritorna niente, svuota l'elemento
  function svuotaElemento(elemento){
    $(elemento).html('');
  }

  // ----Funzione per visualizzare il messaggio in caso di errore ----

  // argomento: inserire un array
  // return: non ritorna niente, permette la stampa il risultato a schermo
  function visualizzaMessaggioErrore(messaggio){
    // inserisco le variabili di handlebars
    var sorgente = $("#error_template").html();
    var template = Handlebars.compile(sorgente);
    // Inserisco gli elementi nel contesto che poi saranno
    // inseriti nell'HTML
    var contesto = {
      errore: messaggio
    };

    var html = template(contesto);
    // Appendo il tutto nello specifico container
    $('.results_container').append(html);



  };

  // ----Funzione per visualizzare le stelle come valutazione  ----
  // argomento: inserire un numero, accettata anche stringa
  // return: ritorna il valore del numero in un numero intero da 1 a 5

    // console.log(valutazioneStelle('4'));

  function valutazioneStelle(num){
    // Converto il numero per poter eseguire le varie operazioni matematiche
    var valoreConvertitoNumero = (parseInt(num));
    // Divido il numero per 2
    var valore = valoreConvertitoNumero / 2;
    // Arrotondo per eccesso il valore inserito
    var valoreArrondato = Math.ceil(valore);

    // Creo una variabile che conterrà le stelline
    var stelline = "";

    for (var i = 1; i <= 5; i++) {

      if (i <= valoreArrondato) {
        stelline += '<i class="fa fa-star" aria-hidden="true">'  + '</i>';
      } else {
        stelline += '<iclass="fa fa-star-o" aria-hidden="true">' + '</i>';


      }


    }

    return stelline;


  }

  // ----Funzione per visualizzare le stelle come valutazione  ----
  // argomento: inserire un testo che rapprensenti la lingua
  // return: ritorna la bandierina al posto del codice ISO della lingua

  function daISOaBandiera (lingua){
    // Creo un array in cui inserisco alcune lingue predefinite
    var arrayLingue = ['it', 'en', 'fr', 'de', 'es'];
    var bandiera;
    // Se quet'ultimo array include il risultato:
    if (arrayLingue.includes(lingua)) {
      // inserisco la relativa immagine nell'html
      bandiera = '<img src= "img/' + lingua + '.png">';
    } else {
      // altrimenti stampo il codice della lingua
      bandiera = lingua;
    }


    return bandiera;
  }







});
