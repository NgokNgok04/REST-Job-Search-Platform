import jwt from "jsonwebtoken";

export function generateToken(username: string) {
    return jwt.sign({ username }, "secret", {expiresIn: "1h"});
}
