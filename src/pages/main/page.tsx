import Layout from "../layout/Layout";
import { Mapbox } from "../../components/maps/Map";

const MainPage = () => {
  console.log("main page loaded");
  return (
    <Layout>
      <Mapbox />
    </Layout>
  );
};

export default MainPage;
