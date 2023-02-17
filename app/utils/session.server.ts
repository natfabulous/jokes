import { compare, hash } from "bcryptjs";
import { db } from "./db.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node"; // or cloudflare/deno

type LoginForm = {
  username: string;
  password: string;
};

export const login = async ({ username, password }: LoginForm) => {
  const user = await db.user.findFirst({
    where: { username },
  });
  if (!user) return null;
  let match = false;
  match = await compare(password, user.passwordHash);
  if (!match) return null;
  return { id: user.id, username };
};

export const register = async ({ username, password }: LoginForm) => {
  console.log(`about to hash ${password}`);
  const passwordHash = await hash(password, 10);
  console.log("hash:", passwordHash);
  const user = await db.user.create({
    data: {
      username,
      passwordHash,
    },
  });
  return { id: user.id, username };
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

const getUserSession = async (request: Request) => {
  return await storage.getSession(request.headers.get("Cookie"));
};

export const getUserId = async (request: Request) => {
  const session = getUserSession(request);
  const userId = (await session)?.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
};

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

// if we cannot find the current user in the database, end the session (logout)
export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: { "Set-Cookie": await storage.destroySession(session) },
  });
}
