export function counter () {
    let d1 = document.getElementById('d1');
    for (let index = 1; index < 10; index*=2) {
        d1.innerHTML += `<h1>${index}</h1>`
    }
}