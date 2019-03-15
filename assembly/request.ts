import {JSONDecoder, JSONHandler} from "../node_modules/assemblyscript-json/assembly/decoder";

export abstract class Request {
    public action: string = "";
}

export class UnknownRequest extends Request {
    public message: string;

    constructor(message: string) {
        super();
        this.action = "unknown";
        this.message = message;
    }

}
export class JoinRequest extends Request {
    constructor() {
        super();
        this.action = "Join";
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
        this.action = "Roll";
    }
}
export class GetBalanceRequest extends Request {
    public playerId: u64;
    constructor(playerId: u64) {
        super();
        this.playerId = playerId;
        this.action = "GetBalance";
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

    if (action === "Join") {
        return new JoinRequest();
    } else if (action === "Roll") {
        return new RollRequest(jsonHandler.playerId, jsonHandler.betPlacement, jsonHandler.betSize)
    } else if (action === "GetBalance") {
        return new GetBalanceRequest(jsonHandler.playerId)
    } else {
        return new UnknownRequest("There is no request with action: " + action);
    }
}

class RequestJSONEventsHandler extends JSONHandler {

    public action: string;
    public playerId: u64;
    public betPlacement: u8;
    public betSize: u32;
    public outcome: u8;
    public playerBalance: u64;

    setString(name: string, value: string): void {
        if (name === "action") {
            this.action = value;
        }
        // json scheme is not strict, so we won't throw an error on excess fields
    }

    setInteger(name: string, value: i64): void {

        if (name == "playerId") {
            this.playerId = value as u64;
        } else if (name === "betPlacement") {
            this.betPlacement = value as u8;
        } else if (name === "betSize") {
            this.betSize = value as u32;
        } else if (name === "outcome") {
            this.outcome = value as u8;
        } else if (name === "playerBalance") {
            this.playerBalance = value as u64;
        }

        // json scheme is not strict, so we won't throw an error on excess fields
    }

    pushObject(name: string): bool {
        return true;
    }
}
