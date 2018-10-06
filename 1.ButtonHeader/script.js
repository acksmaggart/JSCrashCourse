document.addEventListener("DOMContentLoaded", ()=>{
   run();
});


function run() {
    const button = document.getElementById('button');
    const input = document.getElementById('input');
    const header = document.getElementById('header');

    button.addEventListener('click', (event)=>{
        header.innerText = input.value;
        input.value = '';
    });
}