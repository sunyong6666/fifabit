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
// 运动类型()
enum motionType1 {
    //% block="forward"
    type1 = 5,
    //% block="backward"
    type2 = 6
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

// 颜色
enum enRGB {
    R = 0,
    G = 1,
    B = 2,
}
// 超声波
enum Ultrasonic_pin {
    //% block="(P13,P0)"
    u1 = 13,
    //% block="(P14,P1)"
    u3 = 114,
    //% block="(P9,P12)"
    u4 = 129,
    //% block="(P15,P2)"
    u5 = 215
}
//单位
enum PingUnit {
    //% block="centimeters"
    Centimeters,
    //% block="microseconds"
    MicroSeconds,
    //% block="inches"
    Inches
}
// io端口
enum Write_pin {
    //% block="P0"
    w0 = 1,
    //% block="P16"
    w1 = 2,
    //% block="P1"
    w2 = 3,
    //% block="P12"
    w3 = 4,
    //% block="P2"
    w4 = 5,
    //% block="P8"
    w5 = 6
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
    P15 = DigitalPin.P15
}
//转动方向
enum RotationDirection {
    //% block="clockwise"
    Clockwise = 1,
    //% block="counterclockwise"
    Counterclockwise = -1
}
// 预定义颜色
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

//color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
//% color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
namespace FIFAbit {
    //#########################################################################
    //################################## 运动（双电机）#########################
    //#########################################################################
    //% blockId=motionSpeed
    //% block="move %mtype at speed %mspeed"
    //% group="Motion" weight=3
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
    //% group="Motion" weight=2
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
    //% blockId=motionStop
    //% block="stop motion"
    //% group="Motion" weight=1
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
    //% block="run motor %mID  %direction %angle degrees"
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
    // //% blockId=servo1Increase
    // //% block="180舵机 %servoPin 增加 %value °"
    // //% value.min=0 value.max=180 value.defl=10
    // //% group="Servo Motor" weight=8
    // export function servo1Increase(servoPin: ServoPin, value: number): void {
    //     let currentAngle = pins.servoReadPin(servoPin)
    //     let newAngle = Math.min(180, Math.max(0, currentAngle + value))
    //     pins.servoWritePin(servoPin, newAngle)
    // }

    // //% blockId=servo1Decrease
    // //% block="180舵机 %servoPin 减少 %value °"
    // //% value.min=0 value.max=180 value.defl=10
    // //% group="Servo Motor" weight=7
    // export function servo1Decrease(servoPin: ServoPin, value: number): void {
    //     let currentAngle = pins.servoReadPin(servoPin)
    //     let newAngle = Math.min(180, Math.max(0, currentAngle - value))
    //     pins.servoWritePin(servoPin, newAngle)
    // }

    //% blockId=servo1Stop
    //% block="停止180舵机 %servoPin 输出"
    //% group="Servo Motor" weight=6
    export function servo1Stop(servoPin: ServoPin): void {
        pins.digitalWritePin(servoPin, 0)
    }

    //% blockId=servo360_run
    //% block="360舵机 %pin 以速度 %speed %direction 转动"
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
    //% block="360舵机 %pin 以速度 %speed %direction 转动 %duration 秒"
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
    //% block="停止360舵机 %pin"
    //% group=""Servo Motor" weight=3
    export function stopServo360(pin: ServoPin): void {
        // 设置脉冲宽度为1.5ms停止
        pins.servoSetPulse(pin, 1500)
    }
    
    //#########################################################################
    //##################################灯条#################################
    //#########################################################################
    // 全局灯条变量
    let currentStrip: neopixel.Strip
    let currentLEDCount: number = 8

    //% blockId=rgb_strip_init
    //% block="初始化灯条 引脚 %pin 灯数 %ledCount"
    //% ledCount.min=1 ledCount.max=50 ledCount.defl=8
    //% group="LED" weight=9
    export function initStrip(pin: ServoPin, ledCount: number): void {
        // 创建灯条
        currentStrip = neopixel.create(pin as number, ledCount, NeoPixelMode.RGB)
        currentLEDCount = ledCount
        // 默认亮度
        currentStrip.setBrightness(255)
    }

    //% blockId=rgb_strip_set_all
    //% block="设置全部灯为颜色 %color"
    //% group="LED" weight=8
    export function setAllColor(color: Colors): void {
        if (currentStrip) {
            currentStrip.showColor(color)
            currentStrip.show()
        }
    }

    //% blockId=rgb_strip_set_all_rgb
    //% block="设置全部灯RGB R %red G %green B %blue"
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=255
    //% blue.min=0 blue.max=255 blue.defl=255
    //% group="LED" weight=7
    export function setAllRGB(red: number, green: number, blue: number): void {
        if (currentStrip) {
            for (let i = 0; i < currentLEDCount; i++) {
                currentStrip.setPixelColor(i, neopixel.rgb(red, green, blue))
            }
            currentStrip.show()
        }
    }

    //% blockId=rgb_strip_set_led
    //% block="设置第 %index 个灯为颜色 %color"
    //% index.min=0 index.defl=0
    //% group="LED" weight=6
    export function setLEDColor(index: number, color: Colors): void {
        if (currentStrip && index >= 0 && index < currentLEDCount) {
            currentStrip.setPixelColor(index, color)
            currentStrip.show()
        }
    }

    //% blockId=rgb_strip_set_led_rgb
    //% block="设置第 %index 个灯RGB R %red G %green B %blue"
    //% index.min=0 index.defl=0
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=255
    //% blue.min=0 blue.max=255 blue.defl=255
    //% group="LED" weight=5
    export function setLEDRGB(index: number, red: number, green: number, blue: number): void {
        if (currentStrip && index >= 0 && index < currentLEDCount) {
            currentStrip.setPixelColor(index, neopixel.rgb(red, green, blue))
            currentStrip.show()
        }
    }

    //% blockId=rgb_strip_clear
    //% block="熄灭全部灯"
    //% group="LED" weight=4
    export function clearAll(): void {
        if (currentStrip) {
            currentStrip.clear()
            currentStrip.show()
        }
    }

    


    //#########################################################################
    //##################################传感器#################################
    //#########################################################################
    let TCS3472_ADDR = 0x29;
    let tcsInited = false;

    //初始化tcs
    export function tcsInit(): void {
        if (!tcsInited) {
            // 使能（PON + AEN）
            pins.i2cWriteBuffer(TCS3472_ADDR, pins.createBufferFromArray([0x80, 0x03]));
            // 积分时间
            pins.i2cWriteBuffer(TCS3472_ADDR, pins.createBufferFromArray([0x81, 0x2B]));
            basic.pause(50); // 等积分

            tcsInited = true;
        }
    }
    function tcsRaw(): number[] {
        tcsInit();
        // 发送读取命令
        pins.i2cWriteNumber(TCS3472_ADDR, 0xB4, NumberFormat.UInt8BE);

        // 读取8字节
        let buf = pins.i2cReadBuffer(TCS3472_ADDR, 8);

        let c = buf.getNumber(NumberFormat.UInt16LE, 0);
        let r = buf.getNumber(NumberFormat.UInt16LE, 2);
        let g = buf.getNumber(NumberFormat.UInt16LE, 4);
        let b = buf.getNumber(NumberFormat.UInt16LE, 6);

        return [c, r, g, b];
    }
    // 转标准 RGB（0~255）
    function tcsRGB(): number[] {
        let raw = tcsRaw();
        let c = raw[0];

        if (c == 0) return [0, 0, 0];

        let r = raw[1] / c;
        let g = raw[2] / c;
        let b = raw[3] / c;

        // 增益（关键）
        let gain = 255;

        r = r * gain;
        g = g * gain;
        b = b * gain;

        // 限制范围
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        return [
            Math.round(r),
            Math.round(g),
            Math.round(b)
        ];
    }
    //% blockId=getRGB
    //% block="color sensor %color"
    //% group="Sensor" weight=9
    export function getRGB(color: enRGB): number {
        let rgb = tcsRGB();
        return rgb[color];
    }

    //% blockId=getRGBC
    //% block="TCS get light intensity"
    //% group="Sensor" weight=8
    // export function getRGBC(): number {
    //     let c = tcsRaw()[0];
    //     let value = c / 256;
    //     return Math.min(255, Math.round(value));
    // }

    //% blockId=getUltrasonic
    //% block="ultrasonic sensor %ultpins distance (%unit)"
    //% ultpins.fieldOptions.width=220
    //% ultpins.fieldOptions.columns=2
    //% group="Sensor" weight=7
    export function getUltrasonic(ultpins: Ultrasonic_pin, unit: PingUnit, maxCmDistance = 500): number {
        let d
        let distance
        let echopin
        let trigpin
        if (ultpins == 13) {
            trigpin = DigitalPin.P0;
            echopin = DigitalPin.P13;
        } else if (ultpins == 114) {
            trigpin = DigitalPin.P1;
            echopin = DigitalPin.P14;
        } else if (ultpins == 129) {
            trigpin = DigitalPin.P12;
            echopin = DigitalPin.P9;
        } else if (ultpins == 215) {
            trigpin = DigitalPin.P2;
            echopin = DigitalPin.P15;
        }

        pins.setPull(trigpin, PinPullMode.PullNone);
        pins.digitalWritePin(trigpin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trigpin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigpin, 0);
        // read pulse
        d = pins.pulseIn(echopin, PulseValue.High, maxCmDistance * 50);
        distance = d * 34 / 2 / 1000 * 3 / 2;
        switch (unit) {
            case PingUnit.Centimeters: return Math.round(distance);
            case PingUnit.Inches: return Math.round(distance / 30.48);
            default: return Math.round(d);
        }
    }



    //% blockId=getLine
    //% block="read line sensor %linePin"
    //% group="Sensor" weight=6
    export function getLine(linePin: Write_pin): number {
        let pin16
        if (linePin == 1) {
            pin16 = DigitalPin.P0;
        }
        if (linePin == 2) {
            pin16 = DigitalPin.P16;
        }
        if (linePin == 3) {
            pin16 = DigitalPin.P1;
        }
        if (linePin == 4) {
            pin16 = DigitalPin.P12;
        }
        if (linePin == 5) {
            pin16 = DigitalPin.P2;
        }
        if (linePin == 6) {
            pin16 = DigitalPin.P8;
        }

        return pins.digitalReadPin(pin16);
    }
}
