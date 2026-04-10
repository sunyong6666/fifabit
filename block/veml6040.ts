//----------------------------------颜色传感器-------------------------------
const GAIN_R = 0.92
const GAIN_G = 0.94
const GAIN_B = 1.82
enum DetectedColor {
    //% block="红色"
    Red,
    //% block="橙色"
    Orange,
    //% block="黄色"
    Yellow,
    //% block="绿色"
    Green,
    //% block="青色"
    Cyan,
    //% block="蓝色"
    Blue,
    //% block="紫色"
    Purple,
    //% block="白色"
    White,
    //% block="黑色"
    Black
}

// 颜色
enum enRGB {
    //% block="R"
    Red,
    //% block="G"
    Green,
    //% block="B"
    Blue,
}

namespace FIFAbit {
    // ===== VEML6040 I2C 地址 =====
    const VEML6040_ADDR = 0x10

    // ===== 寄存器地址 =====
    const REG_CONF = 0x00
    const REG_RED = 0x08
    const REG_GREEN = 0x09
    const REG_BLUE = 0x0A
    const REG_WHITE = 0x0B

    // ===== 积分时间 =====
    const IT_320MS = 0x30

    // ===== 自动 / 强制 =====
    const AF_AUTO = 0x00
    const SD_ENABLE = 0x00

    let veml_initialized = false

    function setConfiguration() {
        let buf = pins.createBuffer(3)
        buf[0] = REG_CONF;
        buf[1] = IT_320MS | AF_AUTO | SD_ENABLE;
        buf[2] = 0;
        pins.i2cWriteBuffer(VEML6040_ADDR, buf, false);
    }

    //读取颜色值
    function readReg(reg: number): number {
        let regBuf = pins.createBuffer(1)
        regBuf[0] = reg

        pins.i2cWriteBuffer(VEML6040_ADDR, regBuf, true)
        basic.pause(5)

        let data = pins.i2cReadBuffer(VEML6040_ADDR, 2, false)

        return data[0] | (data[1] << 8)
    }

    let cacheR = 0
    let cacheG = 0
    let cacheB = 0
    let cacheW = 0

    let lastReadTime = 0
    const READ_INTERVAL = 320

    function updateRGB() {

        if (!veml_initialized) {
            init_veml()
        }

        let now = control.millis()

        // 控制读取频率
        if (now - lastReadTime < READ_INTERVAL) return

        let s = readReg(REG_RED)
        let h = readReg(REG_GREEN)
        let c = readReg(REG_BLUE)
        let w = readReg(REG_WHITE)

        // 防止异常值
        if (s == 0 && h == 0 && c == 0 && w == 0) return

        cacheR = s
        cacheG = h
        cacheB = c
        cacheW = w
        //serial.writeLine("R=" + s + " G=" + h + " B=" + c + " W=" + w)

        lastReadTime = now
    }

    //判断颜色（无作用）
    // export function getColor(): DetectedColor {
    //     updateRGB()

    //     let t = cacheR
    //     let m = cacheG
    //     let d = cacheB
    //     let a = cacheW

    //     // ===== 黑 / 白 优先 =====
    //     if (a < 50) return DetectedColor.Black

    //     if (a > 2000 && Math.abs(t - m) < 200 && Math.abs(m - d) < 200) {
    //         return DetectedColor.White
    //     }

    //     let rgb3 = [t, m, d]

    //     let minDist = 999999
    //     let result = DetectedColor.White

    //     // ⭐ 样本（你可以自己调）
    //     let samples: { color: DetectedColor, rgb: number[] }[] = [
    //         { color: DetectedColor.Red, rgb: [5000, 2000, 1000] },
    //         { color: DetectedColor.Green, rgb: [6000, 5000, 2000] },
    //         { color: DetectedColor.Blue, rgb: [3000, 3000, 2000] },
    //         { color: DetectedColor.Yellow, rgb: [4000, 4000, 500] },
    //         { color: DetectedColor.Purple, rgb: [3000, 800, 3000] }

    //     ]

    //     for (let u of samples) {

    //         let dr = t - u.rgb[0]
    //         let dg = m - u.rgb[1]
    //         let db = d - u.rgb[2]

    //         let dist = Math.sqrt(dr * dr + dg * dg + db * db)

    //         if (dist < minDist) {
    //             minDist = dist
    //             result = u.color
    //         }
    //     }

    //     return result
    // }

    

    
    

    //% blockId=init_veml
    //% block="init VEML6040"
    //% group="Color Sensor" weight=39
    export function init_veml(): void {
        if (!veml_initialized) {
            setConfiguration();
            // 等待时间
            basic.pause(320);
            veml_initialized = true
        }
    }

    //% blockId=isColorDetected
    //% block="识别到颜色 %color"
    //% group="Color Sensor" weight=38
    // export function isColorDetected(color: DetectedColor): boolean {
    //     return getColor() == color
    // }
    
    //% blockId=readRGBValue
    //% block="读取 %channel 值"
    //% group="Color Sensor" weight=37
    export function readRGBValue(channel: enRGB): number {

        updateRGB()

        if (cacheW == 0) return 0

        // =====白光归一化 =====
        let r = cacheR / cacheW
        let g = cacheG / cacheW
        let b = cacheB / cacheW

        // ===== 通道校正（数据拉伸） =====
        r *= GAIN_R
        g *= GAIN_G
        b *= GAIN_B

        // ===== 直接映射 =====
        let nr = Math.round(r * 255)
        let ng = Math.round(g * 255)
        let nb = Math.round(b * 255)

        nr = Math.min(255, Math.max(0, nr))
        ng = Math.min(255, Math.max(0, ng))
        nb = Math.min(255, Math.max(0, nb))

        switch (channel) {
            case enRGB.Red: return nr
            case enRGB.Green: return ng
            case enRGB.Blue: return nb
            default: return 0
        }

        

         // updateRGB()

        // // ⭐ 需要你实际测一下（很重要）
        // const MAX_R = 6000
        // const MAX_G = 2600
        // const MAX_B = 2200

        // let nr = Math.round(cacheR * 255 / MAX_R)
        // let ng = Math.round(cacheG * 255 / MAX_G)
        // let nb = Math.round(cacheB * 255 / MAX_B)

        // // 限制范围
        // if (nr > 255) nr = 255
        // if (ng > 255) ng = 255
        // if (nb > 255) nb = 255

        // switch (channel) {
        //     case enRGB.Red: return nr
        //     case enRGB.Green: return ng
        //     case enRGB.Blue: return nb
        //     default: return 0
        // }

    }

    //% blockId=readWhiteValue
    //% block="读取亮度值"
    //% group="Color Sensor" weight=36
    export function readWhiteValue(): number {
        updateRGB()

        let nw = Math.round(cacheW * 255 / 65535)

        if (nw > 255) nw = 255
        if (nw < 0) nw = 0

        return nw
    }

    function max3(a: number, b: number, c: number): number {
        let m = a
        if (b > m) m = b
        if (c > m) m = c
        return m
    }

    function min3(a: number, b: number, c: number): number {
        let m = a
        if (b < m) m = b
        if (c < m) m = c
        return m
    }

    // ===== ⭐ 学习阶段（前50次）=====
    // if (learnCount < 50) {
    //     learnR += r
    //     learnG += g
    //     learnB += b
    //     learnCount++

    //     serial.writeLine("Learning... " + learnCount)
    //     return 0
    // }

    // // ===== ⭐ 计算平均值 =====
    // let avgR = learnR / learnCount
    // let avgG = learnG / learnCount
    // let avgB = learnB / learnCount

    // // ===== ⭐ 计算增益 =====
    // let gainR = 1 / avgR
    // let gainG = 1 / avgG
    // let gainB = 1 / avgB

    // // ===== ⭐ 应用增益 =====
    // r *= gainR
    // g *= gainG
    // b *= gainB

    // // ===== 归一到最大值（避免溢出）=====
    // let max = max3(r, g, b)
    // if (max > 0) {
    //     r /= max
    //     g /= max
    //     b /= max
    // }

    // // ===== 转 0~255 =====
    // let nr = Math.round(r * 255)
    // let ng = Math.round(g * 255)
    // let nb = Math.round(b * 255)

    // // ===== 打印结果（关键）=====
    // serial.writeLine(
    //     "GAIN R=" + gainR +
    //     " G=" + gainG +
    //     " B=" + gainB
    // )

    // switch (channel) {
    //     case enRGB.Red: return nr
    //     case enRGB.Green: return ng
    //     case enRGB.Blue: return nb
    //     default: return 0
    // }
}

