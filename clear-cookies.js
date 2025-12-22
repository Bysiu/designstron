// Skrypt do czyszczenia ciasteczek - uruchom w konsoli przeglądarki
console.log('Czyszczenie ciasteczek...');

// Wyczyść wszystkie ciasteczka dla localhost
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/");
});

console.log('Ciasteczka wyczyszczone!');

// Przeładuj stronę
setTimeout(() => {
  window.location.reload();
}, 1000);
