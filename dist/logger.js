"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
/* 日志系统，文件保存在 'log/std.log'*/
exports.logger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({
            filename: 'log/std2.log',
            format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY/MM/DD/HH:mm:ss' }), winston_1.format.prettyPrint(), winston_1.format.printf((info) => `${info.level}-${[info.timestamp]}-${info.message}`)),
        }),
    ],
});
