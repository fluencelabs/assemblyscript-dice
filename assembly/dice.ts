import { JSONDecoder } from "../node_modules/assemblyscript-json/assembly/decoder";
import { JSONEncoder } from "../node_modules/assemblyscript-json/assembly/encoder";

const PLAYERS_MAX_COUNT: usize = 1024;
const SEED: u64 = 12345678;
// the account balance of new players
const INIT_ACCOUNT_BALANCE: u64 = 100;
// if win, player receives bet_amount * PAYOUT_RATE money
const PAYOUT_RATE: u64 = 5;

export function handler(input: string): string {

    return "";
}
