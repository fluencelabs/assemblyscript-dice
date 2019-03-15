import {JSONEncoder} from "../node_modules/assemblyscript-json/assembly/encoder";
import {ErrorResponse, GetBalanceResponse, JoinResponse, Response, RollResponse} from "./response";

const PLAYERS_MAX_COUNT: i32 = 1024;
const SEED: u64 = 12345678;
// the account balance of new players
const INIT_ACCOUNT_BALANCE: u64 = 100;
// if win, player receives bet_amount * PAYOUT_RATE money
const PAYOUT_RATE: u64 = 5;
const DICE_LINE_COUNT: u8 = 6;

export class GameManager {

    registeredPlayers: u64 = 0;
    playerIds: u64[] = [];
    playerBalance: Map<u64, u64> = new Map<u64, u64>();
    encoder: JSONEncoder = new JSONEncoder();

    constructor() {
        NativeMath.seedRandom(SEED);
    }

    join(): Response {
        // delete the oldest player, if maximum players reach
        if (this.playerIds.length >= PLAYERS_MAX_COUNT) {
            let lastPlayer = this.playerIds.pop();
            this.playerBalance.delete(lastPlayer);
        }

        this.playerIds.push(this.registeredPlayers);
        this.playerBalance.set(this.registeredPlayers, INIT_ACCOUNT_BALANCE);

        let response = new JoinResponse(this.registeredPlayers);

        this.registeredPlayers += 1;

        return response;
    }

    roll(playerId: u64, betPlacement: u8, betSize: u32): Response {

        if (betPlacement > DICE_LINE_COUNT) {
            return new ErrorResponse("Incorrect placement, please choose number from 1 to 6")
        }

        if (!this.playerBalance.has(playerId)) {
            return new ErrorResponse("There is no player with such id: " + playerId.toString())
        }

        let balance = this.playerBalance.get(playerId);

        if (betSize > balance) {
            return new ErrorResponse(`Player hasn't enough money: player's current balance is ${balance.toString()} while the bet is ${betSize.toString()}`)
        }

        let outcome = ((NativeMath.random() * 1000000000) % DICE_LINE_COUNT - 1) as u8;

        if (betPlacement === outcome) {
            balance = balance + (betSize * PAYOUT_RATE);
        } else {
            balance = balance - betSize;
        }

        this.playerBalance.set(playerId, balance);

        return new RollResponse(outcome, balance);
    }

    getBalance(playerId: u64): Response {
        if (!this.playerBalance.has(playerId)) {
            return new ErrorResponse("There is no player with id: " + playerId.toString());
        }
        return new GetBalanceResponse(this.playerBalance.get(playerId));
    }
}
