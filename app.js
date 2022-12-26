import { fetchMovieAvailability, fetchMovieList } from "./api.js";

const mainElement = document.querySelector('main');
const bookerElement = document.querySelector("#booker");

const bookTicketButton = document.querySelector("#book-ticket-btn")



let selectedSeats = [];

const convertToHTML = (htmlInStringFormat) => {
    const element = document.createElement("div");
    element.innerHTML = htmlInStringFormat;
    return element.firstChild;
}

const loader = convertToHTML(`<div class="loader">loading......</div>`)

const onSeatClick = (e) => {
    console.log(e.target.innerText);
    e.target.classList.toggle("selected-seat");

    if (e.target.classList.contains("selected-seat")) {
        selectedSeats.push(e.target.innerText)
    } else {
        selectedSeats = selectedSeats.filter(seat => seat !== e.target.innerText)
    }

    if (selectedSeats.length > 0) {
        bookTicketButton.classList.remove("v-none")
    } else {
        bookTicketButton.classList.add("v-none")
    }


}




const renderSuccessMessage = (mobileNumber, email) => {
    const successMsg = convertToHTML(`<div id="Success" >
    <h4>Booking Details</h4>
    <div>Seats:${selectedSeats.join(",")}</div>
    <div>Phone Number: ${mobileNumber}</div>
    <div>Email: ${email}</div>
    
    </div>`)
    bookerElement.appendChild(successMsg)

}


const onPurchaseButtonClick = (e) => {
    e.preventDefault();
    const mobileNumber = document.querySelector("#mobile").value;
    const email = document.querySelector("#email_movie").value;
    bookerElement.innerHTML = "";
    renderSuccessMessage(mobileNumber, email)


}

const renderConfirmPurchase = () => {
    const form = convertToHTML(`<div id="confirm-purchase">
    <h3>Confirm your booking for seat numbers:${selectedSeats.join(",")}</h3>

    <form id="customer-detail-form">
    <label for="email_movie">Email: </label>
    <input type="email" id="email_movie" required></input></br>
    

    
    <label for="mobile">Phone Number:</label>
    <input type="tel" id="mobile" required></input></br>
  

    <button id="movie_submit_btn" type="submit">Purchase</button>

    </form>
    </div>`);

    bookerElement.appendChild(form)
    const lastButton = document.querySelector("form");
    lastButton.addEventListener("submit", onPurchaseButtonClick)

}

const onBookTicketClick = () => {
    bookerElement.innerHTML = ""
    renderConfirmPurchase();

}
bookTicketButton.addEventListener('click', onBookTicketClick)

const renderTheaterLayout = (listOfUnavaialableSeats = [], showSeatNo = 1) => {
    const bookerGridHolder = document.querySelector("#booker-grid-holder");
    const grid = convertToHTML(`<div class="booking-grid"></div>`)

    let theaterSeats = "";
    for (let i = 0; i < 12; i++) {
        theaterSeats = theaterSeats + `<div  id="booking-grid-${showSeatNo + i}" class= "grid-cell ${listOfUnavaialableSeats.includes(showSeatNo + i) ? "unavailable-seat" : "available-seat"}">${showSeatNo + i}</div>`;
    }
    grid.innerHTML = theaterSeats;
    bookerGridHolder.appendChild(grid)

    document.querySelectorAll(".grid-cell").forEach(cell => cell.addEventListener('click', onSeatClick))


}

const renderMovieTheater = (event) => {

    event.preventDefault();
    console.log(event.target.innerText);


    const movieName = event.target.innerText ? event.target.innerText : event.target.parentElement.innerText;

    document.querySelector('#booker-grid-holder').innerHTML = ''
    bookerElement.appendChild(loader)
    fetchMovieAvailability(movieName).then((listOfUnavaialableSeats) => {
        //   console.log(listOfUnavaialableSeats)

        loader.remove();
        const bookerElementHeader = document.querySelector("#booker h3")
        bookerElementHeader.classList.toggle("v-none")

        renderTheaterLayout(listOfUnavaialableSeats);
        renderTheaterLayout(listOfUnavaialableSeats, 13);

    })


    // const booker = 
}



const renderMoviesList = async () => {
    mainElement.append(loader)
    const moviesList = await fetchMovieList();
    // console.log(moviesList);

    // const moviesHolderElement = document.createElement("div");
    // moviesHolderElement.classList.add("movie-holder");

    const moviesHolderElement = convertToHTML(`<div class="movie-holder"></div>`);

    moviesList.forEach(movie => {
        const movieElement = convertToHTML(`<a class="movie- link" href="${movie.name}">
    <div class="movie" data- d="${movie.name}">
    <div class="movie-img-wrapper" style="background-image:url(${movie.imgUrl}); ">
    </div>
    <h4>${movie.name}</h4>
    </div>
    </a>`)


        movieElement.addEventListener("click", renderMovieTheater)
        moviesHolderElement.appendChild(movieElement);

    });
    loader.remove()
    mainElement.appendChild(moviesHolderElement);

}



renderMoviesList()
