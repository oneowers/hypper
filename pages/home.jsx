import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


import Filters from '../components/ecommerce/components/category-filters/with_inline_actions_and_expandable_sidebar_filters.jsx';
import Cards from '../components/Cards.jsx';
import Cards1 from '../components/ecommerce/components/product-lists/with_border_grid.jsx'
import Footer from '../components/marketing/sections/footers/4_column_with_company_mission.jsx';
import HeaderCategories from '../components/ecommerce/components/store-navigation/with_simple_menu_and_promo.jsx'

function HomePage() {
  return (
    <>
    
    <HeaderCategories />
        <Routes>
            <Route index element={<Filters />} />
        </Routes>
      <Footer/>

    </>
  );
}

export default HomePage;
