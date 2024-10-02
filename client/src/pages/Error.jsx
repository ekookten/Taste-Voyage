import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  // Retrieve the error object from the routing context
  const error = useRouteError();
  
  // Log the error to the console for debugging
  console.error(error);

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="box has-text-centered">
              {/* Display a title indicating an error occurred */}
              <h1 className="title has-text-danger">Oops!</h1>
              {/* Subtitle informing the user about the error */}
              <p className="subtitle">Sorry, an unexpected error has occurred.</p>
              {/* Display the error message or status text if available */}
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
