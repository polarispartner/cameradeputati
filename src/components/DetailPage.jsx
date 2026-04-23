import { useParams, useNavigate } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import { findTopic, findSection, findSubsection, findItem } from "../data/content";

export default function DetailPage() {
  const { topicId, sectionId, subType, itemId } = useParams({
    from: "/t/$topicId/$sectionId/$subType/$itemId",
  });
  const navigate = useNavigate();

  const topic = findTopic(topicId);
  const section = findSection(topicId, sectionId);
  const subsection = findSubsection(topicId, sectionId, subType);
  const item = findItem(topicId, sectionId, subType, itemId);

  if (!topic) return null;

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-black">
      <Sidebar
        bgColor={topic.theme}
        showBack
        onBack={() =>
          navigate({
            to: "/t/$topicId/$sectionId/$subType",
            params: { topicId, sectionId, subType },
          })
        }
      />

      <main className="relative flex-1 overflow-hidden">
        <img
          src={topic.bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/80" />

        <div className="relative flex h-full w-full min-h-0 flex-col px-[4rem] py-[2.5rem]">
          <header className="shrink-0">
            <h1
              className="text-[4.5rem] leading-[1] font-black tracking-tight"
              style={{ color: topic.theme }}
            >
              {section?.title ?? "Sezione"}
            </h1>
            <h2 className="mt-[0.5rem] text-[2.75rem] leading-[1] font-black tracking-tight text-white">
              {subsection?.title ?? ""}
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
