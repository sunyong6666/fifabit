// I2C设备地址
let i2cAddress = 16
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
enum motionType1 {
    //% block="前进"
    type1 = 5,
    //% block="后退"
    type2 = 6
}
enum motorID {
    //% block="0"
    motor0 = 0x50,
    //% block="1"
    motor1 = 0x6E
}
enum motorDirection {
    //% block="clockwise"
    clockwise = 1,  
    //% block="counterclockwise"
    counterclockwise = 2   
}
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
        const spAddr2 = 0x8C + 0x02;//设置速度
        let spBuff2 = pins.createBuffer(5);
        spBuff2.setNumber(NumberFormat.UInt8BE, 0, spAddr2);
        spBuff2.setNumber(NumberFormat.UInt8BE, 1, (mspeed >> 8) & 0xFF);
        spBuff2.setNumber(NumberFormat.UInt8BE, 2, mspeed & 0xFF);
        spBuff2.setNumber(NumberFormat.UInt8BE, 3, (mspeed >> 8) & 0xFF);
        spBuff2.setNumber(NumberFormat.UInt8BE, 4, mspeed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff2);
        const disAddr = 0x8C + 0x05;//设置距离
        let disBuff = pins.createBuffer(3);
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disAddr);
        // disBuff.setNumber(NumberFormat.UInt8BE, 1, (distance >> 8) & 0xFF);
        // disBuff.setNumber(NumberFormat.UInt8BE, 2, distance & 0xFF);
        disBuff.setNumber(NumberFormat.UInt16BE, 1, distance);
        pins.i2cWriteBuffer(i2cAddress, disBuff);
        const regAddr2 = 0x8C + 0x00;//执行
        let cmdBuff2 = pins.createBuffer(2);
        cmdBuff2.setNumber(NumberFormat.UInt8BE, 0, regAddr2);
        cmdBuff2.setNumber(NumberFormat.UInt8BE, 1, mtype);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff2);
    }
    //% blockId=motionStop
    //% block="stop motion"
    //% group="Motion" weight=1
    export function motionStop(): void {
        const regAddr3 = 0x8C + 0x00;//执行
        let cmdBuff3 = pins.createBuffer(2);
        cmdBuff3.setNumber(NumberFormat.UInt8BE, 0, regAddr3);
        cmdBuff3.setNumber(NumberFormat.UInt8BE, 1, 0);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff3);
    }
    //#########################################################################
    //##################################单电机#################################
    //#########################################################################
    //% blockId=motorGetSpeed
    //% block="motor %mID speed"
    //% group="Motor" weight=9
    export function motorGetSpeed(mID: motorID): number {
        // 发送指令
        const cmdAddr = mID + 0x01;
        let cmdBuff4 = pins.createBuffer(1);
        cmdBuff4.setNumber(NumberFormat.UInt8BE, 0, cmdAddr);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff4);
        return 0;
    }

    //% blockId=motorRunSpeed
    //% block="motor %mID go %direction with speed %speed"
    //% group="Motor" weight=8
    //% speed.min=0 speed.max=100 speed.defl=50
    export function motorRunSpeed(mID: motorID, direction: motorDirection, speed: number): void {
        // 设置速度
        const spAddr3 = mID + 0x04;
        let spBuff3 = pins.createBuffer(3);
        spBuff3.setNumber(NumberFormat.UInt8BE, 0, spAddr3);
        spBuff3.setNumber(NumberFormat.UInt8BE, 1, (speed >> 8) & 0xFF); 
        spBuff3.setNumber(NumberFormat.UInt8BE, 2, speed & 0xFF); 
        pins.i2cWriteBuffer(i2cAddress, spBuff3);
        // 发送运动指令
        const cmdAddr2 = mID + 0x03;
        let cmdBuff5 = pins.createBuffer(2);
        cmdBuff5.setNumber(NumberFormat.UInt8BE, 0, cmdAddr2);
        cmdBuff5.setNumber(NumberFormat.UInt8BE, 1, direction);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff5);
    }

    //% blockId=motorRunDistance
    //% block="motor %mID move %distance cm %direction with speed %speed"
    //% group="Motor" weight=7
    //% speed.min=0 speed.max=100 speed.defl=50
    //% distance.min=0 distance.max=1000 distance.defl=10
    export function motorRunDistance(mID: motorID, distance:number, direction: motorDirection, speed: number): void {
        // 设置速度
        const spAddr4 = mID + 0x04;
        let spBuff4 = pins.createBuffer(3);
        spBuff4.setNumber(NumberFormat.UInt8BE, 0, spAddr4);
        spBuff4.setNumber(NumberFormat.UInt8BE, 1, (speed >> 8) & 0xFF);
        spBuff4.setNumber(NumberFormat.UInt8BE, 2, speed & 0xFF);
        pins.i2cWriteBuffer(i2cAddress, spBuff4);
        //设置距离
        const disAddr2 = mID + 0x07;
        let disBuff2 = pins.createBuffer(3);
        disBuff2.setNumber(NumberFormat.UInt8BE, 0, disAddr2);
        // disBuff.setNumber(NumberFormat.UInt8BE, 1, (distance >> 8) & 0xFF);
        // disBuff.setNumber(NumberFormat.UInt8BE, 2, distance & 0xFF);
        disBuff2.setNumber(NumberFormat.UInt16BE, 1, distance);
        pins.i2cWriteBuffer(i2cAddress, disBuff2);
        // 发送运动指令
        const cmdAddr3 = mID + 0x03;
        let cmdBuff6 = pins.createBuffer(2);
        cmdBuff6.setNumber(NumberFormat.UInt8BE, 0, cmdAddr3);
        cmdBuff6.setNumber(NumberFormat.UInt8BE, 1, direction+4);
        pins.i2cWriteBuffer(i2cAddress, cmdBuff6);
    }
    
}
