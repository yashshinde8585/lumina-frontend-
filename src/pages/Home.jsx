import React from 'react';
import HomeNavbar from '../components/home/HomeNavbar';
import HomeHero from '../components/home/HomeHero';
import HomeFeatureShowcase from '../components/home/HomeFeatureShowcase';

import HomeHowItWorks from '../components/home/HomeHowItWorks';
import HomeFooter from '../components/home/HomeFooter';


const Home = () => {
    return (
        <div className="min-h-screen bg-[#FDFDFD] relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
            {/* Subtle Blue Blur on Right (Background) */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>

            <HomeNavbar />
            <HomeHero />
            <HomeFeatureShowcase />

            <HomeHowItWorks />
            <HomeFooter />

        </div>
    );
};

export default Home;
