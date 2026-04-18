import CustomizePoster from "./CustomizePoster";

const EventPoster = () => {
  return <CustomizePoster templateType="Event" defaultData={{
    text: "Event Name",
    textColor: "#0000FF",
    date: "DD/MM/YYYY",
    dateColor: "#0000FF",
    venue: "Venue Address",
    venueColor: "#0000FF",
    logo: ""
  }} />;
};

export default EventPoster;
