let grossMonthly = 0;
let careerIdArray = [];
let utils = {}; //create a namespace for our utility functions

//get function to make an HTTP GET request
utils.get = (url) => {

    //start promise object
    return new Promise(function (resolve, reject) {

        //create a new XMLHttpRequest object
        let request = new XMLHttpRequest();

        //initialize the request
        request.open('GET', url);

        request.onload = function () {
            //resolve on success
            if (request.status == 200) { // HTTP: OK
                console.log('Response OK');
                resolve(request.response);
            }
            //reject on error
            else {
                reject(Error(`promise error with ${request.status}`))
            }
        };
        //handle network errors
        request.onerror = function (error) {
            reject(Error(`Network Error with ${url}: ${error}`))
        };
        //send the request
        request.send();
    }); //end Promise Object
}

//getJSON function to get JSON data from the server
utils.getJSON = async function (url) {
    let string = null;
    //get the JSON string from the server
    try {
        string = await utils.get(url);
    }
    catch (error) {
        console.log(error)
    }
    //parse the JSON string and return the data
    let data = JSON.parse(string);
    return data;
}

async function init() {
    //get the careerList element of the web page
    let careerList = document.querySelector('#careerList');

    //create a variable to hold the URL of the JSON data source
    let url = 'https://eecu-data-server.vercel.app/data/2024';

    //create a variable to hold the JSON data
    let occupations = null; 
    
    //try to retrieve the JSON data from the server
    try {
        //retrieve the JSON data from the server
        occupations = await utils.getJSON(url);
    }
    //catch any errors and display them in the careerList element
    catch(error){
        careerList.style.color = 'red';
        careerList.textContent = `error: ${error}`;
    }

    //show JSON data on the html page
    careerList.innerHTML = buildList(occupations);

    // Make radio buttons work
    for (let id of careerIdArray){
        document.getElementById(id).addEventListener("click", function(){
            grossMonthly = Number((Number(document.querySelector(`[for = ${id}] span:nth-of-type(2)`).innerText.replace(/\D/g, '')) / 12).toFixed(2));
            document.getElementById("grossMonthly").value = grossMonthly;
            moneyLeftOne.innerText = grossMonthly;
        })
    }
}

function buildList(jobs) {
    //create an empty string to hold the HTML
    let html = '';

    //loop through the array of job objects retrieved from the JSON data
    for (let job of jobs) {
        //start an HTML section for each job
        html += '<div>';
        let id = `${job.occupation.replace(/\W/g, "")}`;
        careerIdArray.push(id);
        /* An alternative way of looping through each item in the data, not as useful for this assignment but something to keep in mind for a story? ... */
        //loop through each entry and create a div for each key:value pair
        // for (let key in job) {
        //     html += `<div><strong>${key}</strong>: ${job[key]}</div > `;
        // }

        //create a div element for the job title
        html += `<input type="radio" id="${id}" name="career">`;
        //create a div element for the salary and format it as currency
        html += `<label for="${id}"><span>${job.occupation}</span> <span>$${job.salary.toLocaleString('en-US')}</span></label>`;
        //close the section
        html += '</div>';
    }

    //return the completed html
    return html;
}
//initialize the web page when the DOM is ready
document.addEventListener('DOMContentLoaded', init);