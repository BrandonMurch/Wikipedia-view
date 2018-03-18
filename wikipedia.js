$(document).ready(function() {
  let searchBar = $('#searchBar');
  let searchBarInput = $('.searchBarInput');
  $(searchBarInput).val('');
  let searchBarBtn = $('.searchBarBtn');
  let searchBarIcon = $('.searchBarIcon');
  let clearSearch = $('.clearSearch');
  let isOpen = false;
  let wikipediaResults = $('.wikipediaResults')
  searchBarIcon.click(function(){
    if (isOpen == false){
      isOpen = true;
      open();
    }
  });
  $('.searchBarInput').autocomplete({
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
  searchBarBtn.click(function(event){
    event.preventDefault();
    let userInput = searchBarInput.val();
    if (userInput.length !== 0) {
      wikiSearch(userInput);
      blurAll();
    } else {
      close();
    }
  });

  clearSearch.click(function(event){
    searchBarInput.val('');
    $('.wikipediaResults').empty();
    close();
  });

  document.onkeydown = function(event) {
    if (event.keyCode == 13) {
      searchBarBtn.click();
    } else if (event.keyCode == 27) {
      clearSearch.click();
    }
  }

  const open = () => {
    searchBar.addClass('searchBarOpen');
    searchBarBtn.css('z-index', '20');
    isOpen = true;
  }

  const close = () => {
    $(searchBar).removeClass('searchBarOpen');
    $(searchBarBtn).css('z-index', '-10');
    isOpen = false;
    searchBarInput.val('');
    blurAll();
  }

  const blurAll = () => {
   var tmp = document.createElement('input');
   document.body.appendChild(tmp);
   tmp.focus();
   document.body.removeChild(tmp);
  }

});
const wikiSearch = (input) => {
  $.get('https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch='
   + prepareForLink(input),
  function(data) {
    let html = '';
    $.each(data.query.pages, function(i, item) {
      html += '<a href="https://en.wikipedia.org/?curid=' + item.pageid + '" target="_blank"><div class = "eachResult">';
      html += '<h2 class = "wikiTitle">' + item.title + '</h2><p class = "wikiText">' + item.extract + '"</p>';
      html += "</div></a>";
    });
    $('.wikipediaResults').html(html);
}, 'jsonp');
}

const prepareForLink = (string) =>{
  return encodeURIComponent(string.toLowerCase());
}
