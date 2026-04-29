//----------------------------------超声波-------------------------------
enum UltrasonicPin {
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
    P15 = DigitalPin.P15,
    //% block="P16" 
    P16 = DigitalPin.P16
}
namespace FIFAbit {
    // 存储引脚配置
    let trigPin: UltrasonicPin
    let echoPin: UltrasonicPin
    let ultrasonic_isInitialized = false

    //% blockId=ultrasonic_init
    //% block="init ultrasonic|Trig %trig|Echo %echo"
    //% inlineInputMode=external
    //% trig.defl=UltrasonicPin.P0
    //% echo.defl=UltrasonicPin.P1
    //% group="Ultrasonic" weight=9
    export function initUltrasonic(trig: UltrasonicPin, echo: UltrasonicPin): void {
        trigPin = trig
        echoPin = echo
        ultrasonic_isInitialized = true

        // 初始化引脚
        pins.digitalWritePin(trigPin, 0)
        pins.setPull(echoPin, PinPullMode.PullNone)
    }

    //% blockId=ultrasonic_read_distance
    //% block="read distance (cm)"
    //% group="Ultrasonic" weight=8
    export function readDistance(): number {
        if (!ultrasonic_isInitialized) {
            return 0
        }

        // 发送50us的高电平脉冲
        pins.digitalWritePin(trigPin, 0)
        basic.pause(1)

        pins.digitalWritePin(trigPin, 1)
        control.waitMicros(50)
        pins.digitalWritePin(trigPin, 0)
        

        // 读取高电平持续时间
        // 注意：pins.pulseIn返回的是微秒
        let duration = pins.pulseIn(echoPin, PulseValue.High, 50000)  // 50ms超时

        // 计算距离（厘米）
        // 声音速度：340m/s = 34000cm/s = 0.034cm/μs
        // 往返距离除以2
        let distance = duration * 0.034 / 2 * 1.0

        // 限制有效范围（通常超声波模块有效范围2-400cm）
        if (distance < 2 || distance > 400) {
            distance = 0
        }

        return Math.round(distance)
    }
}