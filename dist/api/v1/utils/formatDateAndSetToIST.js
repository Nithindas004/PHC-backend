"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateAndSetToIST = void 0;
const formatDateAndSetToIST = (date) => {
    const istDate = date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
    return istDate;
};
exports.formatDateAndSetToIST = formatDateAndSetToIST;
