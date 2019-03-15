import {decode, GetBalanceRequest, JoinRequest, Request, RollRequest, UnknownRequest} from "./request";
import {ErrorResponse} from "./response";
import {GameManager} from "./dice";

let gameManager = new GameManager();

// returns string, because serialization to a byte array is not compatible with our invoke handlers
export function handler(requestBytes: Uint8Array): string {

    let request: Request = decode(requestBytes);

    if (request.action === "Join") {
        return gameManager.join().serialize();
    } else if (request.action === "Roll") {
        let r = request as RollRequest;
        return gameManager.roll(r.playerId, r.betPlacement, r.betSize).serialize();
    } else if (request.action === "GetBalance") {
        let r = request as GetBalanceRequest;
        return gameManager.getBalance(r.playerId).serialize();
    } else if (request.action === "unknown") {
        let r = request as UnknownRequest;
        return (new ErrorResponse(r.message)).serialize();
    }

    let response = new ErrorResponse("Unereachable: " + request.action);
    return response.serialize();
}
