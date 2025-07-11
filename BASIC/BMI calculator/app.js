const btn = document.getElementById("calculate");
const bmiInput = document.getElementById("inp");
const weightInp = document.getElementById("weight-condition");

function calculateBMI(){
    const height = document.getElementById("iph").value / 100;
    const weight = document.getElementById("ipw").value;

    const bmiVal = weight / (height * height);
    bmiInput.value = bmiVal;

    if(bmiVal < 18.5){
        weightInp.innerText = "Under Weight";
    }
    else if (bmiVal >= 18.5 && bmiVal <= 24.9){
        weightInp.innerText = "Normal weight";
    }
    else if (bmiVal >= 25 && bmiVal <= 29.9){
        weightInp.innerText = "Over Weight";
    }
    else if (bmiVal >= 30 ){
        weightInp.innerText = "Obesity";
    }

}

btn.addEventListener("click", calculateBMI);