/*
@description - The classic game of Simon, where the user has to recreate
               the pattern that the computer creates.
@input - based solely on clicking the GUI to create the correct pattern.
@author - Brandon - Brandon.Murch@protonmail.com
*/


$(document).ready(function() {
  let isOpen = false;
  $('.searchBar__input').val(''); //Clears search field.

  $('.button--searchBar').click(function(){
    if (isOpen == false){
      isOpen = true;
      open();
    }
  });
              //Jquery autocomplete, opens the drop-down menu.
  $('.searchBar__input').autocomplete({
	    source: function(request, response) {
	        $.ajax({
	            url: "http://en.wikipedia.org/w/api.php",
	            dataType: 'jsonp',
	            data: {
	                'action': 'opensearch',
	                'format': 'json',
	                'search': request.term
	            },
	            success: function(data) {
	                response(data[1]);
	            }
	        });
	    }
	});

  $('.button--submit').click(function(event){
    event.preventDefault();
    let userInput = $('.searchBar__input').val();
    if (userInput.length !== 0) {
      wikiSearch(userInput);
      blurAll();
    } else {
      close();
    }
  });

  $('.searchBar__clear').click(function(event){
    $('.searchBar__input').val('');
    $('.searchResults').empty();
    close();
  });
                //Enter submits the query, ESC clears the search bar.
  document.onkeydown = function(event) {
    if (event.keyCode == 13) {
      $('.button--submit').click();
    } else if (event.keyCode == 27) {
      $('.searchBar__clear').click();
    }
  }
                //opens the search bar by adding a class to searchBar.
  const open = () => {
    $(".searchBar").addClass('searchBar--open');
    $('.button--submit').css('z-index', '20');
    isOpen = true;
  }
                //closes the search bar by removing a class to searchBar.
  const close = () => {
    $(".searchBar").removeClass('searchBar--open');
    $('.button--submit').css('z-index', '-10');
    isOpen = false;
    $('.searchBar__input').val('');
    blurAll();
  }
                //un-focuses from the search bar.
  const blurAll = () => {
   var tmp = document.createElement('input');
   document.body.appendChild(tmp);
   tmp.focus();
   document.body.removeChild(tmp);
  }

});
              //AJAX call to wikipedia, then placing the results in HTML.
const wikiSearch = (input) => {
  $.get('https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch='
   + prepareForLink(input), (data) => {
    let html = '';
    $.each(data.query.pages, function(i, item) {
      html += '<a class="searchResults__wikipediaLink" href="https://en.wikipedia.org/?curid='
      + item.pageid + '" target="_blank"><div class = "searchResults__wikipediaPage layout--light ">'
      + '<h2 class = "searchResults__wikipediaTitle searchResults__wikipediaText">' + item.title
      + '</h2><p class = "searchResults__wikipediaText searchBar__text searchBar__text--wikipediaText">'
      + item.extract + '"</p>'
      +"</div></a>";
    });
    $('.searchResults').html(html);
}, 'jsonp');
}

const prepareForLink = (string) =>{
  return encodeURIComponent(string.toLowerCase());
}
