//#########################################################################
//##################################其余的传感器（电位器、土壤湿度、按钮）#################################
//#########################################################################
enum PotPin {
    //% block="P0"
    P0 = AnalogPin.P0,
    //% block="P1"
    P1 = AnalogPin.P1,
    //% block="P2"
    P2 = AnalogPin.P2
}

namespace FIFAbit {
    //----------------------------------电位器-------------------------------
    //% blockId=potentiometer_read_raw
    //% block="read potentiometer %pin raw value"
    //% group="Potentiometer" weight=99
    export function readRawValue(pin: PotPin): number {
        // 直接读取模拟值，范围0-1023
        return pins.analogReadPin(pin as number)
    }

    //% blockId=potentiometer_read_percent
    //% block="read potentiometer %pin percentage"
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
    //% block="read soil moisture %pin raw value"
    //% group="Soil Moisture Sensor" weight=89
    export function readRawValueTR(pin: PotPin): number {
        // 直接读取模拟值，范围0-1023
        return pins.analogReadPin(pin as number)
    }

    //% blockId=soil_read_percent
    //% block="read soil moisture %pin percentage"
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
    //% block="button %pin is pressed?"
    //% group="Button" weight=79
    export function isPressed(pin: ServoPin): boolean {
        let value = pins.digitalReadPin(pin as number)
        // 返回 true 表示按下
        return value === 0
    }
}