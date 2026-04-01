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
namespace FIFAbit {
    //% blockId=motionSpeed
    //% block="%mtype with speed %mspeed"
    //% group="Motion" weight=3
    //% mspeed.min=0 mspeed.max=100 mspeed.defl=100
    export function motionSpeed(mtype: motionType, mspeed: number): void {
        const spAddr = 0x8C + 0x02;//设置速度
        let spBuff = pins.createBuffer(4);
        const speedHigh = (mspeed >> 8) & 0xFF;
        const speedLow = mspeed & 0xFF;
        spBuff.setNumber(NumberFormat.UInt8BE, 0, speedHigh);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, speedLow);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, speedHigh);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, speedLow);
        pins.i2cWriteBuffer(spAddr, spBuff);

        const regAddr = 0x8C + 0x00;//执行
        let cmdBuff = pins.createBuffer(1);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, mtype);
        pins.i2cWriteBuffer(regAddr, cmdBuff);
    }

    //% blockId=motionDistance
    //% block="%mtype with speed %mspeed and distance %distance cm"
    //% group="Motion" weight=2
    //% mspeed.min=0 mspeed.max=100 mspeed.defl=100
    //% distance.min=0 distance.max=1000 distance.defl=2
    export function motionDistance(mtype: motionType1, mspeed: number, distance: number): void {
        const spAddr = 0x8C + 0x02;//设置速度
        let spBuff = pins.createBuffer(4);
        const speedHigh = (mspeed >> 8) & 0xFF;
        const speedLow = mspeed & 0xFF;
        spBuff.setNumber(NumberFormat.UInt8BE, 0, speedHigh);
        spBuff.setNumber(NumberFormat.UInt8BE, 1, speedLow);
        spBuff.setNumber(NumberFormat.UInt8BE, 2, speedHigh);
        spBuff.setNumber(NumberFormat.UInt8BE, 3, speedLow);
        pins.i2cWriteBuffer(spAddr, spBuff);

        const disAddr = 0x8C + 0x05;//设置距离
        let disBuff = pins.createBuffer(2);
        const disHigh = (distance >> 8) & 0xFF;
        const disLow = distance & 0xFF;
        disBuff.setNumber(NumberFormat.UInt8BE, 0, disHigh);
        disBuff.setNumber(NumberFormat.UInt8BE, 1, disLow);
        pins.i2cWriteBuffer(disAddr, disBuff);

        const regAddr = 0x8C + 0x00;//执行
        let cmdBuff = pins.createBuffer(1);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, mtype);
        pins.i2cWriteBuffer(regAddr, cmdBuff);
    }

    //% blockId=motionStop
    //% block="stop motion"
    //% group="Motion" weight=1
    export function motionStop(): void {
        const regAddr = 0x8C + 0x00;//执行
        let cmdBuff = pins.createBuffer(1);
        cmdBuff.setNumber(NumberFormat.UInt8BE, 0, 0);
        pins.i2cWriteBuffer(regAddr, cmdBuff);
    }

    
}