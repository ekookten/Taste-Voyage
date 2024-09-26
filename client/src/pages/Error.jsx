import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="box has-text-centered">
              <h1 className="title has-text-danger">Oops!</h1>
              <p className="subtitle">Sorry, an unexpected error has occurred.</p>
              <p>
                <i>{error.statusText || error.message}</i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
