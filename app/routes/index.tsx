import { LinksFunction, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};
export const meta: MetaFunction = () => {
  return {
    title: "Welcome to Jokes Demo!",
    description: "Sign in to laugh and share!😂",
  };
};
export default function NatalieIndex() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes.rss" reloadDocument={true}>
                RSS Feed
              </Link>
              <br />
              <Link to="jokes">Read Jokes</Link>
              <br />
              <Link to="login">Log In or Register</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="error-container">
      <h1>App Error</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
