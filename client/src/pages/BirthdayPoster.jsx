import CustomizePoster from "./CustomizePoster";

const BirthdayPoster = () => {
  return <CustomizePoster templateType="Birthday" defaultData={{
    text: "Happy Birthday!",
    textColor: "#FF69B4",
    name: "John Doe",
    nameColor: "#FF69B4",
    date: "01-01-2025",
    dateColor: "#FF69B4",
    logo: ""
  }} />;
};

export default BirthdayPoster;
