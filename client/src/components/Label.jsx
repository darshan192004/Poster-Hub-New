// src/components/ui/label.jsx
const Label = ({ htmlFor, children }) => {
    return <label htmlFor={htmlFor} className="text-gray-700">{children}</label>;
  };
  
  export default Label; // Default export
   