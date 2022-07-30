import { createLogger, format, transports } from 'winston'
/* 日志系统，文件保存在 'log/std.log'*/
export const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({
            filename: 'log/std2.log',
            format: format.combine(
                format.timestamp({ format: 'YYYY/MM/DD/HH:mm:ss' }),
                format.prettyPrint(),
                format.printf(
                    (info) =>
                        `${info.level}-${[info.timestamp]}-${info.message}`
                )
            ),
        }),
    ],
})
