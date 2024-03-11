document.addEventListener('DOMContentLoaded', function(){
    // steps
    let step = 1;
    let stepOne = document.getElementById('stepOne');
    let stepTwo = document.getElementById('stepTwo');
    let stepThree = document.getElementById('stepThree');

    let stepOneButton = document.getElementById('stepOneButton');
    let stepTwoButton = document.getElementById('stepTwoButton');
    let stepThreeButton = document.getElementById('stepThreeButton');
    let connectorOne = document.getElementById('connectorOne');
    let connectorTwo = document.getElementById('connectorTwo');
    stepChanged();

    stepOneButton.addEventListener('click', function(){
        step = 1;
        stepChanged();
    });
    stepTwoButton.addEventListener('click', function(){
        step = 2;
        stepChanged();
    });
    stepThreeButton.addEventListener('click', function(){
        step = 3;
        stepChanged();
    });

    document.querySelectorAll('.next-button').forEach(button => {
        button.addEventListener('click', function(){
            step += 1;
            stepChanged();
        })
    });
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function(){
            step -= 1;
            stepChanged();
        })
    });


    function stepChanged(){
        if (step < 1){
            step = 1;
        }
        else if (step > 3){
            step = 3;
        }
        switch (step){
            case 1:
                stepOne.classList.remove('hidden');
                stepTwo.classList.add('hidden');
                stepThree.classList.add('hidden');

                stepOneButton.classList.add('completed-step');
                stepTwoButton.classList.remove('completed-step');
                stepThreeButton.classList.remove('completed-step');
                connectorOne.classList.remove('completed-step');
                connectorTwo.classList.remove('completed-step');
                break;
            case 2:
                stepTwo.classList.remove('hidden');
                stepOne.classList.add('hidden');
                stepThree.classList.add('hidden');

                stepOneButton.classList.add('completed-step');
                stepTwoButton.classList.add('completed-step');
                stepThreeButton.classList.remove('completed-step');
                connectorOne.classList.add('completed-step');
                connectorTwo.classList.remove('completed-step');

                defaultTaxes();
                housePayment();
                break;
            case 3:
                stepThree.classList.remove('hidden');
                stepOne.classList.add('hidden');
                stepTwo.classList.add('hidden');

                stepOneButton.classList.add('completed-step');
                stepTwoButton.classList.add('completed-step');
                stepThreeButton.classList.add('completed-step');
                connectorOne.classList.add('completed-step');
                connectorTwo.classList.add('completed-step');

                defaultExpenses();
                chart();
                break;
        }
    }   

    // calculations
    let moneyLeftOne = document.getElementById('moneyLeftOne');
    let netIncome = 0;
    let moneyLeftTwo = document.getElementById('moneyLeftTwo');
    let moneyLeftThree = document.getElementById('moneyLeftThree');
    // step 1
    document.getElementById('grossMonthly').addEventListener('input', function(){
        grossMonthly = document.getElementById('grossMonthly').value;
        moneyLeftOne.innerText = grossMonthly;
    });
    // step 2
    let taxes = {
        federal: document.getElementById('federalTaxes'),
        state: document.getElementById('stateTaxes'),
        socialSecurity: document.getElementById('socialSecurity'),
        medicare: document.getElementById('medicare'),
        stateDisability: document.getElementById('stateDisability'),
        retirement: document.getElementById('retirement'),
        medInsurance: document.getElementById('medicalInsurance'),
        other: document.getElementById('otherTaxes'),
    };
    let totalTaxes = document.getElementById('totalTaxes');
    let maxHousePayment = document.getElementById('maxHousePayment');

    for (tax of Object.values(taxes)){
        tax.addEventListener('input', function(){
            totalTaxes.innerText = deductingTaxes(grossMonthly);
        });
    }

    function defaultTaxes(){
        taxes.federal.value = Number((grossMonthly * 0.12).toFixed(2));
        taxes.state.value = Number((grossMonthly * 0.07).toFixed(2));
        taxes.socialSecurity.value = Number((grossMonthly * 0.062).toFixed(2));
        taxes.medicare.value = Number((grossMonthly * 0.0145).toFixed(2));
        taxes.stateDisability.value = Number((grossMonthly * 0.01).toFixed(2));
        taxes.retirement.value = Number((grossMonthly * 0.05).toFixed(2));
        taxes.medInsurance.value = Number((grossMonthly * 0.03).toFixed(2));
        taxes.other.value = 0;
        totalTaxes.innerText = deductingTaxes(grossMonthly);
    }
    function deductingTaxes(grossIncome){
        let currIncome = grossIncome;
        for (tax of Object.values(taxes)){
            currIncome = currIncome - Number(tax.value);
        }
        netIncome = currIncome;
        moneyLeftTwo.innerText = netIncome.toFixed(2);
        return Number((grossIncome - currIncome).toFixed(2));
    }
    function housePayment(){
        maxHousePayment.innerText = Number((grossMonthly * 0.33).toFixed(2));
    }

    // step 3
    let totalExpenses = document.getElementById('totalExpenses');

    let expenses = {
        savings: document.getElementById('savings'),
        loans: document.getElementById('studentLoans'),
        housingAndInsurance: document.getElementById('housingInsurance'),
        utilities: document.getElementById('utilities'),
        transportation: document.getElementById('transportation'),
        food: document.getElementById('food'),
        clothingAndSelfcare: document.getElementById('clothingSelfcare'),
        media: document.getElementById('media'),
        entertainment: document.getElementById('entertainment'),
        other: document.getElementById('otherExpenses'),
    };

    for (expense of Object.values(expenses)){
        expense.addEventListener('input', function(){
            totalExpenses.innerText = deductingExpenses();
            chart();
        });
    }

    function defaultExpenses(){
        expenses.savings.value = Number((netIncome * 0.10).toFixed(2));
        expenses.loans.value = Number((netIncome * 0.10).toFixed(2));
        expenses.housingAndInsurance.value = Number((netIncome * 0.30).toFixed(2));
        expenses.utilities.value = Number((netIncome * 0.10).toFixed(2));
        expenses.transportation.value = Number((netIncome * 0.05).toFixed(2));
        expenses.food.value = Number((netIncome * 0.10).toFixed(2));
        expenses.clothingAndSelfcare.value = Number((netIncome * 0.10).toFixed(2));
        expenses.media.value = Number((netIncome * 0.10).toFixed(2));
        expenses.entertainment.value = Number((netIncome * 0.05).toFixed(2));
        expenses.other.value = 0;
        totalExpenses.innerText = deductingExpenses();
    }

    function deductingExpenses(){
        let currIncome = 0;
        for (expense of Object.values(expenses)){
            currIncome = currIncome + Number(expense.value);
        }
        moneyLeftThree.innerText = (netIncome - currIncome).toFixed(2);
        return Number(currIncome.toFixed(2));
    }
    // chart code below, used chart.js. https://www.w3schools.com/js/tryit.asp?filename=trychartjs_doughnut copied and modified this code
    let myChart;
    let xValues;
    let yValues;
    let barColors;
    function chart(){
        if(myChart){
            myChart.destroy();
        }


        Chart.defaults.global.defaultFontFamily = 'Roboto Condensed';

        xValues = ["Extra", "Savings", "Loans", "Housing & Insurance", "Utilities",
         "Transportation", "Food", "Clothing/Self-Care", "Media", "Entertainment", "Other"];
        console.log(Math.round(Math.round((expenses.housingAndInsurance.value / netIncome) * 100)));
        yValues = [
            extraMoney(), 
            Math.round((expenses.savings.value / Number(totalExpenses.innerText)) * 100), 
            Math.round((expenses.loans.value / Number(totalExpenses.innerText)) * 100), 
            Math.round((expenses.housingAndInsurance.value / Number(totalExpenses.innerText)) * 100), 
            Math.round((expenses.utilities.value / Number(totalExpenses.innerText)) * 100), 
            Math.round((expenses.transportation.value / Number(totalExpenses.innerText)) * 100), 
            Math.round((expenses.food.value / Number(totalExpenses.innerText)) * 100), 
            Math.round((expenses.clothingAndSelfcare.value / Number(totalExpenses.innerText)) * 100),
            Math.round((expenses.media.value / Number(totalExpenses.innerText)) * 100), 
            Math.round((expenses.entertainment.value / Number(totalExpenses.innerText)) * 100),
            Math.round((expenses.other.value / Number(totalExpenses.innerText)) * 100)
        ];
        barColors = [
        "#d3d3d3 ",
        "#76E6FF",
        "#FF76C0",
        "#9BAB81",
        "#370982",
        "#FF5F5F",
        "#C2FF5F",
        "#294E95",
        "#2A0510",
        "#FFC0D3",
        "#2A75AB",
        ];
        myChart = new Chart("myChart", {
        type: "doughnut",
        data: {
            labels: xValues,
            datasets: [{
            backgroundColor: barColors,
            hoverBackgroundColor: barColors,
            data: yValues
            }]
        },
        options: {
            title: {
            display: false
            },
            legend: {
                display: false
            }
        }
        });
    }
    function extraMoney(){
        let remaining = netIncome;
        for (expense of Object.values(expenses)){
            remaining = remaining - expense.value;
        }
        if (remaining >= 0){
            return Math.round((remaining / netIncome) * 100);
        }
        else{
            return 0;
        }
    }
});