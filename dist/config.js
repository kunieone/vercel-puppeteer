"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const yaml_1 = require("yaml");
let config = (0, yaml_1.parse)((0, fs_1.readFileSync)('./config.yaml', 'utf-8'));
exports.default = config;
