import "./Header.css"
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footerDiv">
      <footer>
        <span>&copy; {currentYear} Holiday Card Game PS</span>
      </footer>
    </div>
  );

};
export default Footer;