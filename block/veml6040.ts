//----------------------------------颜色传感器-------------------------------
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
    export function getColor(): DetectedColor {
        updateRGB()

        let t = cacheR
        let m = cacheG
        let d = cacheB
        let a = cacheW

        // ===== 黑 / 白 优先 =====
        if (a < 50) return DetectedColor.Black

        if (a > 2000 && Math.abs(t - m) < 200 && Math.abs(m - d) < 200) {
            return DetectedColor.White
        }

        let rgb3 = [t, m, d]

        let minDist = 999999
        let result = DetectedColor.White

        // ⭐ 样本（你可以自己调）
        let samples: { color: DetectedColor, rgb: number[] }[] = [
            { color: DetectedColor.Red, rgb: [5000, 2000, 1000] },
            { color: DetectedColor.Green, rgb: [6000, 5000, 2000] },
            { color: DetectedColor.Blue, rgb: [3000, 3000, 2000] },
            { color: DetectedColor.Yellow, rgb: [4000, 4000, 500] },
            { color: DetectedColor.Purple, rgb: [3000, 800, 3000] }

        ]

        for (let u of samples) {

            let dr = t - u.rgb[0]
            let dg = m - u.rgb[1]
            let db = d - u.rgb[2]

            let dist = Math.sqrt(dr * dr + dg * dg + db * db)

            if (dist < minDist) {
                minDist = dist
                result = u.color
            }
        }

        return result
    }
    

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

        // ⭐ 需要你实际测一下（很重要）
        const MAX_R = 6000
        const MAX_G = 3000
        const MAX_B = 2000

        let nr = Math.round(cacheR * 255 / MAX_R)
        let ng = Math.round(cacheG * 255 / MAX_G)
        let nb = Math.round(cacheB * 255 / MAX_B)

        // 限制范围
        if (nr > 255) nr = 255
        if (ng > 255) ng = 255
        if (nb > 255) nb = 255

        switch (channel) {
            case enRGB.Red: return nr
            case enRGB.Green: return ng
            case enRGB.Blue: return nb
            default: return 0
        }

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
}

