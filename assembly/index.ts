// import "allocator/tlsf";
import {handler} from "./dice";
import {JSONDecoder, JSONHandler} from "../node_modules/assemblyscript-json/assembly/decoder";
//import "allocator/buddy";
//import "allocator/arena";

export function allocate(size: i32) :i32 {
  return memory.allocate(size);
}

export function deallocate(ptr: i32, size: i32): void {
  memory.free(ptr);
}

export function invoke(ptr: i32, size: i32): i32 {

    let bb: Uint8Array = new Uint8Array(size);

    for (let i = 0; i < size; i++) {
        bb[i] = load<u8>(ptr + i)
    }

    let jsonHandler = new ToDictJSONEventsHandler();
    let decoder = new JSONDecoder<ToDictJSONEventsHandler>(jsonHandler);

    decoder.deserialize(bb);

    let result = jsonHandler.strings.get("test");

    let strLen: i32 = result.length;
    let addr = memory.allocate(strLen + 4);
    for (let i = 0; i < 4; i++) {
      let b: u8 = (strLen >> i * 8) as u8 & 0xFF;
      store<u8>(addr + i, b);
    }

    let strAddr = addr + 4;
    for (let i = 0; i < strLen; i++) {
        let b: u8 = result.charCodeAt(i) as u8;
      store<u8>(strAddr + i, b);
    }

    return addr;
}

class JoinRequest {}
class RollRequest {
    public player_id: u64;
    public bet_placement: u8;
    public bet_size: u32;
    constructor(player_id: u64 ,bet_placement: u8, bet_size: u32) {
        this.player_id = player_id;
        this.bet_placement = bet_placement;
        this.bet_size = bet_size;
    }
}
class GetBalanceRequest {
    public player_id: u64;
    constructor(player_id: u64) {
        this.player_id = player_id;
    }
}

class JoinResponse {
    player_id: u64;
    constructor(player_id: u64) {
        this.player_id = player_id;
    }
}
class RollResponse {
    public outcome: u8;
    public player_balance: u64;
    constructor(outcome: u64 ,player_balance: u8, bet_size: u32) {
        this.outcome = outcome;
        this.player_balance = player_balance;
    }
}
class GetBalanceResponse {
    public player_balance: u64;
    constructor(player_balance: u64) {
        this.player_balance = player_balance;
    }
}
class ErrorResponse {
    message: string;
    constructor(message: string) {
        this.message = message;
    }
}

class ToDictJSONEventsHandler extends JSONHandler {

    public strings: Map<string, string> = new Map();
    public booleans: Map<string, bool> = new Map();
    public integers: Map<string, i64> = new Map();

    setString(name: string, value: string): void {
        this.strings.set(name, value);
    }

    setBoolean(name: string, value: bool): void {
        this.booleans.set(name, value);
    }

    setNull(name: string): void {
    }

    setInteger(name: string, value: i64): void {
        this.integers.set(name, value);
    }

    pushArray(name: string): bool {
        return true;
    }

    popArray(): void {
    }

    pushObject(name: string): bool {
        return true;
    }

    popObject(): void {
    }
}
