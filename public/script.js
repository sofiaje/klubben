let changeInfo = document.getElementById("changeInfo")
let changeInfoForm = document.getElementById("changeInfoForm")

if (changeInfo) {
    changeInfo.addEventListener("click", () => {
        changeInfoForm.classList.toggle("hidden")
    })
}