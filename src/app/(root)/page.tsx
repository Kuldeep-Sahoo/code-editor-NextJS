import Header from "./_components/Header";
import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";
import SplitLayout from "./_components/SplitLayout";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      <div className="mx-auto max-w-[1900px]">
        <Header />

        <div className="h-[90vh]">
          <SplitLayout
            editorPanel={<EditorPanel />}
            outputPanel={<OutputPanel />}
          />
        </div>
      </div>
    </div>
  );
}
