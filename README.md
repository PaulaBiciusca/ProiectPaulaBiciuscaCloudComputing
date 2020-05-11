# Proiect cloud computing
## Aplicatie web pentru gestionat carti favorite
Paula Biciusca

## Introducere

Aplicatia a fost gandita pentru a ajuta iubitorii de carti sa isi gestioneze si salveze titlurile cartilor favorite din New York Times Book Review, fiind una dintre cele mai influente și mai citite publicații de recenzii de carte. Astfel cu ajutorul lui BooksAPI si propriului API am putut adauga si sterge intr-o lista proprie cele mai bune carti in functie de categorie, usurand accesul cititorilor la informatii precum titlul, autorul si recenziile cartilor preferate.

## Descreierea problemei

Problema pe care doresc sa o adresez prin urmatoarea aplicatie web este dificultatea cu care pot regasi o carte pe care am descoperit-o pe pagina celor de la New York Times book review, atat prin faptul ca listele au dimensiuni mari, cat si prin faptul ca lista este actualizata saptamanal, ceea ce poate elimina o carte pe care as fi dorit sa o citesc de pe primele pagini, si ingreunand astfel gasirea ei, mai ales daca am uitat anumite detalii despre ea.

## Descriere API
API-urile utilizate de aceasta aplicatie web sunt BooksAPI si propriul API creat pentru a gestiona baza de date.
Primul API, creat de dezvoltatorii de la New York Times, ofera informatii referitoare la recenzii de carti si top-ul celor mai bune carti in functie de categorie. In aceast proiect am utilizat doua end point-uri: cel care ofera o lista cu numele categoriilor disponibile (/lists/names.json) si cel care returneaza cele mai bune 15 carti in functie de categorie, lista ce se actualizeaza saptamanal.
API-ul creat de mine are scopul de a stoca, returna si sterge inregistrarile dintr-o baza de date la care are acces, informatii referitoare la cartile pe care utilizatorul le-a marcat ca fiind favorite, pentru a le accesa ulterior.


## Flux de date
Primul end point folosit din Books API a fost "https://api.nytimes.com/svc/books/v3/lists/names.json", request-ul acestuia accepta medota GET, fara parametri sau body.
Acesta va returna un JSON ce contine urmatoarele: statusul raspunsului, drepturile autorului, numarul de rezultate si lista de rezultate. Fiecare element al listei de rezultate are urmatoare structura, dupa cum urmeaza: 
```
 {
      "list_name": "Travel",
      "display_name": "Travel",
      "list_name_encoded": "travel",
      "oldest_published_date": "2014-09-07",
      "newest_published_date": "2017-01-15",
      "updated": "MONTHLY"
 }
```

Al doilea endpoint este https://api.nytimes.com/svc/books/v3/lists.json, acesta accepta de asemenea doar metoda GET, insa request-ul are un parametru obligatoriu pe query numit "list", astfel ca request-ul final are urmatoarea structura: https://api.nytimes.com/svc/books/v3/lists.json?list=<numeLista> , si returneaza o lista cu cele mai bune carti din acea categorie, dupa cum urmeaza:

```
{
      "list_name": "Hardcover Fiction",
      "display_name": "Hardcover Fiction",
      "bestsellers_date": "2020-05-02",
      "published_date": "2020-05-17",
      "rank": 1,
      "rank_last_week": 0,
      "weeks_on_list": 1,
      "asterisk": 0,
      "dagger": 0,
      "amazon_product_url": "https://www.amazon.com/dp/0385545932?tag=NYTBSREV-20&tag=NYTBS-20",
      "isbns": [
        {
          "isbn10": "0385545932",
          "isbn13": "9780385545938"
        },
        {
          "isbn10": "0593168615",
          "isbn13": "9780593168615"
        },
        {
          "isbn10": "0593168429",
          "isbn13": "9780593168424"
        },
        {
          "isbn10": "0593215141",
          "isbn13": "9780593215142"
        }
      ],
      "book_details": [
        {
          "title": "CAMINO WINDS",
          "description": "The line between fact and fiction becomes blurred when an author of thrillers is found dead after a hurricane hits Camino Island.",
          "contributor": "by John Grisham",
          "author": "John Grisham",
          "contributor_note": "",
          "price": 0,
          "age_group": "",
          "publisher": "Doubleday",
          "primary_isbn13": "9780385545938",
          "primary_isbn10": "0385545932"
        }
      ],
      "reviews": [
        {
          "book_review_link": "",
          "first_chapter_link": "",
          "sunday_review_link": "",
          "article_chapter_link": ""
        }
      ]
    }
```
Un ultim element de notat la acest API este modul de autorizare, acesta fiind facut prin utilizarea unui API key ce poate fi luat de pe pagina principala, dupa ce iti faci cont si iti generezi unul. Cheia respectiva trebuie introdusa in query-ul fiecarui endpoint folosit sub parametrul "api-key". Astfel forma corecta a request-ului catre cele doua end point-uri este: https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=<cheiaGenerata> si https://api.nytimes.com/svc/books/v3/lists.json?list=<numeLista>&api-key=<cheiaGenerata>.

Primul end point creat pentru API-ul meu este cel care afiseaza toate inregistrarile din tabela "Favorite" a bazei de date.
Acesta are urmatoarea cale: "<adresa_api>/favorite" folosind metoda GET, iar raspunsul, ce are status code-ul 200 (Ok), are ca body un JSON ce contine o lista cu elemente ce au urmatoarele atribute: id, titlu, autor, url, createdAT, updateAt; dupa cum se poate vedea in urmatorul exemplu de element:
 
 ```
 {
  "id":9,
  "titlu":"IF IT BLEEDS",
  "autor":"Stephen King",
  "url":"https://www.amazon.com/dp/1982137975?tag=NYTBSREV-20&tag=NYTBS-20",
  "createdAt":"2020-05-09T11:16:14.000Z",
  "updatedAt":"2020-05-09T11:16:14.000Z"
 }
 ```
Al doilea end point are acelasi path (<adresa_api>/favorite), dar pe metoda POST si cu un request body ce trebuie sa contina titlul, autorul si url-ul cartii, dupa cum se poate vedea in urmatorul exemplu:
 
 ```
 {
	"titlu": "IF IT BLEEDS",
	"autor": "Stephen King",
	"url": "https://www.tr.com/dp/1982137975?tag=NYTBSREV-20&tag=NYTBS-20"
}
 ```
Acesta are scopul de a verifica daca titlul cartii deja exista in tabela "Favorite", iar daca acesta nu exista, sa insereze o noua inregistrare. In situatia in care inserarea a fost realizata cu succes va raspunde cu status code-ul 201 (Created) si cu un body reprezentat de noul obiect inserat, altfel va returna 500 (Internal server error). In situatia in care titlul deja exista in baza de date, raspunsul va avea codul 409 (Conflict), pe care aplicatia il va procesa mai departe pentru a informa utilizatorul.

Ultimul end point creat are calea "<adresa_api>/favorite/<titlu>" cu metoda DELETE si are scopul de a sterge din tabela "Favorite" inregistrarea care are titlul din cale. Daca elementul a fost gasit, si stergerea a fost realizata cu succes, raspunsul va avea codul 204 (No content), iar daca titlul nu a fost gasit in tabela - 404 (Not found). In orice alta situatie se va returna 500.

## Capturi ecran aplicație

### Front-end
In acest sub-capitol voi prezenta fragmentele de cod ce se regasesc in cele doua fisiere HTML din folder-ul frontend: index si favorite.

Ambele fisiere importa scriptul axios pentru a putea face request-uri la API-uri, si Jquery pentru a profita de sintaxa mult mai usoara in comparatie cu Javascript.
De asemenea am folosit functia "ready" pentru a rula metoda "afiseazaCategorie" dupa ce se incarca documentul in browser.

![Importare librarii si .ready](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/Importare%20librarii%20si%20.ready%20.JPG)

Fig. 1

Functia afiseaza categorie apeleaza endpoint-ul de pe BooksAPI pentru a obtine lista cu categorii oferita de baza de date a celor de la NYT. Pe baza numelui de afisare si a codului url vom popula selectul cu optiuni.

![Afiseaza categorie](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/Afiseaza%20categorie.JPG)

Fig. 2

Cand functia din figura 3 este apelata, aceasta va face apel la endpoint-ul de pe BooksAPI pentru a obtine lista de carti din categoria trimisa ca parametru, ea returnand un JSON ce reprezinta o lista cu date despre carti. Pe baza url-ului, titlului, autorului si descrierii vom popula tabela noastra cu randuri, la finalul carora vom genera un buton ce va apela metoda "adaugaFavorite(titlu, autor, url)

![Afiseaza carti](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/Afiseaza%20carti.JPG)

Fig. 3

Functia urmatoare apeleaza cu metoda POST endpoint-ul "/favorite" al API-ului creat de noi, daca primiste status code 409(Conflict) acesta va afisa o alerta care atentioneaza utilizatorul ca respectiva carte a fost deja adaugata in lista de favorite.

![Adauga favorite](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/Adauga%20favorite.JPG)

Fig. 4

Functia din figura 5 apeleaza cu metoda GET endpoint-ul "/favorite" in urma caruia va popula tabela de pe pagina cu datele preluate din API.

![Afiseaza favorite](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/Afiseaza%20favorite.JPG)

Fig. 5

Urmatoare functie apeleaza cu metoda DELETE endpoint-ul "/favorite", dupa care apeleaza functia "afiseazaFavorite".

![Sterge favorite](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/Sterge%20favorite.JPG)

Fig. 6

### API
Urmatoarea portiune va prezenta fragmentele de cod relevante API-ului.

Portiunea de cod din figura 7 reprezinta instantierea obiectului Sequelize, ce va permite accesarea bazei de date mySQL, in urma connectarii cu contul creat anterior si bash.

![Instantiere obiect sequelize](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/Instantiere%20obiect%20sequelize.JPG)

Fig. 7

Figura 8 arata modul cum am definit un model, ceea ce reprezinta o tabela in baza de date. Tabela contine trei campuri: titlu, autor si url.

![Definire tabela favorite](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/definire%20tabela%20favorite.JPG)

Fig. 8

Urmatoare imagine reprezinta endpoint-ul care se ocupa de procesarea request-ului de pe metoda GET a API-ului creat de mine. Serverul va utiliza obiectul sequelize pentru a cauta toate intrarile din tabela "favorite", dupa care le va returna sub forma de JSON.

![GET favorite endpoint](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/Get%20favorite%20endpoint.JPG)

Fig. 9

Figura 10 prezinta procesul urmat de API in urma unui request de tip POST pe "/favorite". Acesta va cauta numarul de inregistrari din tabela care au titlul identic cu cel dat in request body. Daca numarul este <=0, se va insera o noua inregistrare; daca este >0, se va returna un raspuns cu codul 409(Conflict).

![Post favorite](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/Post%20favorite.JPG)

Fig. 10

Figura 11 arata endpoint-ul care sterge toate inregistrarile din tabela care au titlul identic cu parametrul aflat in query al request-ului.

![Delete favorite](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/delete%20favorite.JPG)

Fig. 11

## Referinte
https://developer.nytimes.com/docs/books-product/1/overview
