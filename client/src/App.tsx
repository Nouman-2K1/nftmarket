import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import MarketPlace from "./modules/Marketplace";
import CreateNFT from "./modules/NFTMinting";
import Profile from "./modules/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main/marketplace" />} />
      <Route path="/main" element={<MainLayout />}>
        <Route path="marketplace" element={<MarketPlace />} />
        <Route path="create-nft" element={<CreateNFT />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
