ce sa vorbesc cu proful?

 - ce sa scrie la introducere/descrierea problemei
 - daca este ok faptul ca ai facut o pagina web care acceseaza doua endpoint-uri de pe un api extern (books API)
si de pe api-ul creat de tine pentru a accesa baza de date de mysql

# Proiect cloud computing
## Aplicatie web pentru gestionat carti favorite
Paula Biciusca

## Introducere



## Descreierea problemei



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


### Back-end
Urmatoarea portiune va prezenta fragmentele de cod relevante back-end-ului
Acesta este functia care se ocupa de procesarea request-ului de pe metoda GET a API-ului creat de mine. Serverul va
![GET favorite endpoint](https://raw.githubusercontent.com/PaulaBiciusca/ProiectPaulaBiciuscaCloudComputing/master/assets/Get%20favorite%20endpoint.JPG)


## Referinte
https://developer.nytimes.com/docs/books-product/1/overview
