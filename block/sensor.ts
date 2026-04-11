//#########################################################################
//##################################其余的传感器#################################
//#########################################################################
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

    //----------------------------------摇杆-------------------------------
    //% blockId=rocker
    //% block="read joystick %direction value"
    //% group="Joystick" weight=49
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
    //% block="joystick detects %orientation?"
    //% group="Joystick" weight=48
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