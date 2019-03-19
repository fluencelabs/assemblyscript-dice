import {JSONDecoder, JSONHandler} from "../node_modules/assemblyscript-json/assembly/decoder";

export enum Action {
    Roll = 1,
    Join = 2,
    GetBalance = 3,
    Unknown = 4,
    Error = 5
}

export abstract class Request {
    public action: Action = null;

    clear(): void {

    }
}

export class UnknownRequest extends Request {
    public message: string;

    constructor(message: string) {
        super();
        this.action = Action.Unknown;
        this.message = message;
    }

    clear(): void {
        super.clear();
        memory.free(changetype<usize>(this.message));
    }

}
export class JoinRequest extends Request {
    constructor() {
        super();
        this.action = Action.Join;
    }
}
export class RollRequest extends Request {
    public readonly playerId: u64;
    public betPlacement: u8;
    public betSize: u32;
    constructor(playerId: u64, betPlacement: u8, betSize: u32) {
        super();
        this.playerId = playerId;
        this.betPlacement = betPlacement;
        this.betSize = betSize;
        this.action = Action.Roll;
    }

    clear(): void {
        super.clear();
        memory.free(changetype<usize>(this.playerId));
    }
}
export class GetBalanceRequest extends Request {
    public playerId: u64;
    constructor(playerId: u64) {
        super();
        this.playerId = playerId;
        this.action = Action.GetBalance;
    }
}

export function decode(bytes: Uint8Array): Request {
    let jsonHandler = new RequestJSONEventsHandler();
    let decoder = new JSONDecoder<RequestJSONEventsHandler>(jsonHandler);

    decoder.deserialize(bytes);

    let action = jsonHandler.action;

    if (!action) {
        return new UnknownRequest("'action' field is not specified.")
    }

    let request: Request;

    if (action == "Join") {
        request = new JoinRequest();
    } else if (action == "Roll") {
        request = new RollRequest(jsonHandler.playerId, jsonHandler.betPlacement, jsonHandler.betSize)
    } else if (action == "GetBalance") {
        request = new GetBalanceRequest(jsonHandler.playerId)
    } else {
        request = new UnknownRequest("There is no request with action: " + action);
    }

    jsonHandler.clean();

    return request;
}

class RequestJSONEventsHandler extends JSONHandler {

    public action: string;
    public playerId: u64;
    public betPlacement: u8;
    public betSize: u32;
    public outcome: u8;
    public playerBalance: u64;

    clean(): void {
        memory.free(changetype<usize>(this.action));
    }

    setString(name: string, value: string): void {
        if (name == "action") {
            this.action = value;
        }
        // json scheme is not strict, so we won't throw an error on excess fields
    }

    setInteger(name: string, value: i64): void {

        if (name == "player_id") {
            this.playerId = value as u64;
        } else if (name == "bet_placement") {
            this.betPlacement = value as u8;
        } else if (name == "bet_size") {
            this.betSize = value as u32;
        } else if (name == "outcome") {
            this.outcome = value as u8;
        } else if (name == "player_balance") {
            this.playerBalance = value as u64;
        }

        // json scheme is not strict, so we won't throw an error on excess fields
    }

    pushObject(name: string): bool {
        return true;
    }
}
