# Joc Asteroids  

Un joc inspirat de clasicul **Asteroids** creat utilizând tehnologia web modernă, cu suport pentru control prin tastatură, touchscreen și multe funcționalități captivante.  

## Descriere  
Acest proiect este o implementare modernă a jocului Asteroids, utilizând `<canvas>` sau `<svg>` pentru randare grafică. Scopul jocului este de a controla o navă spațială, de a distruge asteroizii și de a obține cel mai mare scor posibil, evitând în același timp coliziunea cu asteroizii.  

## Funcționalități  
- **Asteroizi dinamici:**  
  - Fiecare asteroid este reprezentat sub formă de cerc.  
  - Valoarea fiecărui asteroid (între 1 și 4) indică numărul de rachete necesare pentru distrugerea acestuia.  
  - Culoarea și dimensiunea asteroidului se modifică în funcție de această valoare.  
  - Asteroizii se deplasează pe traiectorii liniare cu viteze generate aleatoriu.  

- **Navă spațială:**  
  - Nava este desenată sub formă de triunghi.  
  - Controale din tastatură:  
    - **Săgeți:** deplasare sus, jos, stânga, dreapta cu viteză constantă.  
    - **Z:** rotire spre stânga.  
    - **C:** rotire spre dreapta.  
    - **X:** lansare rachetă în direcția orientării navei.  
  - Deplasare posibilă în toate direcțiile, indiferent de orientare.  

- **Rachete:**  
  - Rachetele sunt vizibile pe parcursul deplasării către asteroizi.  
  - Detectarea coliziunii între rachetă și asteroid reduce numărul de rachete necesare pentru distrugerea acestuia.  
  - Maximum 3 rachete pot fi lansate simultan.  

- **Coliziuni:**  
  - Coliziunea între doi asteroizi determină modificarea traiectoriei lor.  
  - Coliziunea între navă și asteroizi scade numărul de vieți și repornește jocul, până când numărul de vieți ajunge la 0.  

- **Regenerare vieți:**  
  - Distrugerea fiecărui asteroid oferă puncte jucătorului.  
  - La atingerea unui număr prestabilit de puncte, numărul de vieți este actualizat.  

- **Control touchscreen:**  
  - Jocul poate fi controlat prin touchscreen pentru o experiență intuitivă pe dispozitive mobile.  

- **Salvarea scorurilor:**  
  - Cele mai bune 5 scoruri și numele jucătorilor sunt salvate utilizând **Web Storage API**.

## Tehnologii utilizate  
- HTML5 `<canvas>` și `<svg>` pentru grafică.  
- JavaScript pentru logica jocului și interacțiuni.  
- **Web Storage API** pentru salvarea scorurilor.  
- Suport pentru control prin tastatură și touchscreen.  

## Cum să rulezi jocul  
1. Clonează acest repository:  
   ```bash
   git clone https://https://github.com/TudoseRazvan/AsteroidsGame.git
   cd asteroids-game
