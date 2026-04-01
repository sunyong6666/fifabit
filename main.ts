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
    //% block="clockwise"
    clockwise = 1,  
    //% block="counterclockwise"
    counterclockwise = 2   
}

const i2cAddress = 0x10;  // I2C设备地址

//% color="#6CACE4" icon="\uf1e3" block="FIFA:bit"
namespace FIFAbit {
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
    //% blockId=motorRunSpeed
    //% block="motor %mID go %direction with speed %speed"
    //% group="Motor" weight=9
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

    //% blockId=motorRunDistance
    //% block="motor %mID move %distance cm %direction with speed %speed"
    //% group="Motor" weight=9
    //% speed.min=0 speed.max=100 speed.defl=50
    //% distance.min=0 distance.max=1000 distance.defl=10
    export function motorRunDistance(mID: motorID, distance:number, direction: motorDirection, speed: number): void {
        // 设置速度
        const spAddr = mID + 0x04;
        let spBuff = pins.createBuffer(3);
        spBuff.setNumber(NumberFormat.UInt8BE, 0, spAddr);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, (speed >> 8) & 0xFF);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, speed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff);
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
        cmdBuff.setNumber(NumberFormat.UInt8BE, 1, direction+4);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff);
    }
    
}
