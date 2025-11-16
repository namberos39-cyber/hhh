import logo from "images/metrovalencia/isologo.svg";
import { CircleSpinner } from "react-spinners-kit";
import "./styles.scss";

export enum StatusType {
  Error = 0,
  Loading,
}

type Props = {
  full: boolean;
  type: StatusType;
};

function Status({ full, type }: Props) {
  return (
    <section className="status">
      {full && (
        <>
          <img className="logo" src={logo} alt="Logo" />
          <hr />
        </>
      )}
      {type === StatusType.Error && (
        <div className="description">
          <div>Les estimacions no estan disponibles</div>
          {/* <div>Las estimaciones no están disponibles</div> <-- Eliminado */}
        </div>
      )}
      {type === StatusType.Loading && (
        // Color del spinner cambiado a color LED
        <CircleSpinner color="#FFFFE0" size={60} />
      )}
    </section>
  );
}

export default Status;
