import React from "react";
import HeroSlider from "../components/home/HeroSlider";
import Notice from "./Notices"
import About from "./About"
import Gallery from './Gallery'
const Home = () => {
  return (
    <div>
      <HeroSlider/>
      <Notice/>
      <Gallery/>

      <About/>
      
    </div>
  );
};

export default Home;
