import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children, className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center justify-between min-h-screen max-w-lg w-full p-4">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
