    import React, { ReactNode } from "react";
    import { BrowserRouter as Router } from "react-router-dom";
    import Navbar from "../components/navbar";


    interface TemplateProps {
        children: ReactNode;
    }

    const Template:React.FC<TemplateProps> = ({children}) => {
        return (
        <>  
            <Navbar />
        <div>
        
        <div className="h-full w-11/12 bg-slate-200 relative  -z-10 float-right rounded-lg mr-3">
    {children}
        </div>
        </div>
        
        
        
        
        

    
        </>
        );
    }

    export default Template;
