import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import { Route, Routes } from 'react-router-dom';


import Layout from './components/shared/Layout';
import HomePage from './pages/home';
import View from './pages/view.jsx'
import Test from './pages/test.jsx'
import Test1 from './components/application-ui/forms/comboboxes/with_status_indicator.jsx'
import AdminConf from './pages/admin.jsx'
import Seller from './pages/seller.jsx'
import Payment from "./components/ecommerce/page-examples/checkout-pages/single_step_with_order_summary.jsx"
import Register from "./components/application-ui/forms/sign-in-forms/simple_card_reg.jsx"
import Login from "./components/application-ui/forms/sign-in-forms/simple_card.jsx"
import AdminPayment from "./components/application-ui/page-examples/home-screens/stacked.jsx"
import Filters
    from "./components/ecommerce/components/category-filters/with_inline_actions_and_expandable_sidebar_filters";
import Cards1 from "./components/ecommerce/components/product-lists/with_border_grid";
import React from "react";
import './index.css'; // Import your CSS file




function App() {

  return (
    <>
      <Routes>
        <Route path="/products/" element={<HomePage />} />
        <Route path="/product/:id" index element={<View />} />
        <Route path="/admin/" index element={<AdminPayment />} />
        <Route path="/seller/:id" index element={<Seller />} />
        <Route path="/payment" index element={<Payment />} />
        <Route path="/register" index element={<Register />} />
        <Route path="/login" index element={<Login />} />
          <Route path="/test"  element={<Test />} />
      </Routes>
      <AdminConf />
    </>
  );
}

export default App;
