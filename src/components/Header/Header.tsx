import DateTime from "components/DateTime/DateTime";
// import logo from "images/metrovalencia/isologo.svg"; // <-- Eliminado
import { Station } from "types/station";
import "./Header.scss";

type Props = {
  station: Station;
};

function Header(props: Props) {
  return (
    <header>
      {/* El logo se ha eliminado */}
      <div className="title">{props.station.name}</div>
      {/* El título original del medio se ha eliminado */}
      <DateTime />
    </header>
  );
}

export default Header;
