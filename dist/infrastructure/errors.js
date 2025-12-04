"use strict";
class MissingFieldsError extends Error {
    constructor(message, ...missingFields) {
        super(message);
        this.missingFields = missingFields;
    }
    getMissingFields() {
        return this.missingFields;
    }
}
