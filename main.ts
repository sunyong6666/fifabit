const i2cAddress = 0x10;  // I2C设备地址

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
    //% block="Reverse"
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

//color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
//% color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
namespace FIFAbit {
    //#########################################################################
    //################################## 运动（双电机）#########################
    //#########################################################################
    //% blockId=motionSpeed
    //% block="%mtype at speed %mspeed"
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
    //% block="%mtype at speed %mspeed for distance %distance cm"
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
    //% block="get speed of motor %mID"
    //% group="Motor" weight=9
    export function motorGetSpeed(mID: motorID): number {
        // 发送指令
        const cmdAddr = mID + 0x01;
        let cmdBuff = pins.createBuffer(1);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
        // 拼接 2 字节为 16 位整数
        let readBuff = pins.createBuffer(2);
        readBuff = pins.i2cReadBuffer(i2cAddress, 2);
        let highByte = readBuff.getNumber(NumberFormat.UInt8BE, 0);
        let lowByte = readBuff.getNumber(NumberFormat.UInt8BE, 1);
        let speed = ((highByte & 0xFF) << 8) | (lowByte & 0xFF);
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
    //% speed.min=0 speed.max=100 speed.defl=50
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
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, direction+6);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    //% blockId=motorRunSpeed
    //% block="run motor %mID  %direction at speed %speed"
    //% group="Motor" weight=5
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
    //% group="Motor" weight=4
    export function motorStop(mID: motorID): void {
        // 发送运动指令
        const cmdAddr = mID + 0x03;
        let cmdBuff = pins.createBuffer(2);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, 0);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
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
        }else if (ultpins == 114) {
            trigpin = DigitalPin.P1;
            echopin = DigitalPin.P14;
        }else if (ultpins == 129) {
            trigpin = DigitalPin.P12;
            echopin = DigitalPin.P9;
        }else if (ultpins == 215) {
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
