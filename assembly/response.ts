import {JSONEncoder} from "../node_modules/assemblyscript-json/assembly/encoder";

export abstract class Response {
    serialize(): string {
        unreachable();
        return "";
    };
}

export class JoinResponse extends Response {
    playerId: u64;
    constructor(playerId: u64) {
        super();
        this.playerId = playerId;
    }

    serialize(): string {
        let encoder = new JSONEncoder();
        encoder.setString("action", "Join");
        encoder.setInteger("playerId", this.playerId);

        return encoder.toString();
    }
}
export class RollResponse extends Response {
    public outcome: u8;
    public playerBalance: u64;

    constructor(outcome: u8, playerBalance: u64) {
        super();
        this.outcome = outcome;
        this.playerBalance = playerBalance;
    }

    serialize(): string {
        let encoder = new JSONEncoder();
        encoder.setString("action", "Roll");
        encoder.setInteger("outcome", this.outcome as i64);
        encoder.setInteger("player_balance", this.playerBalance as i64);

        return encoder.toString();
    }
}
export class GetBalanceResponse extends Response {
    public playerBalance: u64;
    constructor(playerBalance: u64) {
        super();
        this.playerBalance = playerBalance;
    }

    serialize(): string {
        let encoder = new JSONEncoder();
        encoder.setString("action", "GetBalance");
        encoder.setInteger("playerBalance", this.playerBalance as i32);

        return encoder.toString();
    }
}
export class ErrorResponse extends Response {
    message: string;
    constructor(message: string) {
        super();
        this.message = message;
    }

    serialize(): string {
        let encoder = new JSONEncoder();
        encoder.setString("action", "Error");
        encoder.setString("message", this.message);

        return encoder.toString();
    }
}
