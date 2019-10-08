import '../styles/index.scss';
import Axios from 'axios';
​
// Stap 1 =  Om de 3 seconden JSON ophalen.
setInterval(getJson, 3000);
​
// Doe AJAX Call
function getJson(){
    Axios.get("/public/fallback.json") // waarom /public? File staat op http://localhost:8080/public/fallback.json
    .then(function(response){ // Then is typisch voor Promises (moderne JS)
        // Enige plek waar we zeker zijn, dat fallback.json is ingeladen.
        // Je kan dit het beste checken via de "network" tab in je console.
        checkJSON(response.data);
    });
}
​
// Stap 2: JSON "onderzoeken", om te kijken wat we moeten doen
function checkJSON(data){
    console.log(data);
​
    // Stap 3: Check of er een redirect in de JSON zit
    if(data.redirect){
        // als dat het geval is: redirect logica
        redirect(data.redirect);
    } 
​
    // Stap 4: Check of er een refresh in de JSON zit
    if(data.refresh){
        // als dat het geval is: refresh logica
        refresh(data.refresh);
    } 
​
    // We verwijderen ALTIJD oude popups en zetten hem eventueel terug 
    // zowel in originele staat als eventuele update.
    removePopup();
    // Stap 5: Check of er een popup in de JSON zit
    if(data.popup){
        // als dat het geval is: refresh logica
        popup(data.popup);
    } 
}
​
function redirect(url){
    // Eerst kijken of redirect wel nodig is/mag
    // if huidige website !== redirect site
    if(window.location.href !== url){
        console.log("Redirect found, done, different site");
        window.location.replace(url); // window.location.href = url;
    } else {
        console.log("redirect found, didn't do it, same site.");
    }  
}
​
function refresh(token){
    // Token ophalen uit de localstorage (als die er is);
    var hasToken = localStorage.getItem("token");
​
    // checken als hij er is EN of hij gelijk is aan die uit de JSON
    if(hasToken && hasToken == token){
        //niks doen
        console.log("Refresh token found, refresh allready preformed");
    } else {
        // er is geen token in localstorage of het een andere
        // slaan we onze nieuwe token op
        localStorage.setItem("token", token);
        // herladen we de site;
        location.reload();
    } 
}
​
function popup(html){
    // Popup div aanmaken
    var popup = document.createElement("div");
    // ID op de popup zetten zodat we hem later kunnen verwijderen
    popup.setAttribute("id", "fallbackPopup");
    // Popup vullen met html uit de JSON
    popup.innerHTML = html;
​
    // Popup toevoegen aan de body
    document.body.appendChild(popup);
}
​
function removePopup(){
    // popup ophalen aan de hand van het id;
    var popup = document.getElementById("fallbackPopup");
​
    // kijken of we een popup hebben, want bijvoorbeeld bij de eerste pageload zal er nooit 1 zijn.
    if(popup){
        // Element verwijderen van de pagina
        popup.parentElement.removeChild(popup);
    }
}