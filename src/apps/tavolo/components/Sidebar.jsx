import { useNavigate } from "@tanstack/react-router";
import logoCamera from "../assets/images/Camera_dei_deputati_negativo@4x.png";
import logo80 from "../assets/images/Logo_80_bianco_verticale@4x.png";
import logo1946 from "../assets/images/LOGO 1946 white@4x.png";
import homeIcon from "../../../shared/assets/home.png";

export default function Sidebar({ bgColor = "#063955", showBack = false, onBack }) {
  const navigate = useNavigate();

  return (
    <aside
      className="relative z-10 flex w-[20%] flex-col px-[2.25rem] py-[2rem] text-white"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-start justify-between">
        <img
          src={logoCamera}
          alt="Camera dei deputati"
          className="h-[4rem] w-auto"
          draggable={false}
        />
        <img src={logo80} alt="80°" className="h-[4rem] w-auto" draggable={false} />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <img
          src={logo1946}
          alt="1945 1946 1947"
          className="h-auto w-full object-contain"
          draggable={false}
        />

        <h1 className="mt-[1.5rem] text-[3rem] leading-[3rem] font-black">
          Nasce la
          <br />
          Repubblica
        </h1>

        <p className="mt-[1rem] text-[2.5rem] leading-[2.75rem] font-medium">
          L'Assemblea Costituente
          <br />a Montecitorio
        </p>
      </div>

      <div className="flex items-center justify-between gap-[1rem]">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          aria-label="Home"
          className="flex h-[3.75rem] w-[3.75rem] cursor-pointer items-center justify-center rounded-full transition-opacity duration-150 active:opacity-70"
        >
          <img src={homeIcon} alt="" className="h-[2rem] w-auto" draggable={false} />
        </button>

        {showBack && (
          <button
            type="button"
            onClick={() => (onBack ? onBack() : navigate({ to: "/menu" }))}
            className="flex cursor-pointer items-center gap-[0.75rem] rounded-full bg-white px-[1.5rem] py-[0.75rem] transition-opacity duration-150 active:opacity-80"
            style={{ color: bgColor }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[1.5rem] w-[1.5rem]"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="20" y1="12" x2="5" y2="12" />
              <polyline points="11 18 5 12 11 6" />
            </svg>
            <span className="text-[1.5rem] font-bold">Back</span>
          </button>
        )}
      </div>
    </aside>
  );
}
