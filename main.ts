const i2cAddress = 0x10;  // I2C设备地址

// 运动类型
enum motionType {
    //% block="前进"
    type1 = 1,
    //% block="后退"
    type2 = 2,
    //% block="左转"
    type3 = 3,
    //% block="右转"
    type4 = 4
}
// 运动类型()
enum motionType1 {
    //% block="前进"
    type1 = 5,
    //% block="后退"
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
    //% block="正转"
    clockwise = 1,  
    //% block="反转"
    counterclockwise = 2   
}

// 颜色
enum enRGB {
    R = 1,
    G = 2,
    B = 3,
}
//color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
//% color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
namespace FIFAbit {
    //#########################################################################
    //################################## 运动（双电机）#########################
    //#########################################################################
    //% blockId=motionSpeed
    //% block="%mtype with speed %mspeed"
    //% group="Motion" weight=3
    //% mspeed.min=0 mspeed.max=100 mspeed.defl=50
    export function motionSpeed(mtype: motionType, mspeed: number): void {
        const spAddr = 0x8C + 0x02;//设置速度
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
    //% block="%mtype with speed %mspeed and distance %distance cm"
    //% group="Motion" weight=2
    //% mspeed.min=0 mspeed.max=100 mspeed.defl=50
    //% distance.min=0 distance.max=1000 distance.defl=10
    export function motionDistance(mtype: motionType1, mspeed: number, distance: number): void {
        const spAddr = 0x8C + 0x02;//设置速度
        let spBuff = pins.createBuffer(5);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
        const disAddr = 0x8C + 0x05;//设置距离
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
    //% block="motor %mID get speed %speed"
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
    //% block="motor %mID set speed %speed"
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
    //% block="motor %mID go %direction"
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
    //% block="motor %mID  %direction move %distance cm"
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
    //% block="motor %mID go %direction with speed %speed"
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
    //% block="motor %mID stop"
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
    
    //% blockId=getRGB
    //% block="TCS get %color value"
    //% group="Sensor" weight=9
    export function getRGB(color: enRGB): number {
        let rgb = tcsRaw();
        return rgb[color];
    }

    //% blockId=getRGBC
    //% block="TCS get light intensity"
    //% group="Sensor" weight=8
    export function getRGBC(): number {
        let rgb = tcsRaw();
        return rgb[0];
    }
}
