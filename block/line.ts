//----------------------------------巡线-------------------------------
enum LineSensorPin {
    //% block="P0" weight=10
    P0 = DigitalPin.P0,
    //% block="P1" weight=9
    P1 = DigitalPin.P1,
    //% block="P2" weight=8
    P2 = DigitalPin.P2,
    //% block="P8" weight=7
    P8 = DigitalPin.P8,
    //% block="P12" weight=6
    P12 = DigitalPin.P12,
    //% block="P13" weight=5
    P13 = DigitalPin.P13,
    //% block="P15" weight=4
    P15 = DigitalPin.P15,
    //% block="P16" weight=3
    P16 = DigitalPin.P16
}

enum SensorSide {
    //% block="左"
    Left = 1,
    //% block="中"
    Middle = 2,
    //% block="右"
    Right = 3
}

namespace FIFAbit {
    // 存储三个传感器的引脚
    let leftPin: LineSensorPin
    let middlePin: LineSensorPin
    let rightPin: LineSensorPin
    let line_isInitialized = false

    // 引脚映射表
    let pinMap: { [key: number]: LineSensorPin } = {
        1: LineSensorPin.P0,  // 左默认P0
        2: LineSensorPin.P1,  // 中默认P1
        3: LineSensorPin.P2   // 右默认P2
    }

    //% blockId=linetracking_init
    //% block="初始化巡线传感器引脚|左探头%left|中探头%middle|右探头%right"
    //% inlineInputMode=external
    //% left.defl=LineSensorPin.P0
    //% middle.defl=LineSensorPin.P1
    //% right.defl=LineSensorPin.P2
    //% group="Line Tracking Sensor" weight=59
    export function initSensors(left: LineSensorPin, middle: LineSensorPin, right: LineSensorPin): void {
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