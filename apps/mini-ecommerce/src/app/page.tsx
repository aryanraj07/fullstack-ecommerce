import Link from "next/link";
import CategoriesSection from "./components/home/CategoriesSection";
import HeroSection from "./components/home/HeroSection";
const Home = async () => {
  return (
    <div className=" min-h-screen ">
      <HeroSection />
      <div className="container-custom mt-5">
        <CategoriesSection />
      </div>
    </div>
  );
};

export default Home;
