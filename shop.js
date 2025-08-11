// shop.js - kleine Hilfsfunktionen speziell für shop page
document.addEventListener('DOMContentLoaded', ()=>{
  // bei Anwesenheit eines productGrid sicherstellen, dass Produkte gerendert werden
  if(document.getElementById('productGrid') && window.renderProductGrid){
    // renderProductGrid aus main.js
    renderProductGrid();
  }
});