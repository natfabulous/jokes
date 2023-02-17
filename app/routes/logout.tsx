import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
  return logout(request);
};

// AFAICT we do not mutate state in this loader because it can
// expose the site to CSRF
export const loader = async () => {
  return redirect("/");
};
