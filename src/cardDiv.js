

function createCard(currency) {
    
    let currencyCard = `<div class="card" id="${currency.id}">
                            <div class="card-body">
                                <div class="cardHeader">
                                    <h5 class="card-title">${currency.symbol}</h5>  
                                    <p class="card-text">${currency.id}</p>
                                    <img class="currencyImg"  src="${currency.image.small}">
           
                                </div>
                                <div class="cardFooter">
                                    <button type="button" class="moreInfoBtn button" onclick="onMoreInfoClicked(this)">More Info</button>
                                    <label  class="switch">
                                        <input type="checkbox" id="${currency.id + "Toggle"}"  onclick="onToggleButton(this,'${currency.id}')" >
                                        <span class="sliderBtn round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>`
    
                       
    return currencyCard;                
}



function showCurrencyMoreInfo(currency){
    let expandedCard = ``;
    expandedCard += `<div class="expendedCard">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fas fa-dollar-sign"></i>   ${currency.market_data.current_price.usd}</h5>
                            <h5 class="card-title"><i class="fas fa-euro-sign"></i>     ${currency.market_data.current_price.eur}</h5>
                            <h5 class="card-title"><i class="fas fa-shekel-sign"></i>   ${currency.market_data.current_price.ils}</h5>
                        </div>
                    </div>`
    return expandedCard;                
}