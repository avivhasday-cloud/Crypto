let amountOfToggleOn = 0;
let currencyCacheMap = new Map();
let togglesIdMap = new Map();
let cards = getCards();
let cardsArray = [];
let modalStatus = false;
let symbolsArray = [];

// spinner functions
let loadSpinner = () => $(".spinner").css("display", "block");
let unLoadSpinner = () => $(".spinner").css("display", "none");

$('.arrow').click(function () {
    $('html, body').animate({
      scrollTop: $('#header').offset().top
    }, 750);
});


// handling currency market data cache
function saveCurrencyInCache(id, div){
    currencyCacheMap.set(id, JSON.stringify(div));
    removeCurrencyFromCache(id)
}
let removeCurrencyFromCache = (id) => setTimeout(function(){currencyCacheMap.delete(id)}, 120000)

function getCards(){
    if ("currencyData" in localStorage){
        let strKey = localStorage.getItem("currencyData");
        let cards = JSON.parse(strKey);
        return cards;
    }
}

function onGetCurrencyData(){
    let currencyData = ``;
    let currencyDiv = $("#currencyDiv");
    if ("currencyData" in localStorage){
        let strKey = localStorage.getItem("currencyData");
        let keyCache = JSON.parse(strKey);
        keyCache.forEach(item =>{
            let cardCache = createCard(item) 
            $(currencyDiv).append(cardCache);
        })
        return;
    }
    loadSpinner();
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/",
        type: 'GET',
        success: function (data) {
            data.forEach(object => {
                currencyData += createCard(object)
            });
            localStorage.setItem("currencyData", JSON.stringify(data));
            unLoadSpinner();
            $("#currencyDiv").html(currencyData);
        },
        error: function () {
  
          console.log('Failure');
        }
      });
}


function onMoreInfoClicked(button){
    let cardDiv = $(button).parents()[2];
    let currencyId = cardDiv.id;
    if (button.checked){
        $(cardDiv).children().last().remove();
        $(button).html("More Info");
        button.checked = false;
        return;
    }
    if (currencyCacheMap.has(currencyId)){
        let currencyIdValue = JSON.parse(currencyCacheMap.get(currencyId)) 
        $(cardDiv).append(currencyIdValue);
        $(button).html("Less Info");
        button.checked = true;
        return;
    }  
     // displaying loading progress bar
    $(cardDiv).append($(".spinner"))
    loadSpinner();
    $(button).attr("onclick", "");

    $.ajax({
        url: 'https://api.coingecko.com/api/v3/coins/' + currencyId,
        type: 'GET',
        success: function (data) {
            $(button).attr("onclick", "onMoreInfoClicked(this)");
            let currencyMarketData = showCurrencyMoreInfo(data);
            saveCurrencyInCache(currencyId, currencyMarketData);
            unLoadSpinner();
            $(button).html("Less Info");
            $(cardDiv).append(currencyMarketData);
            button.checked = true;
        },
        error: function () {
  
          console.log('Failure');
        }
      });   
}

console.log(symbolsArray)

function onSearchCurrency(){
    let searchBoxValue = $("#searchCoinInput").val();
    $("#searchCoinInput").on('change', function(){
        $('.card').show();
    
    })
    if ($("#container").css("display", "block")){
        $(".home").click()
        $("#currencyDiv").css("display", "");
        $("#container").css("display", "none");
    }
    cards.forEach(card =>{
        if (card.symbol == searchBoxValue){
            $('.card').hide();
            $('#'+card.id).show()
            return;
        }
    })
    alert("Invalid input, try again")
}



function onToggleButton(toggleBtn, cardId){
    if (toggleBtn.checked){
        let currentCard = cards.find(card => card.id == cardId);
        symbolsArray.push(currentCard.symbol.toUpperCase())
        console.log(symbolsArray)
        togglesIdMap.set(cardId, true);
        cardsArray.push(currentCard)
        amountOfToggleOn++;
        
    }
    else{
        let index = cards.findIndex(card => card.id == cardId)
        let symbolIndex = symbolsArray.indexOf(cards[index].symbol.toUpperCase())
        $("#"+cardId+"Toggle")[0].checked = false;
        symbolsArray.splice(symbolIndex, 1)
        cardsArray.splice(index, 1);
        togglesIdMap.delete(cardId);
        amountOfToggleOn--;
        if(modalStatus == true){
            modalStatus = false
            $(".modal-body").html(" ")
        }
    }
        
    if(cardsArray.length==6 && !modalStatus){
        handleModal(cardsArray)
    }
    
}



function handleModal(cardsArray){
    cardsArray.forEach(card => {
        let newCard = createCard(card)
        let toggleId = "#"+card.id + "Toggle"
        $(".modal-body").append(newCard);
        if (togglesIdMap.get(card.id)){
            document.querySelectorAll(toggleId)[1].checked = true;
        } 
    })
    $("#myModal").modal("show")
    modalStatus = true;
}
        


function onSaveChosenCards(){
    if (amountOfToggleOn == 5){
        $("#myModal").modal('hide');
    }
}

$('#searchCoinInput').keypress(function (e) { // Click enter to search key
    if (e.which == 13) {
      $(this).blur();
      $('#searchButton').focus().click();
    }
});

$(".home").click(function(){
    $("#currencyDiv").css("display", "");
    $("#container").css("display", "none");
    $("#aboutContainer").css("display", "none");
});

$(".liveReports").click(function(){
    $("#currencyDiv").css("display", "none");
    $("#aboutContainer").css("display", "none");
    $("#container").css("display", "block");

    if (symbolsArray.length == 0){
        $("#liveReportsContainer").html(`<h1>Please select at least one card to show on graph</h1>`)
        $("#liveReportsContainer").append(`<button id="returnHome" class="button">Return to homepage</button>`)
        $("#returnHome").click(function(){
            $(".home").click()
        })
        return;
    }
    liveReports(symbolsArray);
});

$(".about").click(function(){
    $("#currencyDiv").css("display", "none");
    $("#container").css("display", "none");
    $("#aboutContainer").css("display", "flex");
    $("#aboutContainer").html(createAboutPage())
})





