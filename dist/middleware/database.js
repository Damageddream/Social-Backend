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
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDb = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mongoDB = process.env.DB_KEY;
    try {
        yield mongoose_1.default.connect(mongoDB);
        next();
    }
    catch (error) {
        console.error("failed to connect to to MongoDB", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.default = connectToDb;
//# sourceMappingURL=database.js.map