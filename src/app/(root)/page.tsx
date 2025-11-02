import Header from "./_components/Header";
import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      <div className="mx-auto max-w-[1900px]">
        <Header />

        {/* Mobile: Stack | Desktop: Responsive Split */}
        <div className="flex flex-col lg:flex-row gap-4 h-[90vh]">
          {/* Left Panel (Editor) */}
          <div
            className="bg-gray-900 rounded-xl overflow-hidden h-[50vh] lg:h-full
            flex-grow lg:flex-[3] min-w-[300px] lg:min-w-[40%] xl:min-w-[50%]"
          >
            <EditorPanel />
          </div>

          {/* Right Panel (Output) */}
          <div
            className="bg-gray-800 rounded-xl 
             lg:flex-[2] min-w-[250px] h-[45vh] sm:h-[55vh] lg:h-full"
          >
            <OutputPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
