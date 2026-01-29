import ResetScroll from "../components/ResetScroll";

export default function AppLayout({ children }) {
  return (
    <>
      <ResetScroll/>
      {/* Dynamic animated background */}
        <div className="animated-background">
            <div className="blob blob1"></div>
            <div className="blob blob2"></div>
            <div className="blob blob3"></div>
            <div className="blob blob4"></div>
        </div>

      {/* Page content */}
      {children}
    </>
  );
}
