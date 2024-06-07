$('input[name="phone"]').mask("+375(99)999-99-99");
function openCity(cityName) {
    let i;
    let x = document.getElementsByClassName("city");
    let y = cityName.length
    document.getElementById('services1').classList.add('button_green1');
    document.getElementById('services2').classList.add('button_green1');
    for (i = 0; i < x.length; i++) {

        x[i].style.display = "none";
        if(y>5){
            document.getElementById('services1').classList.remove('button_green1');
        }
        else {
            document.getElementById('services2').classList.remove('button_green1');
        }
    }
    document.getElementById(cityName).style.display = "block";
}
