"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const workerRouter_1 = require("./api/v1/routes/workerRouter");
const db_1 = require("./api/v1/db/db");
const http_1 = __importDefault(require("http"));
const formatDateAndSetToIST_1 = require("./api/v1/utils/formatDateAndSetToIST");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const adminRouter_1 = require("./api/v1/routes/adminRouter");
//configure env variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 3000;
//middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use("/api/v1/worker", workerRouter_1.workerRouter);
app.use("/api/v1/admin", adminRouter_1.adminRouter);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const test = new Date("2023-06-10 11:38:51.785");
    const date1 = yield (0, formatDateAndSetToIST_1.formatDateAndSetToIST)(date);
    const date2 = yield (0, formatDateAndSetToIST_1.formatDateAndSetToIST)(test);
    console.log(date1 === date2);
    res.json({ date1, date2 });
}));
server.listen(PORT, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`);
    (0, db_1.dbConnection)();
});
