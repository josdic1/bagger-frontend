import { IdeaForm } from "../components/IdeaForm";
import { IdeaList } from "../components/IdeaList";

export function HomePage() {
  const asciiTitle = `
 ██████╗  █████╗  ██████╗  ██████╗ ███████╗██████╗ 
 ██╔══██╗██╔══██╗██╔════╝ ██╔════╝ ██╔════╝██╔══██╗
 ██████╔╝███████║██║  ███╗██║  ███╗█████╗  ██████╔╝
 ██╔══██╗██╔══██║██║   ██║██║   ██║██╔══╝  ██╔══██╗
 ██████╔╝██║  ██║╚██████╔╝╚██████╔╝███████╗██║  ██║
 ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝
                                    READY.`;

  return (
    <div className="main-content">
      <pre className="ascii-title" style={{ fontSize: '12px', textAlign: 'center' }}>
        {asciiTitle}
      </pre>
      
      <div className="grid-system">
        <IdeaForm />
        <IdeaList />
      </div>
    </div>
  );
}