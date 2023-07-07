import "bulma/css/bulma.css";
import "@/styles/globals.css";

export const metadata = {
  title: "Minter",
  description: "A simple NFT minting application",
};

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div className="columns">
          <div className="column">
            <div className="container">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
