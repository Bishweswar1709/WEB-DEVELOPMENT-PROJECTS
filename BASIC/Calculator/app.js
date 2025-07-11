let inp = document.getElementById("input");
let button = document.querySelectorAll("button");


let str = "";
let arr = Array.from(button);


arr.forEach(button => {
    button.addEventListener("click",(e) => {
        if(e.target.innerHTML == "="){
            str = eval(str);
            inp.value = str;
        }
        else if (e.target.innerHTML == "DEL"){
            str = str.slice(0, -1);
            inp.value = str;
        }
        else if (e.target.innerHTML == "AC"){
            str = "";
            inp.value = str;
        }
        else if (e.target.innerHTML == "%") {
            if (str !== "") {
                str = (parseFloat(str) / 100).toString();
                inp.value = str;
            }
        }
        else {
            str += e.target.innerHTML;
            inp.value = str;
        }
    })
})