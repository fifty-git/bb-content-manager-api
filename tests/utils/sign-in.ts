import { Jwt } from "hono/utils/jwt";
import { JWT_SECRET } from "~/modules/env";

const EXPIRES_IN = 24 * 60 * 60 * 1000;
const now = new Date();
const expiresIn = new Date(now.getTime() + EXPIRES_IN);
const token = await Jwt.sign({ firstname: "BUN", lastname: "TEST", roles: ["user"], user_id: 23, expiresIn }, JWT_SECRET);

export default token;
