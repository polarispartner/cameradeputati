import bgImg from "../../shared/assets/homepage-bg.jpg";
import HiddenReload from "../../shared/components/HiddenReload";

export default function App() {
  return (
    <>
      <HiddenReload />
      <div className="relative h-full w-full overflow-hidden bg-black">
        <img
          src={bgImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex h-full w-full flex-col items-center justify-center px-[3rem] text-center text-white">
          <h1 className="text-[6rem] leading-[1] font-black tracking-tight">Totem B</h1>
          <p className="mt-[2rem] text-[2.5rem] font-medium opacity-80">in arrivo</p>
        </div>
      </div>
    </>
  );
}
