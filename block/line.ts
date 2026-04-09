//----------------------------------巡线-------------------------------

namespace FIFAbit {
    // 存储三个传感器的引脚
    let leftPin: ServoPin
    let middlePin: ServoPin
    let rightPin: ServoPin
    let line_isInitialized = false

    // 引脚映射表
    let pinMap: { [key: number]: DigitalPin } = {
        1: DigitalPin.P0,  // 左默认P0
        2: DigitalPin.P1,  // 中默认P1
        3: DigitalPin.P2   // 右默认P2
    }

    //% blockId=linetracking_init
    //% block="初始化巡线传感器引脚|左探头%left|中探头%middle|右探头%right"
    //% inlineInputMode=external
    //% group="Line Tracking Sensor" weight=59
    export function initSensors(left: ServoPin, middle: ServoPin, right: ServoPin): void {
        pinMap[1] = left as number
        pinMap[2] = middle as number
        pinMap[3] = right as number
        line_isInitialized = true
    }
    //% blockId=linetracking_detect  
    //% block="%position 探头检测到黑线？"
    //% group="Line Tracking Sensor" weight=58
    export function detectLine(position: SensorSide): boolean {
        if (!line_isInitialized) return false
        let pin = pinMap[position]
        return pins.digitalReadPin(pin) === 1
    }

    //% blockId=linetracking_read_value
    //% block="读取%position 探头值"
    //% group="Line Tracking Sensor" weight=57
    export function readSensorValue(position: SensorSide): number {
        if (!line_isInitialized) return 0
        let pin = pinMap[position]
        return pins.digitalReadPin(pin)
    }
}