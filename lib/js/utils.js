export function isKeyDownNumber (evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;

    if (evt.target.selectionStart === 0 && charCode === 35) {
        return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }

    return true;
}