import config from "@/config";
import ms from "ms";

export const ACTIVATION_DURATION = ms('14d');
export const REFRESH_EXPIRY_DURATION = ms(config.REFRESH_TOKEN_EXPIRATION)
