function validateNotEmpty(input) {
    return (input && Boolean(input.trim())) || "Cannot be left empty";
}

function validateName(input) {
    const notEmpty = validateNotEmpty(input);
    const pattern = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;

    if (typeof notEmpty === "string") {
        return notEmpty;
    }

    return (
        (input && pattern.test(input)) ||
        "No spaces allowed, only /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$"
    );
}

function validateId(input) {
    const notEmpty = validateNotEmpty(input);
    const pattern = /^[a-z]+(?:-[a-z]+)*$/;
    if (typeof notEmpty === "string") {
        return notEmpty;
    }

    return (
        (input && input.indexOf(" ") < 0 && pattern.test(input)) ||
        "No spaces allowed, only [a-z]+(?:-[a-z]+)*$"
    );
}

module.exports = {
    validateName,
    validateNotEmpty,
    validateId
}