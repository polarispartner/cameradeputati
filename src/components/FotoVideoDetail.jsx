import { useParams, useNavigate } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import bgImg from "../assets/images/ruolo-donne-bg.jpg";
import { SECTIONS, FOTO_VIDEO } from "../data/ruoloDonne";

const THEME = "#1ed0c7";

export default function FotoVideoDetail() {
  const { sectionId, itemId } = useParams({
    from: "/donne/$sectionId/foto/$itemId",
  });
  const navigate = useNavigate();

  const section = SECTIONS.find((s) => s.id === sectionId);
  const item = (FOTO_VIDEO[sectionId] || []).find((it) => it.id === itemId);

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-black">
      <Sidebar
        bgColor={THEME}
        showBack
        onBack={() =>
          navigate({ to: "/donne/$sectionId/foto", params: { sectionId } })
        }
      />

      <main className="relative flex-1 overflow-hidden">
        <img
          src={bgImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/80" />

        <div className="relative flex h-full w-full min-h-0 flex-col px-[4rem] py-[2.5rem]">
          <header className="shrink-0">
            <h1
              className="text-[4.5rem] leading-[1] font-black tracking-tight"
              style={{ color: THEME }}
            >
              {section?.title ?? "Sezione"}
            </h1>
            <h2 className="mt-[0.5rem] text-[2.75rem] leading-[1] font-black tracking-tight text-white">
              Foto/Video
            </h2>
          </header>

          <div className="mt-[2rem] flex min-h-0 flex-1 gap-[3rem]">
            <div className="flex min-h-0 w-1/2 items-center justify-center">
              {item?.image && (
                <img
                  src={item.image}
                  alt=""
                  draggable={false}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>

            <div className="flex min-h-0 w-1/2 items-center">
              <p className="max-h-full overflow-hidden text-[1.5rem] leading-[1.5] font-medium text-white">
                {item?.description ?? ""}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
