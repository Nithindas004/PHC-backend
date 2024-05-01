"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomItemsFromArray = void 0;
const getRandomItemsFromArray = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
exports.getRandomItemsFromArray = getRandomItemsFromArray;
