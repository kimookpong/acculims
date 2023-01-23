import { BrowserRouter as Router, Link } from "react-router-dom";
const MenuComponent = () => {
  return (
    <div>
      <div>
        <ul className="horizon-menu">
          <li>
            <Link to="/">Main</Link>
          </li>
          <li>
            <Link to="/lab_req">ใบรับ LAB</Link>
          </li>
          <li>
            <Link to="/lab_report">รายงานผล LAB</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuComponent;
