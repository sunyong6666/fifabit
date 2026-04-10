const i2cAddress = 0x09;  // I2C设备地址

// 运动类型
enum motionType {
    //% block="forward"
    type1 = 1,
    //% block="backward"
    type2 = 2,
    //% block="left"
    type3 = 3,
    //% block="right"
    type4 = 4
}
// 运动类型(前后)
enum motionType1 {
    //% block="forward"
    type1 = 5,
    //% block="backward"
    type2 = 6
}
// 运动类型(左右)
enum motionType2 {
    //% block="left"
    type1 = 9,
    //% block="right"
    type2 = 10
}

// 选择控制的电机
enum motorID {
    //% block="0"
    motor0 = 0x50,
    //% block="1"
    motor1 = 0x6E
}

// 单电机运动方向
enum motorDirection {
    //% block="forward"
    clockwise = 1,
    //% block="reverse"
    counterclockwise = 2
}

//舵机端口
enum ServoPin {
    //% block="P0"
    P0 = DigitalPin.P0,
    //% block="P1"
    P1 = DigitalPin.P1,
    //% block="P2"
    P2 = DigitalPin.P2,
    //% block="P8"
    P8 = DigitalPin.P8,
    //% block="P12"
    P12 = DigitalPin.P12,
    //% block="P13"
    P13 = DigitalPin.P13,
    //% block="P15"
    P15 = DigitalPin.P15,
    //% block="P16"
    P16 = DigitalPin.P16
}
//转动方向
enum RotationDirection {
    //% block="clockwise"
    Clockwise = 1,
    //% block="counterclockwise"
    Counterclockwise = -1
}

// 灯条预定义颜色
enum Colors {
    //% block=红
    Red = 0xFF0000,
    //% block=橙
    Orange = 0xFF7F00,
    //% block=黄
    Yellow = 0xFFFF00,
    //% block=绿
    Green = 0x00FF00,
    //% block=青
    Cyan = 0x00FFFF,
    //% block=蓝
    Blue = 0x0000FF,
    //% block=紫
    Purple = 0x7F00FF,
    //% block=白
    White = 0xFFFFFF,
    //% block=黑
    Off = 0x000000
}

enum PotPin {
    //% block="P0"
    P0 = AnalogPin.P0,
    //% block="P1"
    P1 = AnalogPin.P1,
    //% block="P2"
    P2 = AnalogPin.P2
}

enum rocket {
    //% block="X"
    x = 1,
    //% block="Y"
    y = 2
}
enum rock {
    //% block="up"
    orient1 = 2,
    //% block="down"
    orient2 = 1,
    //% block="left"
    orient3 = 4,
    //% block="right"
    orient4 = 3
}



//color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
//% color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
namespace FIFAbit {
    //#########################################################################
    //################################## 运动（双电机）#########################
    //#########################################################################
    //% blockId=motionSpeed
    //% block="move %mtype at speed %mspeed"
    //% group="Motion" weight=9
    //% mspeed.min=0 mspeed.max=100 mspeed.defl=50
    export function motionSpeed(mtype: motionType, mspeed: number): void {
        const spAddr = 0x8C + 0x01;//设置速度
        let spBuff = pins.createBuffer(5);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        const regAddr = 0x8C + 0x00;//执行
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, mtype);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    //% blockId=motionDistance
    //% block="move %mtype at speed %mspeed for %distance cm"
    //% group="Motion" weight=8
    //% mspeed.min=0 mspeed.max=100 mspeed.defl=50
    //% distance.min=0 distance.max=1000 distance.defl=10
    export function motionDistance(mtype: motionType1, mspeed: number, distance: number): void {
        const spAddr = 0x8C + 0x01;//设置速度
        let spBuff = pins.createBuffer(5);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        const disAddr = 0x8C + 0x02;//设置距离
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (distance >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, distance & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        const regAddr = 0x8C + 0x00;//执行
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, mtype);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    //% blockId=motionAngle
    //% block="move %mtype at speed %mspeed for %angle °"
    //% group="Motion" weight=7
    //% mspeed.min=0 mspeed.max=100 mspeed.defl=50
    //% angle.min=0 angle.max=1000 distance.defl=90
    export function motionAngle(mtype: motionType2, mspeed: number, angle: number): void {
        const spAddr = 0x8C + 0x01;//设置速度
        let spBuff = pins.createBuffer(5);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        const disAddr = 0x8C + 0x04;//设置角度
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (angle >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, angle & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        const regAddr = 0x8C + 0x00;//执行
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, mtype);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    //% blockId=motionStop
    //% block="stop motion"
    //% group="Motion" weight=6
    export function motionStop(): void {
        const regAddr = 0x8C + 0x00;//执行
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, regAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, 0);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    //#########################################################################
    //##################################单电机#################################
    //#########################################################################
    //% blockId=motorGetSpeed
    //% block="get motor %mID speed"
    //% group="Motor" weight=9
    export function motorGetSpeed(mID: motorID): number {
        // 发送指令
        const cmdAddr = mID + 0x01;
        let cmdBuff = pins.createBuffer(1);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
        // 拼接 2 字节为 16 位整数
        // let readBuff = pins.createBuffer(2);
        // readBuff = pins.i2cReadBuffer(i2cAddress, 2);
        // let highByte = readBuff.getNumber(NumberFormat.UInt8BE, 0);
        // let lowByte = readBuff.getNumber(NumberFormat.UInt8BE, 1);
        // let speed = ((highByte & 0xFF) << 8) | (lowByte & 0xFF);

        // 读取2字节数据
        let readBuff = pins.createBuffer(2);
        readBuff = pins.i2cReadBuffer(i2cAddress, 2);
        // 将2个字节作为有符号16位整数解析
        let speed = readBuff.getNumber(NumberFormat.Int16BE, 0);
        return speed; 
    }
    //% blockId=motorSetSpeed
    //% block="set motor %mID speed to %speed"
    //% group="Motor" weight=8
    //% speed.min=0 speed.max=100 speed.defl=50
    export function motorSetSpeed(mID: motorID, speed: number): void {
        // 设置速度
        const spAddr = mID + 0x04;
        let spBuff = pins.createBuffer(3);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (speed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, speed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
    }
    //% blockId=motorRun
    //% block="run motor %mID %direction"
    //% group="Motor" weight=7
    export function motorRun(mID: motorID, direction: motorDirection): void {
        // 发送运动指令
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, direction);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    //% blockId=motorRunDistance
    //% block="run motor %mID  %direction for %distance cm"
    //% group="Motor" weight=6
    //% distance.min=0 distance.max=1000 distance.defl=10
    //% inlineInputMode = inline
    export function motorRunDistance(mID: motorID, direction: motorDirection, distance: number): void {
        //设置距离
        const disAddr = mID + 0x07;
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (distance >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, distance & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        // 发送运动指令
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, direction + 6);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }

    //% blockId=motorRunAngle
    //% block="run motor %mID  %direction %angle °"
    //% group="Motor" weight=5
    //% angle.min=0 angle.max=3600 angle.defl=90
    //% inlineInputMode = inline
    export function motorRunAngle(mID: motorID, direction: motorDirection, angle: number): void {
        //设置偏移角度
        const disAddr = mID + 0x06;
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, (angle >> 8) & 0xFF);
        disBuff.setNumber(NumberFormat.UInt8BE, 2, angle & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        // 发送运动指令
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, direction + 4);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }

    //% blockId=motorRunSpeed
    //% block="run motor %mID go %direction at speed %speed"
    //% group="Motor" weight=4
    //% speed.min=0 speed.max=100 speed.defl=50
    export function motorRunSpeed(mID: motorID, direction: motorDirection, speed: number): void {
        // 设置速度
        const spAddr = mID + 0x04;
        let spBuff = pins.createBuffer(3);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (speed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, speed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        // 发送运动指令
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, direction);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    //% blockId=motorStop
    //% block="stop motor %mID"
    //% group="Motor" weight=3
    export function motorStop(mID: motorID): void {
        // 发送停止运动指令
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, 0);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }

    //#########################################################################
    //##################################舵机#################################
    //#########################################################################

    //% blockId=servo1Set
    //% block="设置180舵机 %pin 角度为 %value °"
    //% value.min=0 value.max=180 value.defl=90
    //% group="Servo Motor" weight=9
    export function servo1Set(pin: ServoPin, value: number): void {
        pins.servoWritePin(pin, value)
    }

    //% blockId=servo1Stop
    //% block="停止180舵机 %servoPin"
    //% group="Servo Motor" weight=6
    export function servo1Stop(servoPin: ServoPin): void {
        pins.digitalWritePin(servoPin, 0)
    }

    //% blockId=servo360_run
    //% block="360舵机%pin 速度 %speed %direction 转动"
    //% speed.min=0 speed.max=100 speed.defl=50
    //% group="Servo Motor" weight=5
    export function runServo360(pin: ServoPin, speed: number, direction: RotationDirection ): void {
        // 限制速度范围
        speed = Math.min(100, Math.max(0, speed))

        // 计算脉冲宽度
        // 中间位置：1.5ms (1500µs) = 停止
        // 顺时针方向：1.0ms (1000µs) = 全速逆时针
        // 逆时针方向：2.0ms (2000µs) = 全速顺时针
        let pulseWidth: number

        if (speed === 0) {
            pulseWidth = 1500
        } else {
            if (direction === RotationDirection.Clockwise) {
                // 顺时针方向：脉冲宽度大于1500µs
                // 1500-2000µs 对应速度 0-100
                pulseWidth = 1500 + (speed * 5)
            } else {
                // 逆时针方向：脉冲宽度小于1500µs
                // 1000-1500µs 对应速度 0-100
                pulseWidth = 1500 - (speed * 5)
            }
        }
        // 设置脉冲宽度
        pins.servoSetPulse(pin, pulseWidth)
    }
    //% blockId=servo360_run_with_duration
    //% block="360舵机%pin 速度 %speed %direction 转动 %duration 秒"
    //% speed.min=0 speed.max=100 speed.defl=50
    //% duration.min=0 duration.max=100 duration.defl=1
    //% group="Servo Motor" weight=4
    export function runServo360ForDuration(pin: ServoPin, speed: number, direction: RotationDirection, duration: number): void {
        // 启动舵机
        runServo360(pin, speed, direction)

        // 等待指定时间
        basic.pause(duration * 1000)

        // 停止舵机
        stopServo360(pin)
    }

    //% blockId=servo360_stop
    //% block="停止360舵机%pin"
    //% group="Servo Motor" weight=3
    export function stopServo360(pin: ServoPin): void {
        // 设置脉冲宽度为1.5ms停止
        pins.servoSetPulse(pin, 1500)
    }
    
    //#########################################################################
    //##################################灯条#################################
    //#########################################################################
    // RGB LED控制类
    class WS2812BStrip {
        private buffer: Buffer
        private pin: DigitalPin
        private length: number
        private brightness: number = 128

        constructor(pin: DigitalPin, length: number) {
            this.pin = pin
            this.length = length
            this.buffer = pins.createBuffer(length * 3)// 每个LED需要3个字节 (RGB)
            pins.digitalWritePin(pin, 0)// 初始化引脚
        }

        // 设置单个LED的RGB颜色
        setPixelColor(index: number, rgb: number): void {
            if (index < 0 || index >= this.length) return

            let r = (rgb >> 16) & 0xFF
            let g = (rgb >> 8) & 0xFF
            let b = rgb & 0xFF

            // 应用亮度
            if (this.brightness < 255) {
                r = (r * this.brightness) >> 8
                g = (g * this.brightness) >> 8
                b = (b * this.brightness) >> 8
            }

            let offset = index * 3
            // WS2812B使用GRB顺序
            this.buffer[offset] = g     // G
            this.buffer[offset + 1] = r // R
            this.buffer[offset + 2] = b // B
        }

        // 显示所有LED
        show(): void {
            ws2812b.sendBuffer(this.buffer, this.pin)
        }

        // 清除所有LED
        clear(): void {
            for (let i = 0; i < this.buffer.length; i++) {
                this.buffer[i] = 0
            }
        }

        // 设置亮度
        setBrightness(brightness: number): void {
            this.brightness = Math.min(255, Math.max(0, brightness))
        }
    }

    // 全局变量存储当前灯条信息
    let currentStrip: WS2812BStrip
    let currentLEDCount: number = 8

    //% blockId=ws2812b_init
    //% block="初始化灯条 引脚 %pin 灯数 %ledCount"
    //% ledCount.min=1 ledCount.max=50 ledCount.defl=8
    //% group="LED" weight=9
    export function initStrip(pin: ServoPin, ledCount: number): void {
        currentStrip = new WS2812BStrip(pin as number, ledCount)
        currentLEDCount = ledCount
    }

    //% blockId=ws2812b_set_brightness
    //% block="设置亮度 %brightness"
    //% brightness.min=0 brightness.max=255 brightness.defl=128
    //% group="LED" weight=8
    export function setBrightness(brightness: number): void {
        if (currentStrip) {
            currentStrip.setBrightness(brightness)
        }
    }

    //% blockId=ws2812b_set_all
    //% block="设置全部灯为颜色 %color"
    //% group="LED" weight=7
    export function setAllColor(color: Colors): void {
        if (currentStrip) {
            for (let i = 0; i < currentLEDCount; i++) {
                currentStrip.setPixelColor(i, color)
            }
            currentStrip.show()
        }
    }

    //% blockId=ws2812b_set_all_rgb
    //% block="设置全部灯RGB R %red G %green B %blue"
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=0
    //% blue.min=0 blue.max=255 blue.defl=0
    //% group="LED" weight=6
    export function setAllRGB(red: number, green: number, blue: number): void {
        if (currentStrip) {
            let rgb = (red << 16) | (green << 8) | blue
            for (let i = 0; i < currentLEDCount; i++) {
                currentStrip.setPixelColor(i, rgb)
            }
            currentStrip.show()
        }
    }

    //% blockId=ws2812b_set_led
    //% block="设置第 %index 个灯为颜色 %color"
    //% index.min=0 index.defl=0
    //% group="LED" weight=5
    export function setLEDColor(index: number, color: Colors): void {
        if (currentStrip && index >= 0 && index < currentLEDCount) {
            currentStrip.setPixelColor(index, color)
            currentStrip.show()
        }
    }

    //% blockId=ws2812b_set_led_rgb
    //% block="设置%index灯R %red G %green B %blue"
    //% index.min=0 index.defl=0
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=0
    //% blue.min=0 blue.max=255 blue.defl=0
    //% inlineInputMode=inline
    //% group="LED" weight=4
    export function setLEDRGB(index: number, red: number, green: number, blue: number): void {
        if (currentStrip && index >= 0 && index < currentLEDCount) {
            let rgb = (red << 16) | (green << 8) | blue
            currentStrip.setPixelColor(index, rgb)
            currentStrip.show()
        }
    }

    //% blockId=ws2812b_clear
    //% block="熄灭全部灯"
    //% group="LED" weight=3
    export function clearAll(): void {
        if (currentStrip) {
            currentStrip.clear()
            currentStrip.show()
        }
    }

    //#########################################################################
    //##################################LCD#################################
    //#########################################################################
    const LCD_ADDRESS = 0x27  // 常见I2C地址，也可能是0x3F
    let lcd_isInitialized = false

    //% blockId="lcd1602_init" block="初始化LCD1602"
    //% group="LCD1602" weight=100
    export function init(): void {
        // 简化的初始化序列
        basic.pause(50)
        writeCmd(0x33)
        basic.pause(5)
        writeCmd(0x32)
        basic.pause(5)
        writeCmd(0x28)  // 4位模式，2行显示
        basic.pause(5)
        writeCmd(0x0C)  // 显示开，光标关
        basic.pause(5)
        writeCmd(0x06)  // 输入模式
        basic.pause(5)
        writeCmd(0x01)  // 清屏
        basic.pause(5)

        lcd_isInitialized = true
    }
    //% blockId="lcd1602_clear" block="LCD清屏"
    //% group="LCD1602" weight=90
    export function clear(): void {
        if (!lcd_isInitialized) init()
        writeCmd(0x01)
        basic.pause(2)
    }

    //% blockId="lcd1602_show_at" block="在第%row行第%col列显示%text"
    //% row.min=0 row.max=1 row.defl=0
    //% col.min=0 col.max=15 col.defl=0
    //% group="LCD1602" weight=80
    export function showAt(row: number, col: number, text: string): void {
        if (!lcd_isInitialized) init()

        // 限制行列
        row = Math.min(1, Math.max(0, row))
        col = Math.min(15, Math.max(0, col))

        // 设置光标位置
        let address = col
        if (row == 1) address += 0x40
        writeCmd(0x80 | address)

        // 显示文本
        for (let i = 0; i < text.length && i < 16; i++) {
            writeData(text.charCodeAt(i))
        }
    }

    //% blockId="lcd1602_show_line" block="在第%row行显示%text"
    //% row.min=0 row.max=1 row.defl=0
    //% group="LCD1602" weight=70
    export function showLine(row: number, text: string): void {
        if (!lcd_isInitialized) init()
        showAt(row, 0, text)
    }

    //% blockId="lcd1602_show_number" block="LCD显示数字%num"
    //% group="LCD1602" weight=60
    export function showNumber(num: number): void {
        if (!lcd_isInitialized) init()
        showLine(0, num.toString())
    }

    // 内部辅助函数
    function writeCmd(cmd: number): void {
        let high = cmd & 0xF0
        let low = (cmd << 4) & 0xF0

        write4bits(high)
        write4bits(low)
    }

    function writeData(data: number): void {
        let high = data & 0xF0
        let low = (data << 4) & 0xF0

        write4bits(high | 0x01)  // RS=1
        write4bits(low | 0x01)   // RS=1
    }

    function write4bits(data: number): void {
        // 发送4位数据，带背光
        let buffer = pins.createBuffer(1)
        buffer[0] = data | 0x08  // 背光开
        pins.i2cWriteBuffer(LCD_ADDRESS, buffer)

        // 使能脉冲
        buffer[0] = data | 0x0C
        pins.i2cWriteBuffer(LCD_ADDRESS, buffer)
        basic.pause(1)

        buffer[0] = data & ~0x04
        pins.i2cWriteBuffer(LCD_ADDRESS, buffer)
        basic.pause(1)
    }

    //#########################################################################
    //##################################传感器#################################
    //#########################################################################

    //----------------------------------电位器-------------------------------
    //% blockId=potentiometer_read_raw
    //% block="读取电位器 %pin 原始值"
    //% group="Potentiometer" weight=99
    export function readRawValue(pin: PotPin): number {
        // 直接读取模拟值，范围0-1023
        return pins.analogReadPin(pin as number)
    }

    //% blockId=potentiometer_read_percent
    //% block="读取电位器 %pin 百分比"
    //% group="Potentiometer" weight=98
    export function readPercentage(pin: PotPin): number {
        // 读取原始值
        let rawValue = pins.analogReadPin(pin as number)

        // 转换为百分比 0-100
        let percentage = (rawValue * 100) / 1023

        // 确保在0-100范围内
        percentage = Math.min(100, Math.max(0, percentage))
        return Math.round(percentage)
    }

    //----------------------------------土壤湿度-------------------------------
    //% blockId=soil_read_raw
    //% block="读取土壤湿度 %pin 原始值"
    //% group="Soil Moisture Sensor" weight=89
    export function readRawValueTR(pin: PotPin): number {
        // 直接读取模拟值，范围0-1023
        return pins.analogReadPin(pin as number) 
    }

    //% blockId=soil_read_percent
    //% block="读取土壤湿度 %pin 百分比"
    //% group="Soil Moisture Sensor" weight=88
    export function readPercentageTR(pin: PotPin): number {
        // 读取原始值
        let rawValue = pins.analogReadPin(pin as number)

        // 转换为百分比 0-100
        let percentage = (rawValue * 100) / 1023

        // 确保在0-100范围内
        percentage = Math.min(100, Math.max(0, percentage))
        return Math.round(percentage)
    }

    //----------------------------------按键-------------------------------
    //% blockId=button_is_pressed
    //% block="按键 %pin 是否按下"
    //% group="Button" weight=79
    export function isPressed(pin: ServoPin): boolean {
        let value = pins.digitalReadPin(pin as number)
        // 返回 true 表示按下
        return value === 0
    }

    

    

    //----------------------------------摇杆-------------------------------
    //% blockId=rocker
    //% block="Joystick %direction moved"
    //% group="Roker" weight=49
    export function rocker(direction: rocket): number {
        let GetBuff = pins.createBuffer(3)
        GetBuff = pins.i2cReadBuffer(97, 3)
        let re = GetBuff.getNumber(NumberFormat.Int8BE, direction)
        if (direction == 2) {
            return -re
        } else {
            return re
        }
    }

    //% blockId=rockerori
    //% block="Joystick detected %orientation"
    //% group="Roker" weight=48
    export function rockerori(orientation: rock): boolean {
        let GetBuff2 = pins.createBuffer(3)
        GetBuff2 = pins.i2cReadBuffer(97, 3)
        let ud = GetBuff2.getNumber(NumberFormat.Int8BE, 2)
        let lr = GetBuff2.getNumber(NumberFormat.Int8BE, 1)
        let flag
        if (orientation == 1) {
            if (ud > 50) flag = true
            else flag = false
        }
        if (orientation == 2) {
            if (ud < -50) flag = true
            else flag = false
        }
        if (orientation == 4) {
            if (lr < -50) flag = true
            else flag = false
        }
        if (orientation == 3) {
            if (lr > 50) flag = true
            else flag = false
        }
        return flag
    }

}
