import { readFileSync } from 'fs'
import { parse } from 'yaml'
type Devices = 'mac' | 'linux'
type PuppeConfig = {
    // ** puppeteer launch option begin
    data_path: string
    headless: boolean
    mac_chrome_path: string
    linux_chrome_path: string
    // ** puppeteer launch option end
    video_dir: string
    ph_dir: string
    device: Devices
    key_words: string[]
    video_prefix: string
    prefix: string[]
    comments: string[]
    self_comments: string[]
}

let config: PuppeConfig = parse(readFileSync('./config.yaml', 'utf-8'))
export default config
