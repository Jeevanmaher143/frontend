import React from "react";
import HeroSlider from "../components/home/HeroSlider";
import Notice from "./Notices"
import About from "./About"
const Home = () => {
  return (
    <div>
      <HeroSlider/>
      <Notice/>

      <About/>
      
    </div>
  );
};

export default Home;
