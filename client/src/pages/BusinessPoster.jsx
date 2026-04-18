import CustomizePoster from "./CustomizePoster";

const BusinessPoster = () => {
  return <CustomizePoster templateType="Business" defaultData={{
    text: "Your Business Name",
    textColor: "#000000",
    phone: "9876543210",
    phoneColor: "#000000",
    email: "contact@example.com",
    emailColor: "#000000",
    logo: ""
  }} />;
};

export default BusinessPoster;
