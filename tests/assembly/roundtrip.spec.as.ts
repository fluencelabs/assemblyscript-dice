import "allocator/arena";

import { invoke } from "../../assembly/index";

declare function logStr(str: string): void;
declare function logF64(val: f64): void;

export class SomeTest {

    static shouldHandleEmptyObject(): bool {
        return this.roundripTest("{\"test\": \"heloooooooooooooooooo\"}");
    }

    private static roundripTest(jsonString: string): bool {
        logStr("----------------------------------------------");
        let inputLen = jsonString.lengthUTF8;
        let utf8ptr = jsonString.toUTF8();

        let resultPtr = invoke(utf8ptr, inputLen);

        let resultLength: i32 = 0;

        for (let i = 3; i >= 0; i--) {
            let b = load<u8>(resultPtr + i) as i32;
            logF64(b);
            resultLength = resultLength + b << i * 8;
        }

        logF64(resultLength);
        logStr("result: " + String.fromUTF8(resultPtr + 4, resultLength));



        return true;
    }
}

