export { default } from "next-auth/middleware";

export const config = { matcher: ["/apuntes/crear","/apuntes/crear/:path*"] };
