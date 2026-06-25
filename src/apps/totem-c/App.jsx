import HiddenReload from "../../shared/components/HiddenReload";
import backstageVideo from "./assets/video/totem5.mp4";

export default function App() {
  return (
    <>
      <HiddenReload />
      <div className="relative h-full w-full overflow-hidden bg-black">
        <video
          src={backstageVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </>
  );
}
