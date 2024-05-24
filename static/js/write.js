const input = document.getElementById("textarea");

function checkValidation() {
    input.value = inputField.value.replace(/[^a-zA-Z\s]/g, "");
}

function validate() {
    input.value = input.value.trim();
    if (input.value == "") {
        return false;
    } else {
        return true;
    }
}
