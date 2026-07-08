import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="page-section">
        <div className="container">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;